import {monkeys} from "./monkeys.js";

(async () => {
    let monkeysHtml =
        Handlebars.compile(
            await (await fetch("./monkeyTemplate.hbs")).text());
    let parentContainer = document.querySelector(".monkeys")
    parentContainer.innerHTML = monkeysHtml({monkeys});
    parentContainer.addEventListener("click",(evt)=>{
        if(evt.target.tagName === "BUTTON"){
            let infoPara = evt.target.nextElementSibling;
            infoPara.style.display =
                infoPara.style.display ? "" : "none";
        }
    });
})();