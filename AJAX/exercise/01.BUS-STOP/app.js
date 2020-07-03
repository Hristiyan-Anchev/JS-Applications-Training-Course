function getInfo() {
    const stopNameField = document.querySelector("#stopName");
    const inputField = document.querySelector("#stopId");
    const busesUl = document.querySelector("#buses");

        let stopId = Number(inputField.value);
        let requestUrl = `https://judgetests.firebaseio.com/businfo/${stopId}.json`;

        stopNameField.textContent = "";
        busesUl.innerHTML = "";
            fetch(requestUrl)
            .then(response => {
                if(!response.ok){
                    console.log("bad response: ", response.statusText);
                    stopNameField.textContent = "ERROR";
                    return;
                }
                console.log("great success: ",response.statusText);
                return response.json();
            }).then(data => {
                stopNameField.textContent = data.name;
                let buses = data.buses;

            Object.entries(buses).forEach(b => {
                let li = document.createElement("li");
                li.textContent = `Bus ${b[0]} arrives in ${b[1]}`;
                busesUl.appendChild(li);
            });
        });

}