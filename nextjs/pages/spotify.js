import React, { useState, useEffect } from 'react';

export default function Spotify() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hashParams = window.location.hash.substr(1).split('&');
    const params = {};
    for (let i = 0; i < hashParams.length; i++) {
      const param = hashParams[i].split('=');
      params[param[0]] = param[1];
    }

    if (params.access_token) {
      setAccessToken(params.access_token);
      window.location.hash = ''; // Clear the hash from the URL
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [accessToken]);

  const handleLogin = () => {
    const clientId = '81b60e84841f4fcb9f94cf15e3d6ca6a'; // Replace with your Spotify Client ID
    const redirectUri = 'http://localhost:3000/spotifyplay'; // Replace with your redirect URI
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h2>Spotify Integration</h2>
      {accessToken ? (
        <div>
          <h3>Welcome, {user?.display_name}!</h3>
          {/* Implement Spotify player functionality here */}
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
}