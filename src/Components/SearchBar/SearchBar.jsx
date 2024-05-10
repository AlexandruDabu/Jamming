import React, {useState} from "react";
import './SearchBar.css'
import LoadingSpinner from "../LoadingSpinner/LoadinSpinner";
function SearchBar(props) {
    const [term,setTerm] = useState('');
    const passTerm = () => {
        props.onSearch(term)
        setTerm('');
    }
    const handleTermChange = (e) => {
        setTerm(e.target.value);
    }
    return (
        <div className="SearchBar">
            <input value={term} onChange={handleTermChange} placeholder="Enter A Song, Album, or Artist"/>
            <button onClick={passTerm} className="SearchButton">SEARCH</button>
        </div>
    )
}
export default SearchBar