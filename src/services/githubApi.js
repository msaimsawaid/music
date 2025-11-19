const GITHUB_API_BASE = 'https://api.github.com';

export const searchGitHubUsers = async (username) => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(username)}&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Fetch detailed information for each user
    const usersWithDetails = await Promise.all(
      data.items.map(async (user) => {
        try {
          const userResponse = await fetch(user.url, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            }
          });
          
          if (userResponse.ok) {
            const userDetails = await userResponse.json();
            return {
              ...user,
              name: userDetails.name,
              bio: userDetails.bio,
              followers: userDetails.followers,
              following: userDetails.following,
              public_repos: userDetails.public_repos,
              location: userDetails.location,
              blog: userDetails.blog,
              company: userDetails.company,
              twitter_username: userDetails.twitter_username
            };
          }
        } catch (error) {
          console.error(`Error fetching details for ${user.login}:`, error);
        }
        
        return user;
      })
    );

    return usersWithDetails;
  } catch (error) {
    console.error('GitHub search failed:', error);
    throw error;
  }
};

// Get user repositories
export const getUserRepos = async (username) => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=5`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user repos:', error);
    throw error;
  }
};