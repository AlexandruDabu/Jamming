import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import { useCallback, useState } from 'react';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify'
function App() {
    const [searchResults, setSerachResults] = useState([]);
    const [playlistName, setPlaylistName] = useState('NewPlaylist');
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(false);

    const addTrack = (track) =>{
        if(playlistTracks.some(temp => temp.id === track.id))
            return;
        setSerachResults(prev => prev.filter(item => item.id !== track.id))
        setPlaylistTracks(prev => [...prev, track]);
    }

    const removeTrack = (track) => {
        setPlaylistTracks(prev => prev.filter(prevTrack => prevTrack.id !== track.id))
        setSerachResults(prev => [track,...prev])
    }

    const updatePlaylistName = (name) => {
        setPlaylistName(name);
    }
    const savePlaylist = async () => {
        setIsLoading(true);
        const trackURIs = playlistTracks.map((temp) => temp.uri)
        try {
            Spotify.savePlaylist(playlistName,trackURIs).then(() => {
                setPlaylistName("NewPlaylist")
                setPlaylistTracks([])
                setIsLoading(false);
            });
        } catch (error) {
            console.error('Playlist saving error:', error);
        }
        
    }
    const search = (term) => {
        setIsLoading(true);
        try{
            Spotify.search(term).then(result => setSerachResults(result))
            setIsLoading(false);
        }catch(error){
            console.log(error);
        }
    }
    return(
        <div>
            <div className="header">
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
            </div>
            <div className="App">
                {/* SearchBar Componenet */}
                <SearchBar onSearch={search}/>
            <div className="App-playlist">
                <SearchResults isLoading={isLoading}
                onAdd={addTrack} 
                userSearchResults={searchResults}/>
                {/* SearchResult Componenet */}
                <Playlist onSave={savePlaylist} 
                onRemove={removeTrack} 
                playlistName={playlistName} 
                playlistTracks={playlistTracks} 
                onNameChange={updatePlaylistName}
                isLoading={isLoading}/>
                {/* PlayList Componenet */}
                </div>
            </div>
        </div>
    )
}

export default App;
