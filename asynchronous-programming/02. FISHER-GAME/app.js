import {fetchAllCatches, errorHandlers, fetchNewCatch} from "./data-module.js";
import * as domManipulator from "./domManipulator.js";

function attachEvents() {
    domManipulator.domElements.main().textContent = "";
    document.querySelector("button.load").addEventListener("click", () => {
        domManipulator.domElements.main().textContent = "";
        fetchAllCatches().then(data => {
            Object.keys(data).forEach(key => {
                let currentCatch = data[key];
                domManipulator.appendCatch(
                    domManipulator.createCatch(
                        key,
                        currentCatch.angler,
                        currentCatch.weight,
                        currentCatch.species,
                        currentCatch.location,
                        currentCatch.bait,
                        currentCatch.captureTime
                    )
                );
            })
        }).catch(errorHandlers.handleError);
    });

    document.querySelector("button.add").addEventListener("click", () => {
        let angler = domManipulator.domElements.angler().value;
        let weight = domManipulator.domElements.weight().value;
        let species = domManipulator.domElements.species().value;
        let location = domManipulator.domElements.location().value;
        let bait = domManipulator.domElements.bait().value;
        let captureTime = domManipulator.domElements.captureTime().value;

        fetchNewCatch(angler, weight, species, location, bait, captureTime)
            .then(response => {
                domManipulator.appendCatch(
                    domManipulator.createCatch(response.name,
                        angler, weight, species, location, bait, captureTime)
                )
            }).catch(errorHandlers.handleError);


    })


}

attachEvents();

