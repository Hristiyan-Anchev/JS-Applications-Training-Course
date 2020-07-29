import {readData} from "./data.js";

export default async function detailsView(){
    // Object.assign(this.app.partials ,{
    //
    // });
    let details = "../templates/details/details.hbs";

    let {objectId} = this.params;
    let article = await readData(objectId);

    let canEdit = false;

        if(article.creator === window.localStorage.getItem("email")){
            canEdit = true;
        }
    Object.assign(this.app,{
        title:article["title"],
        category:article["category"],
            content:article["content"],
        objectId:article["objectId"],
        canEdit
    });

    this.loadPartials(this.app.partials).partial(details,this.app);

}