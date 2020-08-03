import * as data from "./data.js";
import * as controllers from "./controllers.js";
window.addEventListener("load",main);



async function main(){
    let app = new Sammy("#root",function(){
        this.use("Handlebars","hbs");
        this.partials = {
            header: "../templates/header.hbs",
            post:"../templates/post.hbs"
        };

        // Object.assign(this,window.localStorage);
        window.localStorage.clear();
        this.get("#/home",controllers.renderHome);
        this.get("/",controllers.renderHome);
        this.get("/register",controllers.renderRegister);
        this.get("/login",controllers.renderLogin);
        this.get("/logout",controllers.logout);
        this.get("/edit/:objectId",controllers.renderEdit);
        this.get("/delete/:objectId",controllers.deletePost);
        this.get("/details/:objectId",controllers.details);
        this.post("/edit-post/:objectId", (ctx)=>{
            controllers.editPost.call(ctx);
        });

        this.post("/create-post",(ctx)=>{
            controllers.createPost.call(ctx);
        });

        this.post("/login",(ctx)=>{
            controllers.userLogin.call(ctx);
        });

        this.post("/register",(ctx)=>{
            controllers.userRegister.call(ctx);
        });


    });

    app.run("#/home");
}
