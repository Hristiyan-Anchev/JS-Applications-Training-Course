import restAPI,{init} from "./misc.js"

export default async function renderRegisterPage(){
    let registerPage = "../templates/register/registerForm.hbs";

    this.loadPartials(this.app.partials)
        .partial(registerPage,this.app);
}
function passwordValidator(password,repeatPassword){
    return Array.from(arguments).map(passwd => passwd.trim()).every(passwd => {
        return passwd === password && passwd.length >= 6
    });
}
export async function registerUser(){
    let target = this.target.lastElementChild;
    target.setAttribute("disabled","true");
    setTimeout(()=>{
        target.removeAttribute("disabled");
    },2000);

    let {username, password,repeatPassword} = this.params;
    if(passwordValidator(password,repeatPassword) && username.length >= 3){
        //register user in database
        let data = await (await fetch(restAPI.registerUserURL,init("post",{
            username,password
        }))).json();

        this.redirect("#/login");
        //todo displayNotification();
    }else{
        //todo displayNotification();
        // throw new Error("Please check your input fields!");
    }
}