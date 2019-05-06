

var colors = d3.scale.category10();
// var currentMap = "#zoom_map";
var div01 = document.querySelector("#zoom_map");
var div02 = document.querySelector("#zoom_map02");
us_heatmap_colors = ["white", "#34005b"];
china_heatmap_colors = ["white", "darkred"];

var setdata = "usaid";
var setcol = us_heatmap_colors;
var setyear = 2019;

// heatmap_colors = ["yellow, blue", "red", "green"];

f = chroma.scale(["white", "#34005b"]).domain([0,5000000]);


series =  [
['ZAF', 1000 ],
['ZWE', 2000 ],
['NGA', 3000 ],
['MOZ', 4000 ],
['MDG', 5000 ],
['EGY', 6000 ],
['TZA', 7000 ],
['LBY', 8000 ],
['DZA',  9000],
['SSD', 10000],
['SOM', 11000],
['GIB', 12000],
['AGO', 13000]];

series02 =  [
    ['ZAF', 10000 ],
    ['ZWE', 10000 ],
    ['NGA', 3000 ],
    ['MOZ', 4000 ],
    ['MDG', 5000 ],
    ['EGY', 6000 ],
    ['TZA', 7000 ],
    ['LBY', 8000 ],
    ['DZA',  9000],
    ['SSD', 10000],
    ['SOM', 11000],
    ['GIB', 12000],
    ['AGO', 13000]];

// var dataset = {};

var onlyValues = series.map(function(obj){ return obj[1]; });
var minValue = Math.min.apply(null, onlyValues);
var maxValue = Math.max.apply(null, onlyValues);

// fill dataset in appropriate format
function fillDataset(seriesArr, colorFunc) {
    funcDataset = {}
    seriesArr.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
                value = item[1];
                //console.log(value, colorFunc(value));
                
        funcDataset[iso] = { thedata: value, fillColor: colorFunc(value) };
    });
    //console.log(funcDataset);
    return funcDataset;
}

let usaid_url = 'https://storage.googleapis.com/africa-data/usaid-disbursements.json';
let chinaaid_url = 'https://storage.googleapis.com/africa-data/chinaaid.json'

async function fetchJSON(urlparam) {
    const response = await fetch(urlparam);
    const json = await response.json();
    return json;
}

var zoom;

var queryYear = 2019;
var dataSeries = [];
var colorF = function(){};

var usaid = {};
var chinaaid = {};

var usaidPromise = fetchJSON(usaid_url);
var chinaaidPromise = fetchJSON(chinaaid_url);
usaidPromise.then(
    function (result) {

        chinaaidPromise.then(
            function (result2) {
                chinaaid = result2;
            }
        );
        usaid = result;
        
        // called twice to get rid of initial content jittering
        newMap(usaid, us_heatmap_colors, 2019);
        newMap(usaid, us_heatmap_colors, 2019);  
    }
);

var newMap = function (dataparam, colors, year) {
    
    // if (currentMap === "#zoom_map") {
    //     currentMap = "#zoom_map02";
    // }
    // else {
    //     currentMap = "#zoom_map";
    // }
    console.log("----------")
    dataSeries = [];
    var maxValue = 0;
    for (var i=0; i<dataparam.length; i++) {
        if (dataparam[i].year == year) {
            if (dataparam[i].current_amount > maxValue){
                console.log("Found new max! ", dataparam[i].country_name, " ", dataparam[i].current_amount );
                maxValue = dataparam[i].current_amount;
            }
            element = [dataparam[i].country_code, dataparam[i].current_amount];
            dataSeries.push(element);
        }
    }  // end for

    console.log(dataSeries);
    var minValue = 0;
    console.log("max value:", maxValue);
    var colorF = chroma.scale(colors).domain([0, maxValue]);
    dataset02 = fillDataset(dataSeries, colorF);
    //console.log(dataset);

    var zoom02 = new Datamap({
            //element: document.getElementById(currentMap.substr(1)),
            element: document.getElementById("zoom_map"),
            scope: 'world',
            // Zoom in on Africa
            
            setProjection: function(element) {
              var projection = d3.geo.equirectangular()
                .center([23, -3])
                .rotate([4.4, 0])
                .scale(440)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
              var path = d3.geo.path()
                .projection(projection);
                //console.log(path);
          
              return {path: path, projection: projection};
            },
            fills: {
              defaultFill: "slategray",
            },
            data: dataset02,
            
            geographyConfig: {
                borderColor: "#383838",
                popupTemplate: function(geo, data) {
                    return ['<div class="hoverinfo"><strong>',
                            geo.properties.name,
                            ': $' + formatNumber(data.thedata),
                            '</strong></div>'].join('');
                }
             
            }
    });

    xel = document.querySelector("#zoom_map");
    //console.log(xel.childNodes);
    if (document.querySelector("#zoom_map").childNodes.length > 3) {
        //console.log("made it here");
        replaceMap();
        
    }
}

function replaceMap() {
    el = document.querySelector("#zoom_map");
    //console.log(el.childNodes);
    //console.log(el.childNodes.length);
    el.removeChild(el.childNodes[2]);
    el.removeChild(el.childNodes[1]);
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
//console.log(usaid);


// INPUT HANDLERS
function yearForm(year) {

    if (setdata==="usaid") {
        console.log('in usaid if');
        setyear = year;
        setcol = us_heatmap_colors;
        newMap(usaid, setcol, setyear);
    }
    else {
        setyear = year;
        setcol = china_heatmap_colors;
        newMap(chinaaid, setcol, setyear);
    }


    console.log("setdata:", setdata, "; colors:", setcol, "; year:", year);
    
}

function setCountry(country) {
    console.log("country:", country);
    setdata = country;
    if (country==="usaid") {
        setcol = us_heatmap_colors;
        newMap(usaid, setcol, setyear);
    }
    else {
        setcol = china_heatmap_colors;
        newMap(chinaaid, setcol, setyear)
    }
    
}