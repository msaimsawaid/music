const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Album = require('../models/Album');

const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
};

let token;
let userId;

describe('Album API', () => {
    beforeEach(async () => {
        // Create user and get token
        await request(app).post('/api/auth/register').send(mockUser);
        const res = await request(app).post('/api/auth/login').send({
            email: mockUser.email,
            password: mockUser.password
        });
        token = res.body.token;
        userId = res.body.data.user._id;
    });

    describe('POST /api/albums', () => {
        it('should create a new album', async () => {
            const res = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Album',
                    artist: 'Test Artist',
                    genre: 'Test Genre'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.album).toHaveProperty('title', 'Test Album');
        });

        it('should fail without required fields', async () => {
            const res = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    genre: 'Test Genre'
                });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('PATCH /api/albums/:id', () => {
        it('should update the album', async () => {
            // Create an album first
            const createRes = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Album to Update',
                    artist: 'Artist',
                    genre: 'Genre'
                });
            const idToUpdate = createRes.body.data.album._id;

            const res = await request(app)
                .patch(`/api/albums/${idToUpdate}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Album Title'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.album).toHaveProperty('title', 'Updated Album Title');
        });
    });

    describe('Role Based Access Control', () => {
        it('should allow admin to delete any album', async () => {
            // 1. Create Admin User
            const adminUser = {
                username: 'admin',
                email: 'admin@example.com',
                password: 'adminpassword'
            };
            await request(app).post('/api/auth/register').send(adminUser);

            // Manually promote to admin in DB
            await User.findOneAndUpdate({ email: adminUser.email }, { role: 'admin' });

            const loginRes = await request(app).post('/api/auth/login').send({
                email: adminUser.email,
                password: adminUser.password
            });
            const adminToken = loginRes.body.token;

            // 2. Create Album as Normal User (using 'token' from beforeEach)
            const albumRes = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'User Album',
                    artist: 'User Artist',
                    genre: 'Pop'
                });
            const otherUserAlbumId = albumRes.body.data.album._id;

            // 3. Admin deletes the album
            const deleteRes = await request(app)
                .delete(`/api/albums/${otherUserAlbumId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(deleteRes.statusCode).toBe(204);
        });

        it('should NOT allow normal user to delete others album', async () => {
            const uniqueId = Date.now();
            // 1. Create Owner User
            const ownerUser = {
                username: `owner_${uniqueId}`,
                email: `owner_${uniqueId}@example.com`,
                password: 'password123'
            };
            await request(app).post('/api/auth/register').send(ownerUser);
            const ownerLogin = await request(app).post('/api/auth/login').send({
                email: ownerUser.email,
                password: ownerUser.password
            });
            const ownerToken = ownerLogin.body.token;

            // 2. Create Attacker User
            const attackerUser = {
                username: `attacker_${uniqueId}`,
                email: `attacker_${uniqueId}@example.com`,
                password: 'password123'
            };
            await request(app).post('/api/auth/register').send(attackerUser);
            const attackerLogin = await request(app).post('/api/auth/login').send({
                email: attackerUser.email,
                password: attackerUser.password
            });
            const attackerToken = attackerLogin.body.token;

            // 3. Create Album as Owner
            const albumRes = await request(app)
                .post('/api/albums')
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    title: 'Owner Album',
                    artist: 'Owner',
                    genre: 'Rock'
                });

            const albumId = albumRes.body.data.album._id;

            // 4. Attacker tries to delete album
            const deleteRes = await request(app)
                .delete(`/api/albums/${albumId}`)
                .set('Authorization', `Bearer ${attackerToken}`);

            expect([403, 401]).toContain(deleteRes.statusCode);
        });
    });
});
