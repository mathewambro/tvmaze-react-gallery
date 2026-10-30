import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    BASE_URL,
    MAX_DETAIL_CAST,
    formatPremiere,
    formatUpdated,
    getChannel,
    getErrorMessage,
    getGenres,
    getRating,
    getSummaryText
} from "../utils.js";

export default function ShowDetail() {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("Loading show...");
    const [cast, setCast] = useState([]);
    const [castStatus, setCastStatus] = useState("loading");
    const [castMessage, setCastMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadShow() {
            setShow(null);
            setCast([]);
            setStatus("loading");
            setMessage("Loading show...");
            setCastStatus("loading");

            if (!/^\d+$/.test(id)) {
                setStatus("error");
                setMessage("That show ID is not valid.");
                setCastStatus("error");
                return;
            }

            let showData;

            try {
                const response = await fetch(BASE_URL + "/shows/" + id, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    const error = new Error("HTTP " + response.status);
                    error.status = response.status;
                    throw error;
                }

                showData = await response.json();
            } catch (error) {
                if (!controller.signal.aborted) {
                    setStatus("error");
                    setMessage(getErrorMessage(error));
                    setCastStatus("error");
                }
                return;
            }

            if (controller.signal.aborted) {
                return;
            }

            setShow(showData);
            setStatus("success");

            try {
                const response = await fetch(
                    BASE_URL + "/shows/" + id + "/cast",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    const error = new Error("HTTP " + response.status);
                    error.status = response.status;
                    throw error;
                }

                const castData = await response.json();

                if (!controller.signal.aborted) {
                    setCast(castData);
                    setCastStatus(castData.length === 0 ? "empty" : "success");
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setCastMessage(getErrorMessage(error));
                    setCastStatus("error");
                }
            }
        }

        loadShow();

        return () => controller.abort();
    }, [id]);

    return (
        <main>
            <p><Link to="/">← Back to gallery</Link></p>

            {status === "loading" && <p role="status">{message}</p>}
            {status === "error" && <p role="alert">{message}</p>}

            {status === "success" && show && (
                <article className="detail-card">
                    {show.image && show.image.medium ? (
                        <img
                            src={show.image.medium}
                            alt={"Poster for " + (show.name || "this show")}
                        />
                    ) : (
                        <div className="no-image">No image available</div>
                    )}

                    <div className="card-body">
                        <h1>{show.name || "Untitled show"}</h1>

                        <dl className="details">
                            <div><dt>Premiered:</dt><dd>{formatPremiere(show.premiered)}</dd></div>
                            <div><dt>Last updated:</dt><dd>{formatUpdated(show.updated)}</dd></div>
                            <div><dt>Genres:</dt><dd>{getGenres(show)}</dd></div>
                            <div><dt>Rating:</dt><dd>{getRating(show)}</dd></div>
                            <div><dt>Status:</dt><dd>{show.status || "Not available"}</dd></div>
                            <div><dt>Network or streaming channel:</dt><dd>{getChannel(show)}</dd></div>
                        </dl>

                        <p className="summary">{getSummaryText(show.summary)}</p>

                        {show.url ? (
                            <a href={show.url} target="_blank" rel="noreferrer">
                                View on TVmaze
                            </a>
                        ) : (
                            <p>TVmaze link not available</p>
                        )}
                    </div>

                    <section>
                        <h2>Full cast</h2>
                        {castStatus === "loading" && <p>Loading cast...</p>}
                        {castStatus === "error" && <p>{castMessage}</p>}
                        {castStatus === "empty" && <p>No cast information available.</p>}

                        {castStatus === "success" && (
                            <ul className="cast">
                                {cast.slice(0, MAX_DETAIL_CAST).map((member) => {
                                    const actor = member.person?.name || "Unknown actor";
                                    const character = member.character?.name;
                                    const key = member.person?.id || member.character?.id || actor;

                                    return (
                                        <li key={key}>
                                            {character ? actor + " as " + character : actor}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                </article>
            )}
        </main>
    );
}