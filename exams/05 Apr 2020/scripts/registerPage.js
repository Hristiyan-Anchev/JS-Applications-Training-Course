import * as data from "./data.js";

export default async function registerPage(){
    let registerPage = "../templates/register/registerPage.hbs";

    await this.loadPartials(this.app.partials).partial(registerPage,this.app);
}
export async function register(){
    let {email, password} = this.params;
    if(data.passwordValidator(password,this.params["rep-pass"])){
        let notification = data.notification("Loading...","regular").display();
        let response = await data.registerUser(email,password);
        notification.hide();
        this.redirect("#/home");
    }
}