import restAPI,{init} from "./misc.js"

export default async function renderCinemaPage(){
    this.app.partials.film = "../templates/myMovies/movie.hbs";
    let cinema = "../templates/cinema/cinema.hbs";
    //get all movies from database
    let movies = await(await fetch(restAPI.allMoviesURL,
        init("get",{},{
        "user-token":this.app.token
    }))).json();

    movies = movies.sort((m1,m2) => {
        return parseInt(m1.availableTickets) - parseInt(m2.availableTickets);
    }).map(m=>{
        if(m.ownerId === window.localStorage.getItem("objectId")){
                m.isAuthor = true;
        }else{
            m.isAuthor = false;
        }

        return m
    });

    this.app.movies = movies;

    await( await this.loadPartials(this.app.partials).
        partial(cinema,this.app));

}