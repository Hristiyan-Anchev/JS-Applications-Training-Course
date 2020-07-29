/*global Handlebars*/
window.addEventListener("load", attachEventListeners);

function attachEventListeners() {
    document.getElementById("btnLoadTowns")
        .addEventListener("click", loadTowns);
    let root = document.getElementById("root");

    async function loadTowns() {
        let townsToLoad = document.getElementById("towns").value
            .split(",").map(t => {
                return t.trim();
            });

        let template =
            Handlebars.compile(
                await (await fetch("./mainList.hbs")).text());

        root.innerHTML = template({towns:townsToLoad});
    }
}