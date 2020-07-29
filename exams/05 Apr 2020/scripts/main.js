
import home from "./home.js";
import registerPage,{register} from "./registerPage.js";
import loginPage,{login} from "./loginPage.js";
import createPage from "./createPage.js";
import logout from "./logout.js";
import {createArticle} from "./createPage.js";
import detailsView from "./detailsView.js";
import deleteItem from "./deleteItem.js";
import editView,{editArticle} from "./editPage.js";


window.addEventListener("load",main);


async function main(){
    let app = new Sammy("#root",function(){
        this.use("Handlebars","hbs");
        this.availableCategories = ["JavaScript","C#","Java","Python"];
        this.partials = {}
        Object.assign(this.partials,{
            header:"../templates/common/header.hbs",
            footer:"../templates/common/footer.hbs",
            notifications:"../templates/common/notifications.hbs"
        });

        this.userToken = window.localStorage.getItem("userToken") || "";
        this.email = window.localStorage.getItem("email") || "";

        try {
            this.get("#/home",home);
            this.get("#/",home);
            this.get("#/register",registerPage);
            this.get("#/login",loginPage);
            this.get("#/create",createPage);
            this.get("#/logout",logout);
            this.get("#/details/:objectId",detailsView);
            this.get("#/delete/:objectId",deleteItem);
            this.get("#/edit/:objectId",editView);

            this.post("#/edit/:objectId",(ctx)=>{
                editArticle.call(ctx);
            });

            this.post("#/login",(ctx)=>{
                login.call(ctx);
            });
            this.post("#/register",(ctx)=>{
                register.call(ctx);
            });
            this.post("#/createArticle",(ctx)=>{
                createArticle.call(ctx)
            });
        }catch (e) {
            console.log(e.message);
        }
    });

    app.run("#/home");
}