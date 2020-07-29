import restApi,{init} from "./misc.js"

export default async function renderLoginPage(){
    let loginPage = "../templates/login/loginForm.hbs";
    this.loadPartials(this.app.partials)
        .partial(loginPage,this.app);
}

export async function loginUser(){
    let {username,password} = this.params;
    if(username.trim()!=="" && password.trim()!==""){
        let data = await (await fetch(restApi.loginUserURL,
            init("post",{
                login:username,
                password
            }))).json();
        console.log(data);

        window.localStorage.setItem("username",data.username);
        window.localStorage.setItem("objectId",data.objectId);
        window.localStorage.setItem("token",data["user-token"]);

        this.app.username = data.username;
        this.app.token =  data["user-token"];

        this.redirect("#/home");
        //todo displayNotification()
    }else{
        //todo displayNotification()
    }



}