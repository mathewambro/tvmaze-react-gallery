import { useEffect, useState } from "react";
import SearchForm from "../Components/SearchForm.jsx";
import ShowList from "../Components/ShowList.jsx";
import SearchSummary from "../Components/SearchSummary.jsx";
import {
    BASE_URL,
    MAX_RESULTS,
    getErrorMessage
} from "../utils.js";

export default function GalleryPage() {
    const [query, setQuery] = useState("office");
    const [submittedQuery, setSubmittedQuery] = useState("office");
    const [searchVersion, setSearchVersion] = useState(0);
    const [shows, setShows] = useState([]);
    const [status, setStatus] = useState("Searching...");
    const [statusType, setStatusType] = useState("loading");

    useEffect(() => {
        if (submittedQuery === "") {
            return undefined;
        }

        const controller = new AbortController();

        async function searchShows() {
            setShows([]);
            setStatus("Searching...");
            setStatusType("loading");

            try {
                const url =
                    BASE_URL + "/search/shows?q=" + encodeURIComponent(submittedQuery);
                const response = await fetch(url, { signal: controller.signal });

                if (!response.ok) {
                    const error = new Error("HTTP " + response.status);
                    error.status = response.status;
                    throw error;
                }

                const results = await response.json();
                const matchingShows = results
                    .slice(0, MAX_RESULTS)
                    .map((result) => result.show);

                if (controller.signal.aborted) {
                    return;
                }

                setShows(matchingShows);

                if (matchingShows.length === 0) {
                    setStatus("No shows found. Try another search.");
                    setStatusType("empty");
                } else {
                    setStatus("");
                    setStatusType("success");
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setStatus(getErrorMessage(error));
                    setStatusType("error");
                }
            }
        }

        searchShows();

        return () => controller.abort();
    }, [submittedQuery, searchVersion]);

    function handleSearch(event) {
        event.preventDefault();
        const newQuery = query.trim();

        if (newQuery === "") {
            setSubmittedQuery("");
            setSearchVersion((version) => version + 1);
            setShows([]);
            setStatus("Please enter a show title or keyword.");
            setStatusType("error");
            return;
        }

        setSubmittedQuery(newQuery);
        setSearchVersion((version) => version + 1);
    }

    return (
        <>
            <header>
                <h1>TVmaze Gallery</h1>
                <p>Search for any TV show by title or keyword.</p>
                <SearchForm
                    query={query}
                    onQueryChange={setQuery}
                    onSearch={handleSearch}
                />
            </header>

            <main>
                <p className={`status ${statusType}`} role="status" aria-live="polite">
                    {status}
                </p>

                {statusType === "success" && (
                    <SearchSummary count={shows.length} term={submittedQuery} />
                )}

                {statusType === "success" && <ShowList shows={shows} />}
            </main>
        </>
    );
}