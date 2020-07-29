import * as data from "./data.js";

export default async function loginPage(){
   let loginPage = "../templates/login/loginPage.hbs";

   await this.loadPartials(this.app.partials).partial(loginPage,this.app);
}

export async function login(){

   let {email,password} = this.params;
      let notification = data.notification("Loading...","regular").display();

   let userSession = await data.loginUser(email,password);

   notification.hide();

   Object.assign(window.localStorage, userSession);
   Object.assign(this.app, userSession);

   window.localStorage.setItem("email",email);
   this.redirect("#/home");
}

