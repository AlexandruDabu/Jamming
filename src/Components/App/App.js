import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import { useEffect, useState } from 'react';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify'
import UserPlaylist from '../UserPlaylist/UserPlaylist';
function App() {
    const [searchResults, setSerachResults] = useState([]);
    const [playlistName, setPlaylistName] = useState('NewPlaylist');
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userPlaylist, setUserPlaylist] = useState([]);
    const [isSelected, setSelected] = useState('');

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
                setSerachResults([])
                setIsLoading(false);
                setSelected('');
                getUserPlaylist();
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
    const getUserPlaylist = async () => {
        try{
            setIsLoading(true);
            const data = await Spotify.getUserPlaylist();
            setUserPlaylist(data)
            setIsLoading(false);
        } catch(error){
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getUserPlaylist();
    },[])
    const getUserPlaylistById = async (id) => {
        setIsLoading(true);
        const data = await Spotify.getUserPlaylistById(id)
        const datanew = data.tracks.items.map(item => ({
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists[0].name,
            album: item.track.album.name,
            uri: item.track.uri,

        }));
        setPlaylistTracks(datanew);
        setSelected(id);
        setIsLoading(false);
    }
    const updatePlaylist = async (id) => {
        const trackURIs = playlistTracks.map((temp) => temp.uri)
        try{
            Spotify.updatePlaylist(id,trackURIs).then(() => {
                setPlaylistName("NewPlaylist")
                setPlaylistTracks([])
                setSelected('');
                getUserPlaylist();
            })
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
                <UserPlaylist userPlaylist={userPlaylist}
                getUserPlaylistById={getUserPlaylistById}
                isLoading={isLoading}/>
                <SearchResults isLoading={isLoading}
                onAdd={addTrack} 
                userSearchResults={searchResults}/>
                {/* SearchResult Componenet */}
                <Playlist onSave={savePlaylist} 
                onRemove={removeTrack} 
                playlistName={playlistName} 
                playlistTracks={playlistTracks} 
                onNameChange={updatePlaylistName}
                isLoading={isLoading}
                isSelected={isSelected}
                onUpdate={updatePlaylist}
                userPlaylist={userPlaylist}/>
                {/* PlayList Componenet */}
                
                </div>
            </div>
        </div>
    )
}

export default App;
