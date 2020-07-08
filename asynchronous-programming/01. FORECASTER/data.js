let baseURL = "https://judgetests.firebaseio.com/";
let locationsURL = baseURL + "locations.json";
//this value controls the cache's expiration time(in seconds), change this accordingly
let cacheExpirationTime = 60;
let locations = new Map();
let myCache = new Map();

(function getLocations() {
    fetch(locationsURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(data => {
        data.forEach(l => {
            locations.set(l.name.toLowerCase(), l.code);
        });
    }).catch(e => {
        console.log(e.message);
    });
})();

export async function getCurrentForecast(location) {
    let queryURL = `${baseURL}forecast/today/${locations.get(location)}.json`;
    console.log("Current forecast URL: ", queryURL);
    let response = await fetch(queryURL);
    if(response.ok){
        let data = await response.json();
        return data
    }
    throw new Error(response.statusText);
}

export async function getThreeDayForecast(location) {
    let queryURL = `${baseURL}forecast/upcoming/${locations.get(location)}.json`;
    console.log("Three day forecast URL: ", queryURL);
    let response = await fetch(queryURL);
    if(response.ok){
        let data = await response.json();
        return data
    }
    throw new Error(response.statusText);
}

export async function getForecastFor(location) {
    let targetForecast = myCache.get(location);
    if (targetForecast === undefined) {
        let result = await Promise.all([getCurrentForecast(location), getThreeDayForecast(location)]);
        let locationName = result[0].name;
        let current = result[0].forecast;
        let threeDay = result[1].forecast;
        // console.log(locationName);
        myCache.set(location, {locationName,current, threeDay});
        //set cache expiration
        setTimeout(() => {
            myCache = new Map()
        }, cacheExpirationTime * 1000);
        targetForecast = myCache.get(location);
    }

    return Promise.resolve(targetForecast);

}

export function getCacheExpTime(){
    return cacheExpirationTime*1000;
}