import * as data from "./data.js";
import * as controllers from "./controllers.js";

window.addEventListener("load",main);

function main() {
    let app = new Sammy("#main",function(){
        this.use("Handlebars","hbs");

        this.partials = {
            header:"../templates/common/header.hbs",
            footer:"../templates/common/footer.hbs",
        };

        Object.assign(this,window.localStorage);


    this.get("#/home",controllers.renderHome);
    this.get("#/",controllers.renderHome);
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
    this.post("#/create",(ctx)=>{
        controllers.createTrek.call(ctx);
    });
    this.get("#/details/:objectId",controllers.renderDetails);
    this.get("#/delete/:objectId",controllers.closeTrek);
    this.get("#/edit/:objectId",controllers.renderEdit);
    this.post("#/edit/:objectId",(ctx)=>{
        controllers.editTrek.call(ctx);
    });
    this.get("#/like/:objectId",controllers.likeTrek);
    this.get("#/user-profile",controllers.renderProfile);

    });// sammy main function end

app.run("#/home");
}