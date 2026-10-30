export const BASE_URL = "https://api.tvmaze.com";
export const MAX_RESULTS = 10;
export const MAX_CARD_CAST = 5;
export const MAX_DETAIL_CAST = 15;

export function getErrorMessage(error) {
    if (error.status === 429) {
        return "Too many requests. Wait a few seconds and try again.";
    }

    if (error.status === 404) {
        return "No show found with that ID. Go back to the gallery and choose another show.";
    }

    return "Could not load the show information. Check your connection and try again.";
}

export function getSummaryText(summaryHtml) {
    if (!summaryHtml) {
        return "No summary available.";
    }

    const parsedSummary = new DOMParser().parseFromString(summaryHtml, "text/html");
    return parsedSummary.body.textContent.trim() || "No summary available.";
}

export function formatPremiere(dateString) {
    if (!dateString) {
        return "Not available";
    }

    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

export function formatUpdated(seconds) {
    if (seconds === null || seconds === undefined) {
        return "Not available";
    }

    const date = new Date(seconds * 1000);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

export function getGenres(show) {
    return show.genres && show.genres.length > 0
        ? show.genres.join(", ")
        : "No genres listed";
}

export function getRating(show) {
    return show.rating && show.rating.average !== null && show.rating.average !== undefined
        ? show.rating.average + " / 10"
        : "Not rated yet";
}

export function getChannel(show) {
    if (show.network && show.network.name) {
        return show.network.name;
    }

    if (show.webChannel && show.webChannel.name) {
        return show.webChannel.name;
    }

    return "Not available";
}

export function getCastName(member) {
    const actor = member.person?.name || "Unknown actor";
    const character = member.character?.name;

    return character ? actor + " as " + character : actor;
}