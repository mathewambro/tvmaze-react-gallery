export default function SearchForm({ query, onQueryChange, onSearch }) {
  return (
    <form onSubmit={onSearch}>
      <label htmlFor="search-input">Show title or keyword</label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}