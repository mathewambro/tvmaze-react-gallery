import ShowCard from "./ShowCard.jsx";

export default function ShowList({ shows }) {
    return (
        <div id="gallery" className="gallery">
            {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
            ))}
        </div>
    );
}