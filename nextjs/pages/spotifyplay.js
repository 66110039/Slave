import React, { useState, useEffect } from 'react';

export default function Spotify() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get access token from the URL hash and set it in state
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

  // Fetch user data once the access token is available
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

  // Function to fetch currently playing track
  const fetchCurrentlyPlaying = () => {
    if (accessToken) {
      fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.item) {
            setCurrentlyPlaying({
              name: data.item.name,
              artist: data.item.artists.map((artist) => artist.name).join(', '),
              album: data.item.album.name,
            });
            setIsPlaying(data.is_playing); // Set isPlaying based on the response
          } else {
            setCurrentlyPlaying(null);
            setIsPlaying(false); // No song is playing
          }
        })
        .catch((error) => {
          console.error('Error fetching current track:', error);
          setCurrentlyPlaying(null);
          setIsPlaying(false); // Handle error by marking no song is playing
        });
    }
  };

  // Fetch currently playing track every 5 seconds
  useEffect(() => {
    if (accessToken) {
      fetchCurrentlyPlaying(); // Fetch once initially
      const intervalId = setInterval(fetchCurrentlyPlaying, 5000); // Update every 5 seconds

      return () => clearInterval(intervalId); // Clear the interval on component unmount
    }
  }, [accessToken]);

  // Spotify login handler
  const handleLogin = () => {
    const clientId = '81b60e84841f4fcb9f94cf15e3d6ca6a'; // Replace with your Spotify Client ID
    const redirectUri = 'http://localhost:3000/spotifyplay'; // Replace with your redirect URI
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h2>Spotify Integration</h2>
      {accessToken ? (
        <div>
          <h3>Welcome, {user?.display_name}!</h3>
          {currentlyPlaying ? (
            <div>
              {isPlaying ? (
                <div>
                  <h4>Currently Playing:</h4>
                  <p><strong>{currentlyPlaying.name}</strong> by {currentlyPlaying.artist}</p>
                  <p>Album: {currentlyPlaying.album}</p>
                </div>
              ) : (
                <p>No song is currently playing.</p>
              )}
            </div>
          ) : (
            <p>No track is currently playing.</p>
          )}
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
}
