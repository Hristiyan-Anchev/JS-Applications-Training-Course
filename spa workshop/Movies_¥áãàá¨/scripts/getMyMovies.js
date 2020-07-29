import restAPI,{init} from "./misc.js";
let myMoviesPage = "../templates/myMovies/myMovies.hbs";
let movie = "../templates/myMovies/movie.hbs";

export default async function myMovies(){
    let movies = await (await fetch(restAPI.allMoviesURL,init("get",{},{
        "user-token":window.localStorage.getItem("token")
    }))).json();



    movies = movies.filter(m => {
        return m.ownerId === window.localStorage.getItem("objectId");
    }).map(m=>{
        m.isAuthor = m.ownerId === window.localStorage.getItem("objectId");
        return m;
    });

    console.log(movies);

    this.app.movies = movies
    this.app.partials.movie = movie;


    this.loadPartials(this.app.partials).partial(myMoviesPage,this.app);


}