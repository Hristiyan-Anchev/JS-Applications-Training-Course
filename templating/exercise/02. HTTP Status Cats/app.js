window.addEventListener("load",async () => {
     let executionContext = {cats};
     let mainTemplate = Handlebars.compile(await(await fetch("./mainTemplate.hbs")).text());
     let catTemplate = Handlebars.compile(await(await fetch("./catTemplate.hbs")).text());
     Handlebars.registerPartial("cat",catTemplate);

     renderCatTemplate();
     function renderCatTemplate() {
          let allCats = document.getElementById("allCats");
          allCats.innerHTML = mainTemplate(executionContext);
          allCats.addEventListener("click",toggleContent);

          function toggleContent(evt) {
               if(evt.target.tagName === "BUTTON"){
                    let status = evt.target.nextElementSibling;
                    let isNotDisplayed = status.style.display;
                    status.style.display =
                        isNotDisplayed ? "" : "none";
               }
          }
     }

});


