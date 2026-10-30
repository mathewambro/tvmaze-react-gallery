import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BASE_URL,
    MAX_CARD_CAST,
    formatPremiere,
    formatUpdated,
    getErrorMessage,
    getGenres,
    getRating,
    getSummaryText
} from "../utils.js";

export default function ShowCard({ show }) {
    const [cast, setCast] = useState([]);
    const [castStatus, setCastStatus] = useState("loading");
    const [castMessage, setCastMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadCast() {
            try {
                const response = await fetch(
                    BASE_URL + "/shows/" + show.id + "/cast",
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

        loadCast();

        return () => controller.abort();
    }, [show.id]);

    return (
        <article className="card">
            {show.image && show.image.medium ? (
                <img
                    src={show.image.medium}
                    alt={"Poster for " + (show.name || "this show")}
                />
            ) : (
                <div className="no-image">No image available</div>
            )}

            <div className="card-body">
                <h2>
                    <Link to={"/shows/" + show.id}>
                        {show.name || "Untitled show"}
                    </Link>
                </h2>

                <dl className="details">
                    <div>
                        <dt>Premiered:</dt>
                        <dd>{formatPremiere(show.premiered)}</dd>
                    </div>
                    <div>
                        <dt>Last updated:</dt>
                        <dd>{formatUpdated(show.updated)}</dd>
                    </div>
                    <div>
                        <dt>Genres:</dt>
                        <dd>{getGenres(show)}</dd>
                    </div>
                    <div>
                        <dt>Rating:</dt>
                        <dd>{getRating(show)}</dd>
                    </div>
                </dl>

                <p className="summary">{getSummaryText(show.summary)}</p>

                <h3>Main cast</h3>
                {castStatus === "loading" && <p>Loading cast...</p>}
                {castStatus === "error" && <p>{castMessage}</p>}
                {castStatus === "empty" && <p>No cast information available.</p>}

                {castStatus === "success" && (
                    <ul className="cast">
                        {cast.slice(0, MAX_CARD_CAST).map((member) => (
                            <li key={member.person.id}>
                                {member.person.name}
                                {member.character && member.character.name
                                    ? " as " + member.character.name
                                    : ""}
                            </li>
                        ))}
                    </ul>
                )}

                {show.url ? (
                    <a className="card-link" href={show.url}>
                        View on TVmaze
                    </a>
                ) : (
                    <p>TVmaze link not available</p>
                )}
            </div>
        </article>
    );
}