export default async function renderHome() {
    let homePage = "../templates/home/header.hbs";
    await this.loadPartials(this.app.partials)
        .partial(homePage,this.app);
}