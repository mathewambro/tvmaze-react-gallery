export default function SearchSummary({ count, term }) {
    const noun = count === 1 ? "show" : "shows";

    return (
        <p className="search-summary">
            Showing {count} {noun} for “{term}”.
        </p>
    );
}