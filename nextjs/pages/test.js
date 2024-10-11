// pages/spotify.js (this is the login page)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Spotify() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const hashParams = window.location.hash.substr(1).split('&');
    const params = {};
    for (let i = 0; i < hashParams.length; i++) {
      const param = hashParams[i].split('=');
      params[param[0]] = param[1];
    }

    if (params.access_token) {
      setAccessToken(params.access_token);
      // Store the access token in localStorage or state
      localStorage.setItem('spotifyAccessToken', params.access_token);
      window.location.hash = ''; // Clear the hash from the URL
      router.push('/spotifyplay'); // Redirect to the currently playing track page
    }
  }, [router]);

  const handleLogin = () => {
    const clientId = '81b60e84841f4fcb9f94cf15e3d6ca6a'; // Replace with your Spotify Client ID
    const redirectUri = 'http://localhost:3000/spotify'; // Must match the Spotify developer dashboard
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h2>Spotify Integration</h2>
      {accessToken ? (
        <div>
          <p>You are logged in!</p>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
}
