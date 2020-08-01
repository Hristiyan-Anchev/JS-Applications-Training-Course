// rest api links
let restAPI = (function () {
    let applicationID = "EA933B5D-7232-6A42-FFF3-E7121F1F0300" ;
    let restApiKey =    "26CCDD6E-1DA3-4AF6-BD3B-1F271E50D178";
    let tableName = "tracks";
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


//************************************************************
//************************************************************
// utility functions
//************************************************************
//************************************************************

//check response of http request
function checkResponse(response) {
    //    checking .json() response;
    if (response.hasOwnProperty("message")) {
        throw new Error(response.message);
    }

    //in case you pass in the response object... without .json()
    if (response.hasOwnProperty("ok") && !response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}

//validates if two passwords match
export function passwordValidator(password, repeatPassword = password) {
    let requiredLength = 0;
    let checkResult = [password.trim(), repeatPassword.trim()].every(p => {
        return p.length >= requiredLength && p === password;
    });
    if(!checkResult){
        throw new Error(`Invalid password!`);
    }
    return checkResult;
}

//validates identity
export function validateIdentity(identityValue){
    let requiredLength = 0;
    let checkResult = identityValue.trim().length >= requiredLength;
    if(!checkResult){
        throw new Error(`Username is invalid! Required length: ${requiredLength}`);
    }
    return checkResult;
}

//extract names from an email
export function extractNames(email){
    let tokens = email.split("@");
    let names = tokens[0];

    function namesToUpperCase(separator,names){
        names = names.split(separator);
        names = names.map(n=>{
            n = n.charAt(0).toUpperCase() + n.substring(1);
            return n;
        });
        return names;
    }
        let nameSeparators = {
            "-":(names)=>{
                return namesToUpperCase("-",names).join("-");
            },
            "_":(names)=>{
                return namesToUpperCase("_",names).join(" ");
            },
            ".":(names)=>{
                return namesToUpperCase(".",names).join(" ");
            }
        }
        Object.keys(nameSeparators).forEach(t => {
            if(names.includes(t)){
                names = nameSeparators[t](names);
            }
        });
    return names;
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
//************************************************************
//************************************************************
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

//************************************************************
//************************************************************
//************************************************************
//************************************************************

// user: register, login logout

export async function registerUser(identity, password) {
    let body = identity.includes("@") ? {email:identity,password} :
        {username:identity,password};
    console.log(body);
    let response = await (await (fetch(restAPI.registerUserURL, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(body)
    }))).json();

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
