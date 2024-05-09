import React from "react";
import './UserPlaylist.css'
function UserPlaylist(props) {
    if(props.userPlaylist.length==0){
        return (
            <div className="UserPlaylist">
            <h2>Playlists</h2>
            <div className="TrackList">
                <p>Loading Playlists...</p>
            </div>
        </div>
        )
    }
    else{
    return (
        <div className="UserPlaylist">
            <h2>Playlists</h2>
                {props.userPlaylist.items.map(item => (
                <div className="PlaylistTrackList">
                    <div className="Playlist-Information" onClick={() => props.getUserPlaylistById(item.id)}>
                    <h3>{item.name}</h3>
                    {item.tracks.total > 0 ? (item.tracks.total === 1 ? (<p>1 Song</p>) : (<p>{item.tracks.total} Songs</p>)) : (<p>No Songs in this Playlist</p>)}
                    </div>
                    
                </div>))}
        </div>
    )
}
}
export default UserPlaylist