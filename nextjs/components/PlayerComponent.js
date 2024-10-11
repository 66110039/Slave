import { useEffect, useState } from 'react';
import styles from './PlayerComponent.module.css'; // Import your CSS module for styles

const PlayerComponent = ({ playerId, playerName }) => {
  // Game state
  const [playerCards, setPlayerCards] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Spotify state
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpotify, setShowSpotify] = useState(true); // New state to show/hide Spotify player

  // Fetch game state every 2 seconds
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch('http://localhost:8000/game/state');
        const data = await response.json();

        if (data.players && data.players.length > playerId) {
          setPlayerCards(data.players[playerId].cards);
        } else {
          console.error('Player not found in response:', playerId);
        }

        setTableCards(data.table || []);
        if (data.global_message) setGameMessage(data.global_message);

        const finishedPlayers = data.players.filter(player => player.finished).length;
        if (finishedPlayers >= 3) {
          setGameMessage("Game over! Resetting...");
          setGameOver(true);
          setTimeout(resetGame, 3000);
        } else if (finishedPlayers === 1) {
          setGameMessage("Only one player left! Reset the game.");
          setGameOver(true);
        } else {
          setGameOver(false);
        }
      } catch (error) {
        console.error('Error fetching game state:', error);
        setErrorMessage('Failed to fetch game state. Please try again.');
      }
    };

    fetchGameState();
    const intervalId = setInterval(fetchGameState, 2000);
    return () => clearInterval(intervalId);
  }, [playerId]);

  const playCard = async (cardToPlay) => {
    try {
      const response = await fetch('http://localhost:8000/game/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_id: playerId, card: cardToPlay }),
      });
      const result = await response.json();

      if (response.ok) {
        setGameMessage(result.message);
        fetchGameState(); // Refresh game state after playing a card
      } else {
        setErrorMessage(`Error: ${result.detail}`);
      }
    } catch (error) {
      setErrorMessage('Failed to play card. Please try again.');
    }
  };

  const resetGame = async () => {
    try {
      const response = await fetch('http://localhost:8000/game/reset', { method: 'POST' });
      if (response.ok) {
        setGameMessage('Game has been reset!');
        fetchGameState();
      }
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const Card = ({ card }) => (
    <div onClick={() => playCard(card)} style={{ display: 'inline-block', margin: '10px', cursor: 'pointer' }}>
      <img src={`/cards/${card}.png`} alt={card} style={{ width: '100px', borderRadius: '8px' }} />
    </div>
  );

  // Spotify: Get access token from the URL hash
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

  // Spotify: Fetch user data
  useEffect(() => {
    if (accessToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [accessToken]);

  // Spotify: Fetch currently playing track
  useEffect(() => {
    const fetchCurrentlyPlaying = () => {
      if (accessToken) {
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data.item) {
              setCurrentlyPlaying({
                name: data.item.name,
                artist: data.item.artists.map((artist) => artist.name).join(', '),
                album: data.item.album.name,
                albumCover: data.item.album.images[0].url, // Get the album cover image URL
              });
              setIsPlaying(data.is_playing);
            } else {
              setCurrentlyPlaying(null);
              setIsPlaying(false);
            }
          })
          .catch((error) => {
            console.error('Error fetching current track:', error);
            setCurrentlyPlaying(null);
            setIsPlaying(false);
          });
      }
    };

    if (accessToken) {
      fetchCurrentlyPlaying();
      const intervalId = setInterval(fetchCurrentlyPlaying, 5000); // Update every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [accessToken]);

  // Spotify: Login handler
  const handleLogin = () => {
    const clientId = '81b60e84841f4fcb9f94cf15e3d6ca6a'; // Replace with your Spotify Client ID

    // Dynamically set the redirect URI based on the playerId
    const redirectUri = `http://localhost:3000/player${playerId + 1}`;

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-read-currently-playing`;
    window.location.href = authUrl;
  };

  // Toggle Spotify visibility
  const toggleSpotify = () => {
    setShowSpotify(!showSpotify);
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <h1>{playerName}'s Turn</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {gameMessage && <div style={{ color: 'green', fontWeight: 'bold' }}>{gameMessage}</div>}

      <h2>Your Cards:</h2>
      <div>{playerCards.map((card, index) => <Card key={index} card={card} />)}</div>

      <h2>Cards on the Table:</h2>
      <div>{tableCards.map((card, index) => <Card key={index} card={card} />)}</div>

      {gameOver && <button onClick={resetGame}>Reset Game</button>}

      {/* Spotify Integration as a popup with toggle */}
      <div className={styles.spotifyPopup}>
        <div className={styles.toggleButton} onClick={toggleSpotify}>
          {showSpotify ? '▼' : '▲'} Spotify Integration
        </div>
        {showSpotify && (
          <div>
            {accessToken ? (
              <div>
                <h3>Welcome, {user?.display_name}!</h3>
                {currentlyPlaying ? (
                  isPlaying ? (
                    <div>
                      <h4>Currently Playing:</h4>
                      <div className={styles.vinyl}>
                        <img
                          className={styles.albumCover}
                          src={currentlyPlaying.albumCover}
                          alt={currentlyPlaying.album}
                        />
                      </div>
                      <p>
                        <strong>{currentlyPlaying.name}</strong> by {currentlyPlaying.artist}
                      </p>
                      <p>Album: {currentlyPlaying.album}</p>
                    </div>
                  ) : (
                    <p>No song is currently playing.</p>
                  )
                ) : (
                  <p>No track is currently playing.</p>
                )}
              </div>
            ) : (
              <button onClick={handleLogin}>Login with Spotify</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerComponent;
