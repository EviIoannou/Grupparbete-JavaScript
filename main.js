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
    res.forEach(r=>{  //funktion för att skapa val till stationer
  let select= document.getElementById("station");
  let option= document.createElement("option");
  option.innerHTML=r.Code;
  option.value=r.Code;
  select.appendChild(option);
});
  let alternativ=["Flow", "Level", "LevelDownstream", "Tapping", "RainFall"];
  alternativ.forEach(alt=>{
    let choices= document.getElementById("attributes");
    let option= document.createElement("option");
    option.innerHTML=alt;
    option.value=alt;
    choices.appendChild(option);
  })
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
        let button = document.createElement("button");
      button.innerHTML = "See details";
      div.appendChild(button)
    
    });

}