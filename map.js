

var colors = d3.scale.category10();
// var currentMap = "#zoom_map";
var div01 = document.querySelector("#zoom_map");
var div02 = document.querySelector("#zoom_map02");
heatmap_colors = ["f5f5f5", "red"];

f = chroma.scale(["blue", "darkred"]).domain([0,5000000]);


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

  
  function updateMap(func_series, color_param_func) {
    outobj = {};
    for (var i=0; i < func_series.length; i++)
    {   
        hexstr = chroma(color_param_func(func_series[i][1])).hex();
        outobj[func_series[i][0]] = hexstr;
    }
    //console.log(outobj);
    zoom.updateChoropleth(outobj);
}

let usaid_url = 'https://storage.googleapis.com/africa-data/usaid-disbursements.json';

async function fetchJSON(urlparam) {
    const response = await fetch(urlparam);
    const json = await response.json();
    return json;
}

var zoom;

var queryYear = 2010;
var dataSeries = [];
var colorF = function(){};

var usaid = {};
var usaidPromise = fetchJSON(usaid_url);
usaidPromise.then(
    function (result) {
        usaid = result;
        // TODO: initialize map data values here because reasons
        for (var i=0; i<usaid.length; i++) {
            if (usaid[i].fiscal_year == queryYear) {
                element = [usaid[i].country_code, usaid[i].current_amount];
                dataSeries.push(element);
            }
        }  // end for
        
        var minValue = 0;
        var maxValue = getMax(dataSeries);
        console.log(maxValue);
        colorF = chroma.scale(heatmap_colors).domain([0, maxValue]);
        dataset = fillDataset(dataSeries, colorF);
        //console.log(dataset);
        

        zoom = new Datamap({
                element: document.getElementById("zoom_map"),
                scope: 'world',
                // Zoom in on Africa
                
                setProjection: function(element) {
                  var projection = d3.geo.equirectangular()
                    .center([23, -3])
                    .rotate([4.4, 0])
                    .scale(400)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                  var path = d3.geo.path()
                    .projection(projection);
                    
              
                  return {path: path, projection: projection};
                },
                fills: {
                  defaultFill: "slategray",
                },
                data: dataset,
                
                geographyConfig: {
                    popupTemplate: function(geo, data) {
                        return ['<div class="hoverinfo"><strong>',
                                geo.properties.name,
                                ': $' + formatNumber(data.thedata),
                                '</strong></div>'].join('');
                    }
                 
                }
              });
            
    }
);

newMap = function (dataparam, year) {
    
    // if (currentMap === "#zoom_map") {
    //     currentMap = "#zoom_map02";
    // }
    // else {
    //     currentMap = "#zoom_map";
    // }
    dataSeries = [];
    for (var i=0; i<dataparam.length; i++) {
        if (dataparam[i].fiscal_year == year) {
            element = [dataparam[i].country_code, dataparam[i].current_amount];
            dataSeries.push(element);
        }
    }  // end for

    var minValue = 0;
    var maxValue = getMax(dataSeries);
    console.log(maxValue);
    colorF = chroma.scale(heatmap_colors).domain([0, maxValue]);
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
                .scale(400)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
              var path = d3.geo.path()
                .projection(projection);
                console.log(path);
          
              return {path: path, projection: projection};
            },
            fills: {
              defaultFill: "slategray",
            },
            data: dataset02,
            
            geographyConfig: {
                popupTemplate: function(geo, data) {
                    return ['<div class="hoverinfo"><strong>',
                            geo.properties.name,
                            ': ' + formatNumber(data.thedata),
                            '</strong></div>'].join('');
                }
             
            }
    });
 
    replaceMap();
}

function replaceMap() {
    el = document.querySelector("#zoom_map");
    console.log(el.childNodes);
    el.removeChild(el.childNodes[4]);
    el.removeChild(el.childNodes[3]);
}

function getMax(arr) {
    max = -1; 
    for (var i=0; i<arr.length; i++) {
        if (arr[i][1] > max) {
            max = arr[i][1];
        }
    }
    return max;
}
function getMin(arr) {
    min = Number.MAX_SAFE_INTEGER; 
    for (var i=0; i<arr.length; i++) {
        if (arr[i][1] < min) {
            min = arr[i][1];
        }
    }
    return min;
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
//console.log(usaid);
