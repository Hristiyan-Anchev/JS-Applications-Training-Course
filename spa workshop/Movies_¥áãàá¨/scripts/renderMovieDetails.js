import restAPI from "./misc.js";
import {init} from "./misc.js";
export default async function renderMovieDetails(){
    let detailsPage = "../templates/myMovies/movieDetails.hbs";

    let objectId = this.params.objectId.substring(1);

    let movieDetails = await(await fetch(`${restAPI.allMoviesURL}/${objectId}`,init("get",{},{
        "user-token":window.localStorage.getItem("token")
        }))).json();
    console.log(movieDetails);
    this.app.title = movieDetails.title;
    this.app.description = movieDetails.description;
    this.app.genre = movieDetails.genre;
    this.app.movieCover = movieDetails.movieCover;
    this.app.availableTickets = movieDetails.availableTickets;

    this.loadPartials(this.app.partials)
        .partial(detailsPage,this.app);
}