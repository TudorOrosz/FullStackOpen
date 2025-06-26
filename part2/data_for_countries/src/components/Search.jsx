const Search = ({ handleInputChange }) => {
    return (
        <div className="search_div">
            <p className="find_paragraph">find countries</p>
            <input type="text" onChange={handleInputChange}/>
        </div>
    )
}
export default Search

