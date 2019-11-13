var res;
var main = document.getElementById("molndalStations");
var body = document.getElementsByTagName("body");
var dateToday = (new Date()).toISOString();
var startDate = document.getElementById("start");
var endDate = document.getElementById("end");

var station = document.getElementById("station");
var attributer = document.getElementById("attributer");
var h4 = document.getElementsByTagName("p");

var choose = document.getElementById("choose");
var tbody = document.getElementsByTagName("tbody");
var table = document.getElementById("valfriData"); // Jag har flyttat "table" upp så att den är global och funkar överallt
var lineGraph = document.getElementById("lineGraph");
var choice = document.getElementById("choice");
var errorMessage = document.getElementById("error-message");

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
  })


function render() {
  let thisValue = 0;

  res.forEach(station => {
    let tapping = "Ingen flöde data finns";

    station.MeasureParameters.forEach(parameter => {
      if (parameter.Code == "Tapping") {
        tapping = "Flöde: " + parameter.CurrentValue + "m<sup>3</sup>/s"
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

  // att skapa val till stationer
  let count = 0;
  res.forEach(r => {
    let select = document.getElementById("station");
    let option = document.createElement("option");
    option.innerHTML = r.Description;
    option.value = count;
    option.id = r.Code;
    count++;
    select.appendChild(option);
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

//defaultDates();

var parameterSV = "";

body[0].addEventListener("click", (e) => {

  console.log(e);
  console.log(e.target);

  console.log(e.target.parentNode);

  //hämta svensk attributnamn
  if ((e.target.nodeName == "INPUT") && (e.target.name == "alternativ")) {
    parameterSV = e.target.childNodes[0].nodeValue;
    console.log("The attribut name: ");
    console.log(parameterSV);
  }

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

  //att skapa användarens alternativ dynamiskt
  if (e.target.id == "station") {
    let stationIndex = parseInt(e.target.selectedIndex) - 1;
    console.log(e.target.selectedIndex);
    console.log(stationIndex);
    attributer.innerHTML = "";
    let heading = document.getElementsByTagName("h4");
    console.log(heading);
    choice.classList.remove("hidden"); 

    if (stationIndex >= 0) {
      res[stationIndex].MeasureParameters.forEach(parameter => {
        let div = document.createElement("span");
        let label = document.createElement("label");
        let input = document.createElement("input");

        label.setAttribute("for", (parameter.Code + stationIndex));
        label.innerHTML = parameter.Description

        input.type = "radio";
        input.name = "alternativ";
        input.value = parameter.Code;
        input.id = parameter.Code + stationIndex;
        input.appendChild(document.createTextNode(parameter.Description));


        div.appendChild(input);
        div.appendChild(label);
        attributer.appendChild(div);
      })
    }

  }


  station.addEventListener('change', (e) => {
    let stationIndex = `${e.target.value}`;
    console.log("You clicked" + " " + stationIndex);
    attributer.innerHTML = "";
    let heading = document.getElementsByTagName("h4");
    console.log(heading);
    choice.classList.remove("hidden"); 

    if (`${e.target.value}` != "default") {
      res[stationIndex].MeasureParameters.forEach(parameter => {
        let div = document.createElement("span");
        let label = document.createElement("label");
        let input = document.createElement("input");

        label.setAttribute("for", (parameter.Code + stationIndex));
        label.innerHTML = parameter.Description

        input.type = "radio";
        input.name = "alternativ";
        input.value = parameter.Code;
        input.id = parameter.Code + stationIndex;
        input.appendChild(document.createTextNode(parameter.Description));


        div.appendChild(input);
        div.appendChild(label);
        attributer.appendChild(div);
      })
    }
  });


  if (e.target.id == "choose") {

    errorMessage.innerHTML = "";

    tbody[0].innerHTML = "";
    let station = document.getElementById("station").selectedIndex;
    console.log(station);

    let valdstation = document.getElementsByTagName("option")[station].id;
    console.log(valdstation);

    var ele = document.getElementsByName('alternativ');
    for (i = 0; i < ele.length; i++) {
      if (ele[i].checked)
        var val = ele[i].value;
      var sv = ele[i].childNodes[0].data;
    }
    var x = document.getElementById("start")
    var xv = x.value

    var y = document.getElementById("end")
    var yv = y.value

    /** datum felhantering */

    try {
      if ( (yv == "") && (xv == "")) {
        defaultDates();
        throw "Antingen behöver du välja start och slutdatum eller använda vår default datum";
      }
      if (xv == "") throw "Du behöver välja startdatum";
      if (yv == "") throw "Du behöver välja slutdatum";
    }
    catch(err) {
        errorMessage.classList.remove("hidden"); 
        errorMessage.innerHTML = "*" + err;
    }
  

    let graph = document.getElementById("graph");
    let tabell = document.getElementById("tabell");
    let showAll = document.getElementById("showAll");
    fetch("http://data.goteborg.se/RiverService/v1.1/Measurements/753ef3b1-259d-4e5f-b981-4ef377376164/" + `${valdstation}` + "/" + `${val}` + "/" + `${xv}` + "/" + `${yv}` + "?format=json")
      .then(response => {
        return response.json();
      })
      .then(newRes => {

        /** felhantering */

  
        let startYear = parseInt(startDate.value.slice(0,4));
        let startMonth = parseInt(startDate.value.slice(4,7));
        let startDay = parseInt(startDate.value.slice(8));

        let endYear = parseInt(endDate.value.slice(0,4));
        let endMonth = parseInt(endDate.value.slice(4,7));
        let endDay = parseInt(endDate.value.slice(8));
        
        //if ()


        if (newRes.length == 0) {
          alert("Ingen data finns");


        } else if (tabell.checked) {

          //göm diagram
          if (lineGraph.classList != "hidden") {
            lineGraph.classList.add("hidden");
          }

          //göm divar med alla information och visa knapp för att kunna se dem igen
          table.classList.remove("hidden");
          main.classList.add("hidden");
          showAll.classList.remove("hidden");

          //create a table
          newRes.forEach(r => {
            //show the dates and appropriate value;
            let time = r.TimeStamp.replace("/Date(", "");
            num = time.replace(")/", "");
            let miliSec = parseInt(num);
            let date = new Date(miliSec);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();

            let value = r.Value;
            //insert info into table
            let stationInfo = document.createElement("tr");
            let name = document.createElement("td");
            name.innerHTML = res[station - 1].Description;
            let datum = document.createElement("td");
            datum.innerHTML = day + "/ " + month + "/ " + year;
            let att = document.createElement("td");
            att.innerHTML = `${parameterSV}`;

            let v = document.createElement("td");
            v.innerHTML = value;

            stationInfo.appendChild(name);
            stationInfo.appendChild(datum);
            stationInfo.appendChild(att);
            stationInfo.appendChild(v);
            tbody[0].appendChild(stationInfo);

            console.log(day + " " + month + " " + year + " " + `${val}` + " " + value)
          });
          } else if (graph.checked) {

          if (table.classList != "hidden") {
            table.classList.add("hidden");
            //tabellen kommer att försvinna och diagramen kommer att visas
          }
      
          console.log(newRes);

          lineGraph.classList.remove("hidden");

          //göm divar med alla information och visa knapp för att kunna se dem igen
          main.classList.add("hidden");
          showAll.classList.remove("hidden");


          /** start creating the graph using canvasjs.min.js */

          //skapa en array med datum och parameter variabler i lämpligt format
          let data = [];

          newRes.forEach(result => {
            let time = result.TimeStamp;
            let unixTime = time.slice((time.indexOf("(") + 1), (time.indexOf(")")));
            let regular = new Date(parseInt(unixTime));

            let thisDataPoint = {
              x: regular,
              y: result.Value
            };
            data.push(thisDataPoint);
          })

          //skapa diagram
          var chart = new CanvasJS.Chart("lineGraph", {
            animationEnabled: true,
            theme: "light2",
            title: {
              text: res[station - 1].Description + " - " + parameterSV
            },
            axisX: {
              valueFormatString: "MMM YY", //can I change this to SV format
              labelFontColor: "black",
              crosshair: {
                enabled: true,
                snapToDataPoint: true
              }
            },
            axisY: {
              //\u00B2 = uni-code of superscript 2
              title: parameterSV + " (m\u00B3/s)",
              titleFontColor: "black",
              labelFontColor: "black",
              crosshair: {
                enabled: true
              }
            },
            toolTip: {
              shared: true
            },
            legend: {
              cursor: "pointer",
              verticalAlign: "bottom",
              horizontalAlign: "left",
              dockInsidePlotArea: true,
              itemclick: toogleDataSeries
            },
            data: [{
              type: "line",
              name: parameterSV + " (m\u00B3/s)",
              xValueFormatString: "DD MMM YYYY",
              color: "#3BD8D9",
              dataPoints: data
            }]
            });
            chart.render();

            function toogleDataSeries(e) {
              if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              } else {
                e.dataSeries.visible = true;
              }
              chart.render();
            }
          }
      })
      
      
  }



  if(e.target.id=="showAll"){
    if(main.classList=="hidden"){
      main.classList.remove("hidden");
      e.target.innerHTML="Göm allt data"
    }
    else{
      main.classList.add("hidden");
      e.target.innerHTML="Visa allt data"
    }
  }

})