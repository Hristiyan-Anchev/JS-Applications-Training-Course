import * as data from "./data.js";

export async function renderRegister(){
        let registerPage = "../templates/registerPage.hbs";
        await this.loadPartials(this.app.partials).partial(registerPage,this.app);
}

export async function registerUser(){
    //todo notification loading

    let identityKeywords = ["name","user","username","mail","email",];
    let passwordKeywords = ["pass","password","repeat"];
    let identity = "";
    let passwords = [];

    Object.entries(this.params).forEach(entry=>{
        let [key,value] = entry;
        if(identityKeywords.some(idKwd => {
            return key.includes(idKwd);
        })){
            identity = value;
        }else if(passwordKeywords.some(pasKwd=>{
                return key.includes(pasKwd);
        })){
            passwords.push(value);
        }
    });

        let credentialsValid = data.passwordValidator(...passwords) && data.validateIdentity(identity);

    if(credentialsValid){
        //register user in database
        let response = await data.registerUser(identity,passwords[0]);
        this.redirect("#/login");
        //todo notification success
    }
}

export async function renderLogin(){
    let loginPage = "../templates/loginPage.hbs";
    await this.loadPartials(this.app.partials).partial(loginPage,this.app);
}

export async function loginUser() {
    //todo notification loading
    let [identity,password] = Object.values(this.params);
    let credentialsValid;
    try {
        credentialsValid = data.validateIdentity(identity) && data.passwordValidator(password);
    }catch (e) {
        throw new Error("Invalid format for username or password");
    }

    if(credentialsValid){
        let loginResponse = await data.loginUser(identity,password);
        console.log(loginResponse);
        window.sessionStorage.setItem("userToken",loginResponse["userToken"]);
        window.sessionStorage.setItem("objectId",loginResponse["objectId"]);

        Object.assign(this.app,window.sessionStorage);
        //todo notification success

        this.redirect("#/home");
    }
}

export async function logoutUser(){
    await data.logoutUser();
    window.sessionStorage.clear();
    this.app.objectId = "";
    this.app.userToken ="";

    this.redirect("#/home");
    //todo notification success
}

export async function renderHome(){
    console.log("APP CTX :::",this.app);
    Object.assign(this.app,window.sessionStorage);

    let homePage = "../templates/home.hbs";
    this.app.partials.ideaCard = "../templates/ideaCard.hbs";
    let ideas = await data.readData();

    this.app.ideasCount = ideas.length;
    this.app.ideas = ideas;

    await this.loadPartials(this.app.partials).partial(homePage,this.app);
}


//    ********** CUSTOM FUNCTIONALITY **********
//    ******************************************


export async function renderCreate(){
    let createPage = "../templates/createIdea.hbs";

    await this.loadPartials(this.app.partials).partial(createPage,this.app);
}

export async function createIdea(){
    //todo notification loading
    let {title,description,imageURL} = this.params;
    if([title,description,imageURL].every(p => {
        return p.trim() !== "";
    })){
        let createResponse = await data.createData({title,description,imageURL,comments:[]});
        //todo notification success
        this.redirect("#/home");
    }else{
        console.log("Wrong format of data");
        //todo notification information is the wrong format
    }

}

export async function renderDetails(){
    let detailsPage = "../templates/ideaDetails.hbs";
    let {objectId} = this.params;
    let details = await data.readData(objectId);
    Object.assign(this.app,details);
    console.log(this.app);
    await this.loadPartials(this.app.partials).partial(detailsPage,this.app);

}

export async function comment(){

}

export async function like(){

}

export async function deleteIdea(){

}







