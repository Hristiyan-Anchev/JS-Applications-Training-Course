import restAPI,{init} from "./misc.js"

export default async function renderCreateMovie (){
    let createMoviePage = "../templates/createMovie/createMovie.hbs";
    this.loadPartials(this.app.partials)
        .partial(createMoviePage,this.app);
}

export async function createMovie(){
    // console.log(this.params);
    let {title, availableTickets, description, genre, movieCover} =
                        this.params;

    if([title,availableTickets,description,genre,movieCover].every(p=>p.trim()!=="")){
        availableTickets = parseInt(availableTickets);
        let response =
            await (await fetch(restAPI.allMoviesURL,init("post",{
                title,availableTickets,description,genre,movieCover
        },{
            "user-token":window.localStorage.getItem("token")
        }))).json();

        this.redirect("#/cinema");
        //todo displayNotification()
    }else{
        //todo displayNotification()
    }


}