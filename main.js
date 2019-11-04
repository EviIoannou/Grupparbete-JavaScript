var res;
var main = document.getElementById("molndalStations")

fetch("http://data.goteborg.se/RiverService/v1.1/MeasureSites/66473147-1c20-40c1-b1f9-6d18f1e620bf?format=json")
.then( response => {
  return response.json();
})
.then( myRes => {
res = myRes;
console.log(res);
})
.then (function() {
    render();
  })

function render () {

    res.forEach(station => {
        let tapping = "No currently available data";

        station.MeasureParameters.forEach(parameter => {
            if (parameter.Code == "Tapping") {
                tapping = parameter.CurrentValue
            }
        });
    
        console.log(tapping);

        let div = document.createElement("div");
        div.classList.add("station");
        div.innerHTML = `<div>${station.Description} </div>
                        <div>Flöde: ${tapping} </div>`
        ;
        main.appendChild(div);
        
    });

}