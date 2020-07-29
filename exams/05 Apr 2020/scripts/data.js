// rest api links
let restAPI = (function () {
    let applicationID = "47DF6284-959A-10BC-FFBC-97E1850DDD00";
    let restApiKey = "F5983FF3-102F-49BC-AC74-029092B8F068";
    let tableName = "articles";
    let baseURL = `https://api.backendless.com/${applicationID}/${restApiKey}`;
    let dataUrl = `${baseURL}/data/${tableName}`
    let usersURL = `${baseURL}/users`;
    let registerUserURL = `${usersURL}/register`;
    let loginUserURL = `${usersURL}/login`;
    let logoutUserURL = `${usersURL}/logout`;

    return {
        baseURL,
        dataUrl,
        usersURL,
        registerUserURL,
        loginUserURL,
        logoutUserURL
    }
})();

// utility functions
//************************************************************

//check response of http request
function checkResponse(response) {

    if (response.hasOwnProperty("message")) {
        throw new Error(response.message);
    }
    //in case you pass in the response object
    if (response.hasOwnProperty("ok") && !response.ok) {
        throw new Error(response.statusText);
    }

    return response;
}

//validates if two passwords match
export function passwordValidator(password, repeatPassword) {
    let requiredLength = 0;

    return [password.trim(), repeatPassword.trim()].every(p => {
        return p.length >= requiredLength && p === password && p !== "";
    });
}

//generates common headers
function getHeader(customHeaders = {}) {
    //pass in false if no additional headers are required
    let header = {
        "Content-Type": "application/json",
    }

    if (customHeaders === false) {
        return header
    }
    let userToken = window.localStorage.getItem("userToken");
    if(userToken){
        return Object.assign(header, {
            "user-token":userToken,
            ...customHeaders
        });
    }else{
        return Object.assign(header, {
            ...customHeaders
        });
    }

}


//************************************************************

//create, read, update, delete

export async function createData(body) {
    let response = await (await fetch(restAPI.dataUrl, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(body)
    })).json();

    return checkResponse(response);
}

export async function readData(objectId = "") {
    // if no objectId is passed the function returns the
    //whole collection of data
    let target = ""
    if (objectId !== "") {
        target = `/${objectId}`;
    }
    let response = await (await fetch(restAPI.dataUrl + target, {
        method: "GET",
        headers: getHeader(),
    })).json();

    return checkResponse(response);
}

export async function updateData(objectId, updatedData) {
    let response = await (await fetch(restAPI.dataUrl + `/${objectId}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(updatedData)
    })).json();

    return checkResponse(response);
}

export async function deleteData(objectId) {
    let response = await (await fetch(restAPI.dataUrl + `/${objectId}`, {
        method: "DELETE",
        headers: getHeader(),
    }));
}

// user: register, login logout

export async function registerUser(identity, password) {

    let response = await (fetch(restAPI.registerUserURL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify({email: identity, password})
    }));
    return checkResponse(response);
}

export async function loginUser(identity, password) {
    let response = await (await fetch(restAPI.loginUserURL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify({login: identity, password})
    })).json();

    response = checkResponse(response);

    return {
        //return user session data directly ... await loginUser()
        objectId: response.objectId,
        userToken: response["user-token"],
    }
}

export async function logoutUser() {
    let response = await (fetch(restAPI.logoutUserURL, {
        method: "GET",
        headers: getHeader(),
    }));

    return checkResponse(response);
}

export function notification(notificationText, type) {
    let notificationsCount = parseInt(window.localStorage.getItem("notificationsCount")) || 0;
    type = !type ? "regular" : type.toLowerCase();
    // insert the id or className of the notification container
    //no tagName allowed<
    let containerIdentifier = ".notificationArea";

    let notificationContainer = document.querySelector(containerIdentifier) ;
    if(! notificationContainer){
        notificationContainer = document.createElement("div");
        notificationContainer.classList.add(containerIdentifier.substring(1));
        document.querySelector("body").prepend(notificationContainer);
    }




    notificationContainer.style.display = "";
    let types = ["success", "fail", "regular"];

    function createNotification(text) {
        //insert the id or the class according to css styles
        let cssStyleAttribute = {
            success:"",
            fail:"",
            regular:"",
        }

        let notification = document.createElement("div");

        // uncomment accordingly
        // notification.classList.add(cssStyleAttribute[type]);
        // notification.id = cssStyleAttribute[type];
        //******************************************************

        notification.textContent = text;
        return notification;
    }

        return {
            display: function(){
                if (types.includes(type) && notificationsCount === 0) {
                    notificationsCount++;
                    window.localStorage.setItem("notificationsCount",String(notificationsCount));
                    let notification = createNotification(notificationText);
                    notificationContainer.appendChild(notification);

                }
                return {
                    hide: function(){
                        notificationsCount--;
                        window.localStorage.setItem("notificationsCount",String(notificationsCount));
                        notificationContainer.style.display = "none";
                        notificationContainer.innerHTML = "";
                    }
                }
            }
        }



}
