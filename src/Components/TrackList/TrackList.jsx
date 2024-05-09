import React, { useCallback } from "react";
import './TrackList.css'
import Track from "../Track/Track";
function TrackList(props) {
    return (
        <div className="TrackList">
            {(props.userSearchResults.map(track => <Track 
            key={track.id} 
            track={track} 
            onRemove={props.onRemove}
            onAdd={props.onAdd} 
            isRemoval={props.isRemoval}/>))}
            {/* Add map method that renders a set of track componenets */}
        </div>
    )
}
export default TrackList