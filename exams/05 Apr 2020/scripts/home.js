import * as data from "./data.js";

export default async function home(){
    let homePage = "../templates/home/header.hbs";
    Object.assign(this.app.partials,{
        category:"../templates/category/category.hbs",
        article:"../templates/article/article.hbs"
    });



    Object.assign(this.app,window.localStorage);

    //get the entire collection
    let articles = await data.readData();

         let categories = articles
        .reduce((acc,article)=>{
            acc[article.category].articles.push(article);

        return acc;
    },{
            "Java":{cat:"Java",articles:[]},
            "C#":{cat:"C#",articles:[]},
            "Python":{cat:"Python",articles:[]},
            "JavaScript":{cat:"JavaScript",articles:[]},
        });

        categories= Object.keys(categories).reduce((acc,entry) =>{
            let category = categories[entry];
            category.hasArticles = category.articles.length !== 0;
            acc.push(category);
            return acc;
         },[]);


    this.app.categories = categories;
    await this.loadPartials(this.app.partials).partial(homePage,this.app);
}

