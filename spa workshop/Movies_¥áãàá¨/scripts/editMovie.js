import restAPI,{init} from "./misc.js";

export default async function editMovie(){
    let editPage = "../templates/edit/editPage.hbs";
        let objectId = this.params.objectId.substring(1);

        let movieDetails = await (await fetch(`${restAPI.allMoviesURL}/${objectId}`,
            init("get",{},{
                "user-token":window.localStorage.getItem("token")
            }))).json();
        Object.assign(this.app,movieDetails);
        this.loadPartials(this.app.partials)
            .partial(editPage,this.app);
}

export async function editMovieSaveNew(){
    let objectId = this.params.objectId.substring(1);
    let{title,description,genre,availableTickets,movieCover} = this.params;
    availableTickets = parseInt(availableTickets);

    //save changes to DB

    let response = await(await fetch(`${restAPI.allMoviesURL}/${objectId}`,
        init("put",{
            title,description,
            genre,availableTickets,movieCover
        },{
            "user-token":window.localStorage.getItem("token")
        })));
    console.log(response);

    this.redirect("#/cinema");
}