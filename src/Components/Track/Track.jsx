import React from "react";
import './Track.css'
function Track(props) {
    const passTrack = () => {
        props.onAdd(props.track);
    }
    const passTrackRemove = () => {
        props.onRemove(props.track)
    }
    const renderAction = () => {
        if(!props.isRemoval) {
            return <button className="Track-action" onClick={passTrack}>+</button>
        }
            return <button className="Track-action" onClick={passTrackRemove}>-</button>
    }
    return (
        <div className="Track">
            <div className="Track-information" onClick={!props.isRemoval ? passTrack : passTrackRemove}>
                <h3>{props.track.name}</h3>
                <p>{props.track.artist} | {props.track.album}</p>
            </div>
            {renderAction()}
            
        </div>
    )
}
export default Track