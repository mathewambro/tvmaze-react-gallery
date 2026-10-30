import { BrowserRouter, Routes, Route } from "react-router-dom";
import GalleryPage from "./pages/GalleryPage.jsx";
import ShowDetail from "./pages/ShowDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/shows/:id" element={<ShowDetail />} />
        </Routes>

        <footer className="site-footer">
          <p>
            Show data provided by{" "}
            <a href="https://www.tvmaze.com/api">TVmaze</a> under the CC BY-SA
            license.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}