import {updateExistingCatch,deleteCatch } from "./data-module.js";
let  mainFormWrapper = document.querySelector("#addForm");
export let domElements = {
    main: () => {
        return document.getElementById("catches");
    },
    angler:()=>{return mainFormWrapper.querySelector("input.angler")},
    weight:()=>{return mainFormWrapper.querySelector("input.weight")},
    species:()=>{return mainFormWrapper.querySelector("input.species")},
    location:()=>{return mainFormWrapper.querySelector("input.location")},
    bait:()=>{return mainFormWrapper.querySelector("input.bait")},
    captureTime:()=>{return mainFormWrapper.querySelector("input.captureTime")}
}

export function appendCatch(domElementCatch) {
    domElements.main().appendChild(domElementCatch);
}

export function createCatch(catchId, angler, weight, species, location, bait, captureTime) {

    let divCatch = document.createElement("div");
    divCatch.className = "catch";
    divCatch.setAttribute("data-id", catchId);

    let lbAngler = document.createElement("label");
    lbAngler.textContent = "Angler";
    let inputAngler = document.createElement("input");
    Object.assign(inputAngler, {className: "angler", type: "text", value: angler});

    let lbWeight = document.createElement("label");
    lbWeight.textContent = "Weight";
    let inputWeight = document.createElement("input");
    Object.assign(inputWeight, {className: "weight", type: "number", value: weight});

    let lbSpecies = document.createElement("label");
    lbSpecies.textContent = "Species";
    let inputSpecies = document.createElement("input");
    Object.assign(inputSpecies, {className: "species", type: "text", value: species});

    let lbLocation = document.createElement("label");
    lbLocation.textContent = "Location";
    let inputLocation = document.createElement("input");
    Object.assign(inputLocation, {className: "location", type: "text", value: location});

    let lbBait = document.createElement("label");
    lbBait.textContent = "Bait";
    let inputBait = document.createElement("input");
    Object.assign(inputBait, {className: "bait", type: "text", value: bait});

    let lbCaptureTime = document.createElement("label");
    lbCaptureTime.textContent = "Capture Time";
    let inputCaptureTime = document.createElement("input");
    Object.assign(inputCaptureTime, {className: "captureTime", type: "number", value: captureTime});

    //buttons
    let btnUpdate = document.createElement("button");
    btnUpdate.textContent = "UPDATE";
    btnUpdate.addEventListener("click",handleUpdateCatch);

    let btnDelete = document.createElement("button");
    btnDelete.textContent = "DELETE";
    btnDelete.addEventListener("click",handleDeleteCatch);

    function handleUpdateCatch(e) {
        updateExistingCatch(catchId,
            inputAngler.value,
            inputWeight.value,
            inputSpecies.value,
            inputLocation.value,
            inputBait.value,
            inputCaptureTime.value
            ).catch(er =>{
            console.log(er.message);
        });
    }

    function handleDeleteCatch(e) {
        deleteCatch(catchId);
        domElements.main().removeChild(divCatch);
        console.log(catchId + " deleted!");
    }
    //buttons

    divCatch.append(
        lbAngler, inputAngler,
        document.createElement("hr"),
        lbWeight, inputWeight,
        document.createElement("hr"),
        lbSpecies, inputSpecies,
        document.createElement("hr"),
        lbLocation, inputLocation,
        document.createElement("hr"),
        lbBait, inputBait,
        document.createElement("hr"),
        lbCaptureTime, inputCaptureTime,
        document.createElement("hr"),
        btnUpdate, btnDelete
    );

    return divCatch;
}
