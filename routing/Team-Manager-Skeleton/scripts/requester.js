"use strict"
export {registerUser, loginUser, logoutUser};

let restAPI = (function () {
    let appID = "9527FE8E-A85D-1655-FF92-500B0292B700";
    let apiKEY = "1B216107-383F-4F5E-84AE-77BF60DBAB86";

    let baseURL = `https://api.backendless.com/${appID}/${apiKEY}/`;
    let registerUserURL = `${baseURL}users/register`;
    let loginUserURL = `${baseURL}users/login`;
    let logoutUserURL = `${baseURL}users/logout`
    let teamsURL = `${baseURL}data/teams`;
    let allUsers = `${baseURL}users`;

    return {
        baseURL,
        registerUserURL,
        loginUserURL,
        logoutUserURL,
        teamsURL,
        allUsers
    }
})();

async function checkResponse(responseObj) {
    if (responseObj.ok) {
        try {
            return await responseObj.json();
        } catch (e) {
            console.log(`NO VALID JSON DATA TO PARSE --- ${e.message}`);
            return;

        }

    }
    alert(`An error occurred :: ${responseObj.statusText}`);
    throw new Error(responseObj.statusText);
}

async function registerUser(username, password) {
    let response = await fetch(restAPI.registerUserURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    return checkResponse(response);
}

async function loginUser(username, password) {
    let response = await fetch(restAPI.loginUserURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({login: username, password})
        }
    );
    return checkResponse(response);
}

async function logoutUser(userToken) {
    let response = await fetch(restAPI.logoutUserURL, {
        headers: {
            "user-token": userToken
        }
    });

    return checkResponse(response);
}

export async function createTeam(name, description, initialMember, token) {
    let response = await fetch(restAPI.teamsURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify({name, description, members: initialMember})
    });

    return checkResponse(response);
}

export async function getAllTeams() {
    let response = await fetch(restAPI.teamsURL);

    return checkResponse(response);
}

export async function getTeam(objectId) {
    let response = await fetch(`${restAPI.teamsURL}/${objectId}`);
    let data = await response.json();
    return data;
}

export async function removeMemberFromTeam(team, username,userToken,userObj) {
    let targetTeam = await (await fetch(`${restAPI.teamsURL}/${team}`)).json();
    let members = targetTeam.members;
    members = members.filter(m => {
        return m.username !== username;
    });
    //now update the team's members column in the DB
    await fetch(`${restAPI.teamsURL}/${team}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({members})
    });

    //remove current team from user field
    await fetch(`${restAPI.allUsers}/${userObj}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "user-token":userToken
        },
        body:JSON.stringify({currentTeam:""})
    });
}

export async function joinTeam(objectId,username,userObj,userToken){
    let targetTeam = await(await fetch(`${restAPI.teamsURL}/${objectId}`)).json();
    let members = targetTeam.members;
    members.push({username});
    //now update the team's members in the DB
    await fetch(`${restAPI.teamsURL}/${objectId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({members})
    });
    //update current user's team
    await fetch(`${restAPI.allUsers}/${userObj}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "user-token":userToken
        },
        body:JSON.stringify({currentTeam:objectId})
    });
}

export async function editTeam(objectId,name, comment){
    await fetch(`${restAPI.teamsURL}/${objectId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({name,description:comment})
    });

}




