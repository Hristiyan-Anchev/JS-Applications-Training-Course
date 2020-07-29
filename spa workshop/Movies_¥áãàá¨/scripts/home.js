export default async function renderHome() {
    let homePage = "../templates/home/home.hbs";
    await this.loadPartials(this.app.partials)
        .partial(homePage,this.app);
}