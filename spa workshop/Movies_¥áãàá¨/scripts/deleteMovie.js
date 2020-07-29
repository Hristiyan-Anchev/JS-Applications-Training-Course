import restAPI,{init} from "./misc.js";

export default async function deleteMovie(){
    let objectId = this.params.objectId;
    await fetch(`${restAPI.allMoviesURL}/${objectId}`,
        init("delete",{},{
        "user-token":window.localStorage.getItem("token")
    }));

    this.redirect("#/cinema");

}