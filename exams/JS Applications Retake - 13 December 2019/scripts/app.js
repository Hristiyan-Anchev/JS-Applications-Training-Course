import * as data from "./data.js";
import * as controllers from "./controllers.js";

window.addEventListener("load",main);

function main() {
    let app = new Sammy("body",function(){
        this.use("Handlebars","hbs");

        this.partials = {
            header:"../templates/common/header.hbs",
            footer:"../templates/common/footer.hbs",
        };

try {
    this.get("#/home",controllers.renderHome);
    this.get("#/register",controllers.renderRegister);
    this.get("#/login",controllers.renderLogin);
    this.get("#/logout",controllers.logoutUser);

    this.post("#/login",(ctx)=>{
        controllers.loginUser.call(ctx);
    });
    this.post("#/register",(ctx)=>{
        controllers.registerUser.call(ctx);
    });

//    ********** CUSTOM FUNCTIONALITY **********
//    ******************************************
    this.get("#/create",controllers.renderCreate);
    this.post("#/create-idea",(ctx)=>{
        controllers.createIdea.call(ctx);
    });
    this.get("#/dashboard",controllers.renderHome);
    this.get("#/idea-details/:objectId",controllers.renderDetails);

}catch (e) {
    console.log("ERRORS ::: ",e.message);
    //todo notification fail e.message
}
    });// sammy main function end

app.run("#/home");
}