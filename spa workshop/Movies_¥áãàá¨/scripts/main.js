import renderHome from "../scripts/home.js"
import renderLoginPage,{loginUser} from "./login.js";
import renderRegisterPage,{registerUser} from "./register.js";
import logoutUser from "./logoutUser.js";
import renderCinemaPage from "./renderCinemaPage.js";
import renderCreateMovie,{createMovie} from "./createMovie.js";
import buyTicket from "./buyTicket.js";
import renderMovieDetails from "./renderMovieDetails.js";
import deleteMovie from "./deleteMovie.js";
import editMovie from "./editMovie.js";
import {editMovieSaveNew} from "./editMovie.js";
import getMyMovies from "./getMyMovies.js";


window.addEventListener("load",main);

function main(){
    let app = new Sammy("#container",function(){
        this.partials = {};
        Object.assign(this.partials,{
            header:"../templates/common/header.hbs",
            footer:"../templates/common/footer.hbs"
        });

        this.token = window.localStorage.token;
        this.username = window.localStorage.username;

        console.log("APPLICATION CONTEXT ::: ",this);
        this.use("Handlebars","hbs");

        this.get("#/home",renderHome);
        this.get("#/login",renderLoginPage);
        this.get("#/register",renderRegisterPage);
        this.get("#/logout",logoutUser);
        this.get("#/cinema",renderCinemaPage);
        this.get("#/addMovie",renderCreateMovie);
        this.get("#/buyTicket/:objectId",buyTicket);
        this.get("#/details/:objectId",renderMovieDetails);
        this.get("#/delete/:objectId",deleteMovie);
        this.get("#/edit/:objectId",editMovie);
        this.get("#/myMovies",getMyMovies);


        this.post("#/register",(ctx)=>{
            registerUser.call(ctx);
        });

        this.post("#/login",(ctx)=>{
            loginUser.call(ctx);
        });

        this.post("#/addMovie",(ctx)=>{
            createMovie.call(ctx);
        });

        this.post("#/edit/:objectId",(ctx)=>{
            editMovieSaveNew.call(ctx);
        });



    });//

    app.run("#/home");
}