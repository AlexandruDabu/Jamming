import React from "react";
import './Playlist.css';
import TrackList from '../TrackList/TrackList'
import LoadingSpinner from "../LoadingSpinner/LoadinSpinner";
function Playlist(props) {
    const handleNameChange = ({target}) => {
        props.onNameChange(target.value)
    }
    return (
        <div className="Playlist">
            <input onChange={handleNameChange} value={props.playlistName}/>
            <TrackList userSearchResults = {props.playlistTracks} onRemove={props.onRemove} isRemoval={true}/>
            {/* TrackList Comp */}
            <button onClick={props.isSelected ? () => props.onUpdate(props.isSelected) : props.onSave}
             className="Playlist-save"
             disabled={props.isLoading}
             >SAVE TO SPOTIFY</button>
            {props.isLoading ? (<LoadingSpinner/>) : ('')}
        </div>
    )
}
export default Playlist