function solve() {
    let busStop = document.querySelector("span.info");
    let departBtn = document.querySelector("input#depart");
    let arriveBtn = document.querySelector("input#arrive");
    departBtn.disabled = false; arriveBtn.disabled = true;
    let stops = [];
    getNextStop("depot");


    function depart() {
        let currentStop = stops[0];
        busStop.textContent = `Next stop ${currentStop.name}`;
        getNextStop(currentStop.next);
        buttonsSwap();
    }

    function arrive() {
        busStop.textContent = `Arriving at ${stops[0].name}`;
        stops.shift();
        buttonsSwap();
    }

    function buttonsSwap() {
        let departState = departBtn.disabled;
        let arriveState = arriveBtn.disabled;
        departBtn.disabled = departState !== true;
        arriveBtn.disabled = arriveState !== true;
    }

    function getNextStop(nextStop) {
        fetch(`https://judgetests.firebaseio.com/schedule/${nextStop}.json`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                stops.push(data);
            });
    }

    return {
        depart,
        arrive
    };

}

let result = solve();