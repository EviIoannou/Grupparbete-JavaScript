var res;
var main = document.getElementById("molndalStations");
var body = document.getElementsByTagName("body");
var dateToday = (new Date()).toISOString();
var startDate = document.getElementById("start");
var endDate = document.getElementById("end");

fetch("http://data.goteborg.se/RiverService/v1.1/MeasureSites/66473147-1c20-40c1-b1f9-6d18f1e620bf?format=json")
  .then(response => {
    return response.json();
  })
  .then(myRes => {
    res = myRes;
    console.log(res);
  })
  .then(function () {
    render();
    res.forEach(r => { //funktion för att skapa val till stationer
      let select = document.getElementById("station");
      let option = document.createElement("option");
      option.innerHTML = r.Code;
      option.value = r.Code;
      select.appendChild(option);
    });
  })


function render() {
  let thisValue = 0;

  res.forEach(station => {
    let tapping = "Ingen flöde data finns";

    station.MeasureParameters.forEach(parameter => {
      if (parameter.Code == "Tapping") {
        tapping = "Flöde: " + parameter.CurrentValue + "m<sup>2</sup>/s"
      }

    });

    console.log(tapping);

    let div = document.createElement("div");
    div.classList.add("station");
    div.setAttribute("id", thisValue);
    div.innerHTML = `<div>${station.Description} </div>
                        <div>${tapping} </div>`;
    main.appendChild(div);

    if (station.SG) {
      let dg = document.createElement("div");
      let sg = document.createElement("div");
      dg.classList.add("hidden");
      sg.classList.add("hidden");
      dg.innerHTML = "Övre nivå: " + station.DG;
      sg.innerHTML = "Undre nivå: " + station.SG;
      div.appendChild(dg);
      div.appendChild(sg);
    }

    station.MeasureParameters.forEach(parameter => {
      if ((parameter.Code != "Tapping") && (parameter.Code != "Flow")) {
        let info = document.createElement("div");
        info.classList.add("hidden");
        if (parameter.Code == "Level") { //used "Level" in case 
          info.innerHTML = "Aktuell Nivå: " + parameter.CurrentValue;
        } else {
          info.innerHTML = parameter.Description + ": " + parameter.CurrentValue;
        }
        div.appendChild(info);
      }
    });


    let button = document.createElement("button");
    button.innerHTML = "Se detajler";
    button.classList.add("details");
    div.appendChild(button);
    thisValue++;
  });
}


function defaultDates() {
  let t = dateToday.indexOf("T");
  let defaultToday = dateToday.slice(0, t);

  let year = dateToday[3];
  let lastyear = year - "1";
  let defaultStart = defaultToday.replace(year, lastyear);

  endDate.value = defaultToday;
  startDate.value = defaultStart;
}

defaultDates();

body[0].addEventListener("click", (e) => {

  console.log(e);
  console.log(e.target);
  console.log(e.target.parentNode);

  if (e.target.className == "details") {
    let index = e.target.parentNode;
    let hidden = index.querySelectorAll(".hidden");
    hidden.forEach(hid => {
      hid.classList.remove("hidden");
      hid.classList.add("show");
    });
    e.target.classList.remove("details");
    e.target.classList.add("less");
    e.target.innerHTML = "Göm detaljer"
  } else if (e.target.className == "less") {
    let index = e.target.parentNode;
    let hidden = index.querySelectorAll(".show");
    hidden.forEach(hid => {
      hid.classList.add("hidden")
    });
    e.target.classList.remove("less");
    e.target.classList.add("details");
    e.target.innerHTML = "Se detaljer"
  }
})

function specificData() {
  let station = document.getElementById("station").selectedIndex;
  console.log(station);
  let valdstation = document.getElementsByTagName("option")[station].value;

  var ele = document.getElementsByName('alternativ');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked)
      var val = ele[i].value;
  }
  var x = document.getElementById("start")
  var xv = x.value

  var y = document.getElementById("end")
  var yv = y.value

  //console.log( "http://data.goteborg.se/RiverService/v1.1/Measurements/753ef3b1-259d-4e5f-b981-4ef377376164/" + `${valdstation}` + "/" + `${val}` + "/" + `${xv}` + "/" + `${yv}` + "?format=json")
  fetch("http://data.goteborg.se/RiverService/v1.1/Measurements/753ef3b1-259d-4e5f-b981-4ef377376164/" + `${valdstation}` + "/" + `${val}` + "/" + `${xv}` + "/" + `${yv}` + "?format=json")
    .then(response => {
      return response.json();
    })
    .then(newRes => {
      if (newRes.length == 0) {
        console.log("no data")
      } else {
        //create a table
        let table = document.getElementById("valfriData");
        let stationInfo= document.createElement("tr");
        let name= document.createElement("td");
        name.innerHTML= valdstation;
         let att= document.createElement("td");
        att.innerHTML= `${val}`;
        stationInfo.appendChild(name);
        stationInfo.appendChild(att);
        table.appendChild(stationInfo);
        table.classList.remove("hidden");

console.log(valdstation);



        newRes.forEach(r => {
          //show the date and appropriate value on screen;
          let time = r.TimeStamp.replace("/Date(", "");
          num = time.replace(")/", "");
          let miliSec = parseInt(num);
          let date = new Date(miliSec);
          let day = date.getDate();
          let month = date.getMonth();
          let year = date.getFullYear();

          let value = r.Value;

          //insert info into table
        

          console.log(day + " " + month + " " + year + " " + `${val}` + " " + value)
        });
      }
    })
}