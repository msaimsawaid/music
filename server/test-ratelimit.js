
const http = require('http');

console.log('🔍 Testing Rate Limiting...');
console.log('==============================\n');

// Test 1: Check rate limit headers
console.log('1. Testing API rate limit headers:');
const req1 = http.request('http://localhost:5000/api/albums', (res) => {
  console.log(`   Status: ${res.statusCode}`);
  
  let foundHeaders = false;
  console.log('   Rate Limit Headers:');
  
  Object.keys(res.headers).forEach(key => {
    if (key.toLowerCase().includes('ratelimit')) {
      console.log(`     ${key}: ${res.headers[key]}`);
      foundHeaders = true;
    }
  });
  
  if (!foundHeaders) {
    console.log('     ⚠️ No rate limit headers found');
    console.log('     All headers:', Object.keys(res.headers));
  }
  
  // Continue to next test
  setTimeout(testAuthRateLimit, 1000);
});

req1.on('error', (err) => {
  console.log(`   ❌ Error: ${err.message}`);
  setTimeout(testAuthRateLimit, 1000);
});

req1.end();

// Test 2: Test auth rate limiting (6 requests, should block after 5)
function testAuthRateLimit() {
  console.log('\n2. Testing auth rate limiting (6 requests, should block after 5):');
  
  let completedRequests = 0;
  let blockedRequests = 0;
  const totalRequests = 6;
  
  function makeAuthRequest(requestNum) {
    const postData = JSON.stringify({
      email: 'test@test.com',
      password: 'wrongpassword'
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        completedRequests++;
        const isRateLimited = res.statusCode === 429;
        if (isRateLimited) blockedRequests++;
        
        console.log(`   Request ${requestNum}: Status ${res.statusCode} ${isRateLimited ? '🔴 RATE LIMITED!' : ''}`);
        
        if (completedRequests === totalRequests) {
          showResults();
        }
      });
    });
    
    req.on('error', (err) => {
      completedRequests++;
      console.log(`   Request ${requestNum}: Error - ${err.message}`);
      if (completedRequests === totalRequests) {
        showResults();
      }
    });
    
    req.write(postData);
    req.end();
  }
  
  function showResults() {
    console.log('\n📊 Results:');
    console.log(`   Total requests: ${totalRequests}`);
    console.log(`   Rate limited requests: ${blockedRequests}`);
    
    if (blockedRequests > 0) {
      console.log('   ✅ Rate limiting is WORKING!');
    } else {
      console.log('   ⚠️ Rate limiting might not be working');
      console.log('   Note: Make sure server.js has rate limiting enabled');
    }
    
    // Test 3: Health endpoint should not be rate limited
    setTimeout(testHealthEndpoint, 1000);
  }
  
  // Make requests with small delays
  for (let i = 1; i <= totalRequests; i++) {
    setTimeout(() => makeAuthRequest(i), i * 200);
  }
}

// Test 3: Health endpoint should not be rate limited
function testHealthEndpoint() {
  console.log('\n3. Testing health endpoint (should NOT be rate limited):');
  
  const req = http.request('http://localhost:5000/health', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Message: ${result.message}`);
        
        // Check for rate limit headers
        const hasRateLimitHeaders = Object.keys(res.headers).some(key => 
          key.toLowerCase().includes('ratelimit')
        );
        
        if (hasRateLimitHeaders) {
          console.log('   ⚠️ Health endpoint has rate limit headers (unexpected)');
        } else {
          console.log('   ✅ Health endpoint not rate limited (expected)');
        }
      } catch (err) {
        console.log(`   Error parsing response: ${err.message}`);
      }
      
      console.log('\n✅ All tests completed!');
      process.exit(0);
    });
  });
  
  req.on('error', (err) => {
    console.log(`   ❌ Error: ${err.message}`);
    process.exit(1);
  });
  
  req.end();
}
