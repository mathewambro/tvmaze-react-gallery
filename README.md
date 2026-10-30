A searchable TV show gallery built with React, Vite, and React Router. It searches TVmaze for shows, displays up to 10 results, and provides a detail page with show information and cast members.


| Required concept         | Where it appears |
|__________________________|___________________                      
| 1. Components and props. | `src/App.jsx`, `src/Components/`, and `src/Pages/` |
| 2. Lists and stable keys | `src/Components/ShowList.jsx`, `src/Components/ShowCard.jsx`, and `src/Pages/ShowDetail.jsx` |
| 3. Conditional rendering | `src/Pages/GalleryPage.jsx`, `src/Components/ShowCard.jsx`, and `src/Pages/ShowDetail.jsx` |
| 4. Controlled form       | `src/Components/SearchForm.jsx` and `src/Pages/GalleryPage.jsx` |
| 5. State with `useState` | `src/Pages/GalleryPage.jsx`, `src/Components/ShowCard.jsx`, and `src/Pages/ShowDetail.jsx` |
| 6. Effects and fetch     | `src/Pages/GalleryPage.jsx`, `src/Components/ShowCard.jsx`, and `src/Pages/ShowDetail.jsx` |
| 7. Lifted state.         | `src/Pages/GalleryPage.jsx` |
| 8. React Router          | `src/App.jsx`, `src/Components/ShowCard.jsx`, and `src/Pages/ShowDetail.jsx` |


In the old version, I had to build the show cards with JavaScript and add everythign to the page. When I changed the search, I also had to clear out the old results and make the new ones. With React, I split things into components, and it updates the page when the state changes. The search form and gallery use the same search information, so that state is in GalleryPage. Each ShowCard keeps track of its own cast, and the detail page loads a show using the ID in the URL. The part that took me the longest was figuring out where the state should go and when useEffect runs. There are more files than in my old project, but each file has its own job. I like that I don't have to manually rebuild the page when the search changes. I can also click a show, and go back without reloading the whole site. Overall, React handles some of the page updates I had to do by hand before.



