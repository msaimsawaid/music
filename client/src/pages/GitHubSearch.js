import React, { useState } from 'react';
import { searchGitHubUsers } from '../services/githubApi';
import LoadingSpinner from '../components/LoadSpinner';

const GitHubSearch = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const results = await searchGitHubUsers(username);
      setUsers(results);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('GitHub search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    if (!e.target.value.trim()) {
      setUsers([]);
      setSearched(false);
    }
  };

  return (
    <div className="github-search-page">
      <h1>GitHub User Search</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter GitHub username..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || !username.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Results Section */}
      {searched && !loading && (
        <div className="search-results">
          <h2>Search Results for "{username}"</h2>
          
          {users.length === 0 ? (
            <div className="no-results">
              <p>No users found matching your search.</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar">
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.login}'s avatar`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'placeholder-image';
                        placeholder.innerHTML = '👤';
                        placeholder.style.width = '100px';
                        placeholder.style.height = '100px';
                        placeholder.style.borderRadius = '50%';
                        e.target.parentNode.appendChild(placeholder);
                      }}
                    />
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">
                      {user.name || user.login}
                    </h3>
                    <p className="user-login">@{user.login}</p>
                    {user.bio && (
                      <p className="user-bio">{user.bio}</p>
                    )}
                    <div className="user-stats">
                      <span className="stat">
                        <strong>{user.followers}</strong> followers
                      </span>
                      <span className="stat">
                        <strong>{user.following}</strong> following
                      </span>
                    </div>
                    <a 
                      href={user.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="profile-link"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubSearch;















// import { useState } from 'react';

// const GitHubSearch = () => {
//   const [username, setUsername] = useState('');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const searchUsers = async (e) => {
//     e.preventDefault();
//     if (!username.trim()) {
//       setError('Please enter a username to search');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setUsers([]);

//     try {
//       const response = await fetch(
//         `https://api.github.com/search/users?q=${username}&per_page=10`
//       );
      
//       if (!response.ok) {
//         throw new Error(`GitHub API error: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setUsers(data.items);
      
//       if (data.items.length === 0) {
//         setError('No users found with that username');
//       }
//     } catch (err) {
//       setError('Failed to search users: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-center">GitHub User Search</h1>
        
//         {/* Search Form */}
//         <form onSubmit={searchUsers} className="mb-8 bg-white p-6 rounded-lg shadow-md">
//           <div className="flex gap-4">
//             <input
//               type="text"
//               placeholder="Enter GitHub username..."
//               className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <button 
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
//             >
//               {loading ? 'Searching...' : 'Search'}
//             </button>
//           </div>
//         </form>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {/* Loading Indicator */}
//         {loading && (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <p className="mt-2 text-gray-600">Searching GitHub users...</p>
//           </div>
//         )}

//         {/* Results Grid */}
//         <div className="grid gap-4">
//           {users.map(user => (
//             <div key={user.id} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6 hover:shadow-lg transition-shadow">
//               <img 
//                 src={user.avatar_url} 
//                 alt={user.login}
//                 className="w-20 h-20 rounded-full border-2 border-gray-200"
//               />
//               <div className="flex-1">
//                 <h3 className="text-xl font-bold text-gray-800">{user.login}</h3>
//                 <a 
//                   href={user.html_url} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
//                 >
//                   View Profile on GitHub
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </a>
//               </div>
//               <div className="text-sm text-gray-500">
//                 User ID: {user.id}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* No Results Message */}
//         {users.length === 0 && !loading && !error && (
//           <div className="text-center text-gray-500 mt-8 bg-white p-8 rounded-lg shadow">
//             <p className="text-lg">Enter a GitHub username above to search for users.</p>
//             <p className="text-sm mt-2">Try searching for popular usernames like "torvalds", "gaearon", or "mojombo"</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GitHubSearch;