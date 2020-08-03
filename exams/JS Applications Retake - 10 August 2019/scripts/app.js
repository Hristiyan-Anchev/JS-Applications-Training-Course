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
        this.get("#/create-cause",controllers.renderCreateCause);
        this.post("#/create-cause",(ctx)=>{
            controllers.createCause.call(ctx);
        });
        this.get("#/dashboard",controllers.renderDashboard);
        this.get("#/become-donor/:objectId",controllers.renderBecomeDonor);
        this.post("#/become-donor/:objectId",(ctx)=>{
            controllers.donate.call(ctx);
        });
        this.get("#/delete/:objectId",controllers.deleteCause);
        this.post("#/donate/:objectId",(ctx)=>{
            controllers.donate.call(ctx);
        });
    });// sammy main function end

app.run("#/home");
}