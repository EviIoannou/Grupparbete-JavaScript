var res;
var main = document.getElementById("molndalStations");
var body = document.getElementsByTagName("body");

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
    let thisValue = 0;

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
        div.setAttribute("id", thisValue);
        div.innerHTML = `<div>${station.Description} </div>
                        <div>Flöde: ${tapping} </div>`;
        main.appendChild(div);

        let button = document.createElement("button");
        button.innerHTML = "See details";
        div.appendChild(button)
        thisValue++;
    });

    // res.forEach(station => {
    //     let tapping = "Ingen flöde data finns";

    //     let div = document.createElement("div");
    //     div.classList.add("station");
    //     div.setAttribute("id", thisValue);
    //     div.innerHTML = `<div id>${station.Description} </div>`;

    //     let button = document.createElement("button");
    //     button.innerHTML = "See details";

    //     station.MeasureParameters.forEach(parameter => {
    //         let info = document.createElement("div");

    //         if (parameter.Code == "Tapping") {
    //             tapping = "Flöde: " + parameter.CurrentValue;
    //             // info.innerText = parameter.Description + ": " + tapping;
    //             info.innerText = tapping;
    //         } else {
    //             info.classList.add("hidden");
    //             info.innerText = parameter.Description + ": " + parameter.CurrentValue;
    //         }

    //         div.appendChild(info);
    //     });
        
    //     console.log(tapping);


    //     main.appendChild(div);
    //     div.appendChild(button)
    //     thisValue++;
    // });
}

body[0].addEventListener("click", (e) => {

    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);

    if (e.target.nodeName == "BUTTON") {
        let index = e.target.parentNode;
        


    }









})
