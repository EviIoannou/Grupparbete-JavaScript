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
    let thisValue = 0;

    res.forEach(station => {
        let tapping = "Ingen flöde data finns";

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

        station.MeasureParameters.forEach(parameter => {
            if (parameter.Code != "Tapping") {
               let info = document.createElement("div");
               info.classList.add("hidden");
               info.innerHTML = parameter.Description + ": " + parameter.CurrentValue; 
               div.appendChild(info);
            }
        });

        let button = document.createElement("button");
        button.innerHTML = "See details";
        div.appendChild(button)
        thisValue++;
    });
}

body[0].addEventListener("click", (e) => {

    console.log(e);
    console.log(e.target);
    console.log(e.target.parentNode);

    if (e.target.nodeName == "BUTTON") {
        let index = e.target.parentNode;
        


    }









})
