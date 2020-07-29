import * as data from"./data.js";
export default async function createPage(){
    let userToken = window.localStorage.getItem("userToken");
    if(!userToken){
        this.redirect("#/login");
        return;
    }

    let createPage = "../templates/createArticle/createArticlePage.hbs";

    await this.loadPartials(this.app.partials)
        .partial(createPage,this.app);
}

export async function createArticle(){
    let  {title,category,content} = this.params;
    let notification;
    if([title,category,content].every(x => {
        return x.trim() !== "";
    })){
        if(! this.app.availableCategories.includes(category)){
            let availableCategories = this.app.availableCategories.join(", ");
            notification = data
                .notification(`Check your inputs - available categories are: ${availableCategories}`)
                .display();
        }else{
            notification = data.notification("Loading...").display();
            await data.createData({
                title,category,content,
                creator:window.localStorage.getItem("email")
            });
            this.redirect("#/home");
        }

    }else {
         notification = data.notification("Check your input fields !","regular").display();

    }
    setTimeout(()=>{
        notification.hide();
    },3000)


}