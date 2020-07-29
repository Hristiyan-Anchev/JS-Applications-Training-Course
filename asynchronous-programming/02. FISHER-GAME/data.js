export let errorHandlers = {
    handleError: (err) => {
        console.log("ERROR :: " + err.message);
    }
}

let endpoints = {
    listAllUrl: "https://fisher-game.firebaseio.com/catches.json",
    createNewUrl: "https://fisher-game.firebaseio.com/catches.json",
    updateCatchUrl: (catchId) => {
        return `https://fisher-game.firebaseio.com/catches/${catchId}.json`;
    },
    deleteCatchUrl: (catchId) => {
        return `https://fisher-game.firebaseio.com/catches/${catchId}.json`;
    }
}

export function fetchAllCatches() {
    return fetch(endpoints.listAllUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Response error occurred: ${response.statusText}`);
            }
            return response;
        })
        .then(response => {
            return response.json()
        });
}

export function fetchNewCatch(angler, weight, species, location, bait, captureTime) {
    return fetch(endpoints.createNewUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({angler, weight, species, location, bait, captureTime})
    })//response is an object {name: "<uniqueKey>"}
        .catch(errorHandlers.handleError);
}

export function updateExistingCatch(catchId,angler, weight, species, location, bait, captureTime) {
    return fetch(endpoints.updateCatchUrl(catchId), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({angler, weight, species, location, bait, captureTime})
    })//response is an object {name: "<uniqueKey>"}
        .catch(errorHandlers.handleError);
}

export function deleteCatch(catchId){
    fetch(endpoints.deleteCatchUrl(catchId),{
        method:"DELETE"
    }).catch(errorHandlers.handleError);
}


