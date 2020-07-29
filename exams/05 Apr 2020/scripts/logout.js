import * as data from"./data.js";

export default async function logout(){
    let notification = data.notification("Loading...","regular").display();
    let response = await data.logoutUser();
    notification.hide();
    window.localStorage.clear();
    this.app.userToken = "";
    this.redirect("#/home");
}