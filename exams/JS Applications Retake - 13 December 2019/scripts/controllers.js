import * as data from "./data.js";
import * as notifications from "./notifications.js";

export async function renderRegister() {
    let registerPage = "../templates/registerPage.hbs";
    await this.loadPartials(this.app.partials).partial(registerPage, this.app);
}


export async function registerUser() {

    notifications.regular();

    let identityKeywords = ["name", "user", "username", "mail", "email",];
    let passwordKeywords = ["pass", "password", "repeat"];
    let identity = "";
    let passwords = [];

    Object.entries(this.params).forEach(entry => {
        let [key, value] = entry;
        if (identityKeywords.some(idKwd => {
            return key.includes(idKwd);
        })) {
            identity = value;
        } else if (passwordKeywords.some(pasKwd => {
            return key.includes(pasKwd);
        })) {
            passwords.push(value);
        }
    });

    let credentialsValid = data.passwordValidator(...passwords) && data.validateIdentity(identity);

    if (credentialsValid) {
        //register user in database
        let response = await data.registerUser(identity, passwords[0]);

        this.redirect("#/login");

            notifications.success(this,"User registration successful!");

    }
}

export async function renderLogin() {
    let loginPage = "../templates/loginPage.hbs";

    await this.loadPartials(this.app.partials).partial(loginPage, this.app);
}

export async function loginUser() {

    notifications.regular();

    let [identity, password] = Object.values(this.params);
    let credentialsValid;
    try {
        credentialsValid = data.validateIdentity(identity) && data.passwordValidator(password);
    } catch (e) {
        notifications.error("Invalid credentials!");
        return;
    }

    if (credentialsValid) {
        let loginResponse;
        try {
            loginResponse = await data.loginUser(identity, password);
        } catch (e) {
            notifications.error("Invalid credentials!");
            return;
        }

        let ideas = await data.readData();
        let userIdeas = ideas.filter(i => {
            return i.ownerId === loginResponse.objectId;
        }).map(i => i.title);

        let userIdeasCount = userIdeas.length > 0;
        window.sessionStorage.setItem("userToken", loginResponse["userToken"]);
        window.sessionStorage.setItem("objectId", loginResponse["objectId"]);
        window.sessionStorage.setItem("username", identity);
        window.sessionStorage.setItem("userIdeasCount", userIdeasCount);

        Object.assign(this.app, window.sessionStorage);
        this.app.userIdeas = userIdeas;
        //todo notification success

           this.redirect("#/home");
           setTimeout(()=>{
               notifications.success("Login successful!");
           },800);


    }
}

export async function logoutUser() {
    await data.logoutUser();
    window.sessionStorage.clear();
    this.app.objectId = "";
    this.app.userToken = "";

    this.redirect("#/home");
    //todo notification success
    notifications.success("Logout successful!");
}

export async function renderHome() {
    console.log("APP CTX :::", this.app);
    Object.assign(this.app, window.sessionStorage);

    let homePage = "../templates/header.hbs";
    this.app.partials.ideaCard = "../templates/ideaCard.hbs";
    let ideas = await data.readData();

    this.app.ideasCount = ideas.length;
    this.app.ideas = ideas;

    await this.loadPartials(this.app.partials).partial(homePage, this.app);
}


//    ********** CUSTOM FUNCTIONALITY **********
//    ******************************************


export async function renderCreate() {
    let createPage = "../templates/createIdea.hbs";

    await this.loadPartials(this.app.partials).partial(createPage, this.app);

}

export async function createIdea() {
    //todo notification loading
    notifications.regular();
    let {title, description, imageURL} = this.params;
    if ([title, description, imageURL].every(p => {
        return p.trim() !== "";
    })) {
        let createResponse = await data.createData({title, description, imageURL, comments: []});
        //todo notification success

        this.redirect("#/home");
        notifications.success("Idea created successfully!");
    } else {
        notifications.error("Something went wrong!");
    }

}

export async function renderDetails() {
    let detailsPage = "../templates/ideaDetails.hbs";
    let {objectId} = this.params;
    let details = await data.readData(objectId);
    Object.assign(this.app, details);
    this.app.commentsCount = details.comments.length > 0;
    this.app.isCreator = details.ownerId === window.sessionStorage.getItem("objectId");
    console.log(this.app);
    await this.loadPartials(this.app.partials).partial(detailsPage, this.app);

}

export async function comment() {
    let {objectId, newComment} = this.params;

    if (newComment.trim() !== "") {
        this.app.comments.push(newComment);
        this.app.commentsCount = this.app.comments.length > 0;
        await data.updateData(objectId, {comments: this.app.comments});
        //todo successfully posted a comment notification
        notifications.regular("You posted a comment!");
        this.redirect("#/home");
    }


}

export async function like() {
    let {objectId} = this.params;
    this.app.likes++;
    await data.updateData(objectId, {likes: this.app.likes});
    this.redirect(`#/idea-details/${objectId}`);
    notifications.regular(`You liked ${this.app.title}`);
}

export async function deleteIdea() {
    await data.deleteData(this.params.objectId);
    this.redirect("#/home");
    notifications.success("Idea deleted successfully");
}

export async function renderUserProfile() {
    let userPage = "../templates/userProfilePage.hbs";
    console.log(this.app);
    await this.loadPartials(this.app.partials)
        .partial(userPage, this.app);
}







