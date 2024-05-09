import React from "react";
import './SearchResults.css'
import TrackList from "../TrackList/TrackList";
import LoadingSpinner from "../LoadingSpinner/LoadinSpinner";
function SearchResults(props){
    return (
        <div className="SearchResults">
            <h2>Results</h2>
            
            {/* Add TrackList Comp */}
            {props.isLoading ? (<LoadingSpinner/>) : (<TrackList 
            onAdd={props.onAdd} 
            isRemoval={false} 
            userSearchResults={props.userSearchResults}/>)}
        </div>
    )
}
export default SearchResults