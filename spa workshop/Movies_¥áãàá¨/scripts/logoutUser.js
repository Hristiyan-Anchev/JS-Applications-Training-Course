import restApi,{init} from "./misc.js";

export default async function logoutUser(){
    let data = await (await(fetch(restApi.logoutUserURL,init("get",{}),{
        "user-token":window.localStorage.getItem("token")
    })));
    console.log(data);
    window.localStorage.clear();
    this.app.username = "";
    this.app.token = "";

    this.redirect("#/home");
    //todo displayNotification()
}