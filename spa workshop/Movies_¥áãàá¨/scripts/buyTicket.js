import restAPI,{init} from "./misc.js";

export default async function buyTicket(){

    let objectId = this.params.objectId.substring(1);

    //get get movie from db
    let movie = await(await fetch(`${restAPI.allMoviesURL}/${objectId}`,
        init("get",{},{
            "user-token":window.localStorage.getItem("token")
        }))).json();
    let {availableTickets} = movie;

    availableTickets = parseInt(availableTickets);

    if(availableTickets === 0){
        //todo displayNotification() or throw error
        return;
    }
    availableTickets = availableTickets > 0 ? availableTickets-1 : 0;


    //update the new number of tickets
    let response = await(await fetch(`${restAPI.allMoviesURL}/${movie.objectId}`,
        init("put",{
            availableTickets
        },{
            "user-token":window.localStorage.getItem("token")
        })));

    // console.log(response);
        this.redirect("#/cinema");
}