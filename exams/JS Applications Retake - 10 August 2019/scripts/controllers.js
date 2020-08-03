import * as data from "./data.js";
import * as notifications from "./notifications.js"

export async function renderRegister(){
        let registerPage = "../templates/registerPage.hbs";
        await this.loadPartials(this.app.partials).partial(registerPage,this.app);
}

export async function registerUser(){
    //todo notification loading
    notifications.regular();
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
        let response;
        try{
            response = await data.registerUser(identity,passwords[0]);
        }catch (e){
                notifications.error(e.message);
                return;
        }

        this.redirect("#/login");
        //todo notification success
        notifications.success("Register successful");
    }
}

export async function renderLogin(){
    let loginPage = "../templates/loginPage.hbs";
    await this.loadPartials(this.app.partials).partial(loginPage,this.app);
}

export async function loginUser() {
    //todo notification loading
    notifications.regular()
    let [identity,password] = Object.values(this.params);
    let credentialsValid;
    try {
        credentialsValid = data.validateIdentity(identity) && data.passwordValidator(password);
    }catch (e) {
        notifications.error(e.message);
        return;
    }

    if(credentialsValid){
        let loginResponse;
        try{
            loginResponse = await data.loginUser(identity,password);
        }catch (e){
            notifications.error(e.message);
            return;
        }


        window.localStorage.setItem("userToken",loginResponse["userToken"]);
        window.localStorage.setItem("objectId",loginResponse["objectId"]);
        window.localStorage.setItem("username",identity);

        Object.assign(this.app,window.localStorage);
        //todo notification success
        notifications.success("Login successful");


        this.redirect("#/home");
    }
}

export async function logoutUser(){
    notifications.regular();
    await data.logoutUser();
    window.localStorage.clear();
    this.app.username = "";
    this.app.objectId = "";
    this.app.userToken ="";

    this.redirect("#/home");
    //todo notification success
    notifications.success("Logout successful");
}

export async function renderHome(){
    console.log("APP CTX :::",this.app);
    Object.assign(this.app,window.localStorage);

    let homePage = "../templates/home.hbs";

    await this.loadPartials(this.app.partials)
        .partial(homePage,this.app);
}


//    ********** CUSTOM FUNCTIONALITY **********
//    ******************************************

export async function renderCreateCause(){
    let donationPage = "../templates/createCause.hbs";

    this.loadPartials(this.app.partials).partial(donationPage,this.app);

}

export async function createCause(){
    notifications.regular()
    let {cause,description,neededFunds,pictureUrl} = this.params;
    neededFunds  = parseFloat(neededFunds);

    try{

        let response = await data.createData({
            cause,description,neededFunds,pictureUrl
        });
        notifications.success("Cause created successfully");
        this.redirect("#/dashboard");
    }catch (e){
        notifications.error(e.message);
        return;
    }

}
export async function renderDashboard(){
    let dashboardView  = "../templates/dashboard.hbs";
    this.app.partials.causeCard = "../templates/causeCard.hbs";


    this.app.causes = await data.readData();
    this.app.causesExist = this.app.causes.length > 0;

    this.loadPartials(this.app.partials).partial(dashboardView,this.app);
}

export async function renderBecomeDonor(){
    let {objectId} = this.params;
    let cause =await data.readData(objectId);
    cause.isCreator = cause.ownerId === window.localStorage.getItem("objectId");
    this.app.cause = cause;

    let donatePage = "../templates/becomeDonor.hbs";

    this.loadPartials(this.app.partials).partial(donatePage,this.app)
}

export async function donate(){
    notifications.regular();
    let {currentDonation,objectId} = this.params;
    currentDonation = Number(currentDonation);

    if(currentDonation > 0){
        this.app.cause.collectedFunds += currentDonation;
        if(!this.app.cause.donors){
            this.app.cause.donors = [];
            this.app.cause.donors.push(window.localStorage.getItem("username"));
        }else if(!this.app.cause.donors.includes(window.localStorage.getItem("username"))){
            this.app.cause.donors.push(window.localStorage.getItem("username"));
        }
        try{
            let response = await data.updateData(objectId,this.app.cause);
            notifications.success("Donation successful");
            this.redirect(`#/become-donor/${objectId}`);
        }catch (e){
            notifications.error(e.message);
            return;
        }
    }else{
        notifications.error("Something went wrong!");
    }

}


export async function deleteCause(){
    notifications.regular();
    let {objectId} = this.params;
    try{
        await data.deleteData(objectId);
        notifications.success("Cause closed!");
    }catch (e){
        notifications.error(e.message);
        return;
    }
    this.redirect("#/home");
}