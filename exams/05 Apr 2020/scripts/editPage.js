import * as data from "./data.js";


export default async function editView(){
    let editPageTmp = "../templates/editArticle/editArticlePage.hbs";
    let {objectId} = this.params;

    let article = await data.readData(objectId);
    console.log(article);
    Object.assign(this.app, {
        objectId:article.objectId,
        title:article.title,
        category:article.category,
        content:article.content,
    });

    await this.loadPartials(this.app.partials).partial(editPageTmp,this.app);
}

export async function editArticle(){
    let {title,category,content,objectId} = this.params;

    await data.updateData(objectId,{
        title,category,content
    });
    this.redirect("#/home");
}

