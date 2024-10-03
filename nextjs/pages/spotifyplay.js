import React, { useState, useEffect } from 'react';

export default function Spotify() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Code for extracting access token from URL hash remains the same

  // Function to configure Spotify Player SDK
  const configurePlayer = async () => {
    const { Player } = await import('spotify-web-playback-sdk');

    const player = new Player({
      name: 'Card Game',
      clientId: '81b60e84841f4fcb9f94cf15e3d6ca6a', // Replace with your Spotify Client ID
    });

    // Connect to Spotify Player using access token
    await player.connect({ token: accessToken });

    // Functionality to control playback (play, pause, etc.) goes here
    // You can utilize player object for playback functionalities
  };

  useEffect(() => {
    if (accessToken) {
      configurePlayer(); // Call the configurePlayer function here
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
          <p>Click a button to play music (functionality needs implementation)</p>
          {/* Implement button to trigger playback functionality */}
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
}