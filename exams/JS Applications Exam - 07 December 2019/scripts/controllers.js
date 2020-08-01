import * as data from "./data.js";
import * as notifications from "./notifications.js";

export async function renderRegister(){
        let registerPage = "../templates/registerPage.hbs";
        await this.loadPartials(this.app.partials).partial(registerPage,this.app);
}

export async function registerUser(){
    //todo notification loading

    let identityKeywords = ["name","user","username","mail","email"];
    let passwordKeywords = ["pass","password","repeat","re"];
    let identity = "";
    let passwords = [];

    Object.entries(this.params).forEach(entry=>{
        let [key,value] = entry;
        key = key.toLowerCase();


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


        window.localStorage.setItem("userToken",loginResponse["userToken"]);
        window.localStorage.setItem("objectId",loginResponse["objectId"]);
        window.localStorage.setItem("username",identity);

        Object.assign(this.app,window.localStorage);

        //todo notification success

        this.redirect("#/home");
    }
}

export async function logoutUser(){
    await data.logoutUser();
    window.localStorage.clear();
    this.app.objectId = "";
    this.app.userToken ="";

    this.redirect("#/home");
    //todo notification success
}

export async function renderHome(){
    console.log("APP CTX :::",this.app);

    Object.assign(this.app,window.localStorage);
    let homePage = "../templates/home.hbs";
    this.app.partials.trekCard = "../templates/trekCard.hbs";

    //get all treks from db
    let treks = await data.readData();
    let treksExist = treks.length > 0;
    console.log(treks,treksExist);
    Object.assign(this.app,{treksExist,treks});


        await this.loadPartials(this.app.partials).partial(homePage,this.app);
}



//    ********** CUSTOM FUNCTIONALITY **********
//    ******************************************


export async function renderCreate(){
    let createPage = "../templates/createPage.hbs";

    this.loadPartials(this.app.partials).partial(createPage,this.app);
}

export async function createTrek(){
    let{location,dateTime,description,imageURL} = this.params;
    try{
        let response = await data.createData({location,dateTime,description,imageURL,
            organizer:window.localStorage.getItem("username")});
    }catch (e){
        //todo notification error
    }
    this.redirect("#/home");

    //todo notification success
}

export async function renderDetails(){
    let detailsPage = "../templates/detailsPage.hbs";
    let details = await data.readData(this.params.objectId);
    details.isCreator  = details.organizer === this.app.username;


    Object.assign(this.app,details);
    console.log(this.app);
    await this.loadPartials(this.app.partials).partial(detailsPage,this.app);
}

export async function closeTrek(){
    await data.deleteData(this.params.objectId);

    this.redirect("#/home");
}

export async function renderEdit(){
    let editPage = "../templates/editPage.hbs";

    let trekDetails = await data.readData(this.params.objectId);
    Object.assign(this.app,trekDetails);

    this.loadPartials(this.app.partials).partial(editPage,this.app);
}

export async function editTrek(){
    let {objectId,location,dateTime,description,imageURL} = this.params

    let response = await data.updateData(objectId,{
        location,dateTime,description,imageURL
    });

    this.redirect("#/home");
}

export async function likeTrek(){
    this.app.likes++;
    await data.updateData(this.params.objectId,{likes:this.app.likes});

    this.redirect(`#/details/${this.params.objectId}`);
}

export async function renderProfile(){
    if(window.localStorage.getItem("userToken")){
        let profilePage = "../templates/userProfile.hbs";
        console.log(this.app);
        this.app.treksCount = this.app.treks.length;
        this.app.treksExist = this.app.treksCount > 0;
        this.app.ownTreks = this.app.treks.filter(t =>{
           return t.ownerId === window.localStorage.getItem("objectId");
        });

        await this.loadPartials(this.app.partials)
            .partial(profilePage,this.app);
    }else{
        this.redirect("#/home");
    }
}