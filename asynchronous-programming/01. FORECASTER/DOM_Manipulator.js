let knownLocations = new Map();

let domElements = {
    getWeatherBtn: () => {
        return document.getElementById("submit")
    },
    inputLocation: () => {
        return document.getElementById("location")
    },
    currentForecastSection: () => {
        return document.getElementById("current").children[1];
    },
    upcomingForecastSection: () => {
        return document.getElementById("upcoming")
    }
};

let conditionSymbols = {
    "Sunny": "☀",
    "Partly sunny": "⛅",
    "Overcast": "☁",
    "Rain": "☂",
    "Degrees": "°"
}

export function weatherBtn() {
    return domElements.getWeatherBtn();
}

export function getLocation() {
    return domElements.inputLocation().value;
}

function currentConditions(conditionSymbol, fullLocation, min_max, condition) {

    let divForecast = document.createElement("div");
    divForecast.className = "forecasts";

    let spanConditionSymbol = document.createElement("span");
    spanConditionSymbol.className = "condition symbol";
    spanConditionSymbol.textContent = conditionSymbol;

    let spanCondition = document.createElement("span");
    spanCondition.className = "condition";

    let spanLocationName = document.createElement("span");
    spanLocationName.className = "forecast-data";
    spanLocationName.innerHTML = fullLocation;

    let spanTemperatures = document.createElement("span");
    spanTemperatures.className = "forecast-data";
    spanTemperatures.textContent =
        `${min_max[0]}${conditionSymbols.Degrees}/${min_max[1]}${conditionSymbols.Degrees}`

    let spanLocationCondition = document.createElement("span");
    spanLocationCondition.className = "forecast-data";
    spanLocationCondition.textContent = condition;

    //grouping all the elements
    spanCondition.append(spanLocationName, spanTemperatures, spanLocationCondition);
    divForecast.append(spanConditionSymbol, spanCondition);

    return divForecast;
}

function upcomingForecast(symbol, conditions, fullLocation) {
    let result = document.createElement("div");
    result.className = "forecast-info";
    let displayName = document.createElement("span");
    displayName.className = "display-name";
    displayName.textContent = fullLocation;
    result.appendChild(displayName);

    conditions.forEach(c => {
        let spanUpcoming = document.createElement("span");
        spanUpcoming.className = "upcoming";

        let spanSymbol = document.createElement("span");
        spanSymbol.className = "symbol";
        spanSymbol.innerHTML = conditionSymbols[c.condition];

        let spanForecastTemp = document.createElement("span");
        spanForecastTemp.className = "forecast-data";
        spanForecastTemp.textContent =
            `${c.low}${conditionSymbols.Degrees}/${c.high}${conditionSymbols.Degrees}`;

        let spanCondition = document.createElement("span");
        spanForecastTemp.className = "forecast-data";
        spanCondition.textContent = c.condition;

        spanUpcoming.append(spanSymbol, spanForecastTemp, spanCondition);
        result.appendChild(spanUpcoming);
    });

    return result
}

export function appendForecasts(locationName, current, threeDay) {
    //append the current forecast to the DOM;
    let curForecastEl = currentConditions(
        conditionSymbols[current.condition],
        locationName,
        [current.low, current.high],
        current.condition
    );
    let upcomingForecastEl = upcomingForecast(conditionSymbols[locationName], threeDay, locationName);

    domElements.currentForecastSection()
        .appendChild(curForecastEl);
    domElements.upcomingForecastSection()
        .appendChild(upcomingForecastEl);

    knownLocations.set(locationName, [curForecastEl, upcomingForecastEl])
}

export function deleteForecastEl(location) {
    let targetForecasts = knownLocations.get(location);
    if (targetForecasts) {
        domElements.currentForecastSection().removeChild(targetForecasts[0]);
        domElements.upcomingForecastSection().removeChild(targetForecasts[1]);
    }

}