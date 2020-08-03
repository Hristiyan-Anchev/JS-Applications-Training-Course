let timeout = 5000;
let successBoxAttributes = {
    className: "p-3 mb-2 bg-success w-50 text-white text-center",
    id: "successNotification"
};

let errorBoxAttributes = {
    className: "p-3 mb-2 bg-danger w-50 text-white text-center",
    id: "errorNotification"
};

let regularBoxAttributes = {
    className: "p-3 mb-2 bg-info w-50 text-white text-center",
    id: "loadingNotification"
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
    setAttributes(attributesType);
    notificationElement.textContent = message;
    let container = notificationContainer();
    container.appendChild(notificationElement);

    setTimeout(() => {
        container.innerHTML = "";
        container.setAttribute("display","none");
        console.log("removed");
    }, timeout);
}

export function success(message) {
    notificationContainer().setAttribute("display","");
    produceNotification(message, successBoxAttributes);
}

export function error(message) {
    notificationContainer().setAttribute("display","");
    produceNotification(message, errorBoxAttributes);
}

export function regular(message = "Loading...") {
    notificationContainer().setAttribute("display","");
    produceNotification(message, regularBoxAttributes);
}

