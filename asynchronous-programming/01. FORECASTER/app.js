import {getForecastFor, getCacheExpTime} from "./data.js";
import {weatherBtn, getLocation, appendForecasts, deleteForecastEl} from "./DOM_Manipulator.js";
// if the forecast for given location is already in this set
// no network request will be made and forecast won't be appended twice in the DOM
let addedLocations = new Set();

function attachEvents() {


    weatherBtn().addEventListener("click", displayForecast)

    async function displayForecast() {
        document.getElementById("forecast").style.display = "block";
        let location = getLocation().toLowerCase().trim();
        //no duplicate additions allowed unless cache has expired
        if (!addedLocations.has(location)) {
            try {
                let {locationName, current, threeDay} = await getForecastFor(location);

                addedLocations.add(locationName);
                setTimeout(() => {
                    //invalidate the location after the cache time runs out
                    addedLocations.delete(locationName);
                }, getCacheExpTime())

                //delete the outdated DOM forecast
                deleteForecastEl(locationName);

                //append the new forecast as DOM element
                appendForecasts(locationName, current, threeDay);
                console.log(locationName, current, threeDay);
            } catch (e) {
                console.error(e.message);
            }
        }


    }

}


attachEvents();