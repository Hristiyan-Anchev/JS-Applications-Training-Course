import * as data from "./data.js";

export async function renderHome() {

    let homePage = "../templates/header.hbs";
    Object.assign(this.app, window.localStorage);

    let posts = await data.readData();
    posts = posts.map(a => {
        a.editAllowed = a.ownerId === window.localStorage.getItem("objectId");
        return a;
    });

    Object.assign(this.app, {posts: posts});

    await this.loadPartials(this.app.partials)
        .partial(homePage, this.app);

}


//login register

export async function renderRegister() {
    let registerPage = "../templates/user/register.hbs";
    await this.loadPartials(this.app.partials).partial(registerPage, this.app);
}

export async function userRegister() {
    let {email, password, repeatPassword} = this.params;

    if (data.passwordValidator(password, repeatPassword)) {
        if (email.trim() === "") {
            throw new Error("Email field is empty");
        }

        this.target.querySelector("button").disabled = true;
        await data.registerUser(email, password);
        this.target.querySelector("button").removeAttribute("disabled");
        this.redirect("/home");
    } else {
        throw new Error("check your input fields");
    }

}

export async function renderLogin() {
    let loginPage = "../templates/user/login.hbs";
    await this.loadPartials(this.app.partials).partial(loginPage, this.app);
}

export async function userLogin() {

    let {email, password} = this.params;

    if (email.trim() !== "" && password.trim() !== "") {
        let userData = await data.loginUser(email, password);

        window.localStorage.setItem("email", email);
        window.localStorage.setItem("objectId", userData.objectId);
        window.localStorage.setItem("userToken", userData.userToken);
        Object.assign(this.app, window.localStorage);
        this.redirect("/home");
    } else {
        throw new Error("Check your input fields");
    }


}

export async function logout() {
    await data.logoutUser();
    this.app.email = "";
    this.app.userToken = "";
    this.objectId = "";
    window.localStorage.clear();
    //todo successfully logged out
    this.redirect("/home");
}

export async function createPost() {
    let {title, category, content} = this.params;

    let response = await data.createData({title, category, content});
    console.log(response);
    this.redirect("/home");
}

export async function renderEdit() {
    let posts = await data.readData();
    posts = posts.map(a => {
        a.editAllowed = a.ownerId === window.localStorage.getItem("objectId");
        return a;
    });
    Object.assign(this.app, {posts: posts});

    let targetPost = posts.find(p => {
        return p.objectId === this.params.objectId;
    });
    Object.assign(this.app, targetPost);

    let editPage = "../templates/editPost.hbs";

    await this.loadPartials(this.app.partials).partial(editPage, this.app);
}

export async function editPost() {
    let {objectId} = this.params;
    let {title, category, content} = this.params;
    this.target.querySelector("button").disabled = true;
    await data.updateData(objectId, {title, category, content});
    this.target.querySelector("button").disabled = false;
    this.redirect("/home");
}

export async function deletePost() {
    let {objectId} = this.params;

    await data.deleteData(objectId);
    this.redirect("/home");
}

export async function details() {
    let {objectId} = this.params;
    let detailsPage = "../templates/postDetails.hbs";
    let post = this.app.posts.find(p => {
        return p.objectId === objectId;
    });
    this.app.targetPost = post;
    this.loadPartials(this.app.partials).partial(detailsPage,this.app);
}


