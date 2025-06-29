const Filter = ({newFilter, handleFilterChange}) => {
    return <p>filter shown with <input value={newFilter} onChange={handleFilterChange} /></p>
}

export default Filter