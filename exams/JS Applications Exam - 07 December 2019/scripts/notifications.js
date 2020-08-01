let timeout = 5000;
let successBoxAttributes = {
    className: "alert alert-success",
    id: "successBox"
};
let errorBoxAttributes = {
    className: "alert alert-danger",
    id: "errorBox"
};
let regularBoxAttributes = {
    className: "alert alert-info",
    id: "loadingBox"
};

let notificationContainer = () => {
    return document.querySelector("#notifications");
}
let notificationElement = document.createElement("div");

notificationElement.addEventListener("click", () => {
    notificationContainer().innerHTML = "";

});

function setAttributes(attributes) {
    let {className, id} = attributes;
    notificationElement.className = className;
    notificationElement.id = id;
}

function produceNotification(message, attributesType) {
    notificationContainer().innerHTML = "";
    setAttributes(successBoxAttributes);
    notificationElement.textContent = message;
    let container = notificationContainer();
    container.appendChild(notificationElement);


    setTimeout(() => {
        container.innerHTML = "";
        console.log("removed");
    }, timeout);
}

export function success(message) {
    produceNotification(message, successBoxAttributes);
}

export function error(message) {
    produceNotification(message, errorBoxAttributes);
}

export function regular(message = "Loading...") {
    produceNotification(message, regularBoxAttributes);
}

