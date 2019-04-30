
var colors = d3.scale.category10();

f = chroma.scale(["white", "darkred"]);

// d3.scale.threshold()
//     .range(['#8b0000','#a53c28','#bc634f','#d18978','#e3afa3','#f3d7d0','#ffffff']);
    
// function palette(min, max) {
//     var d = (max-min)/7;
//     return d3.scale.threshold()
//         .range(['#8b0000','#a53c28','#bc634f','#d18978','#e3afa3','#f3d7d0','#ffffff'])
//         .domain([min+1*d,min+2*d,min+3*d,min+4*d,min+5*d,min+6*d,min+7*d]);
// }



var zoom = new Datamap({
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
      defaultFill: "#ABDDA4",
      gt50: colors(Math.random() * 20),
      eq50: colors(Math.random() * 20),
      lt25: colors(Math.random() * 10),
      gt75: colors(Math.random() * 200),
      lt50: colors(Math.random() * 20),
      eq0: colors(Math.random() * 1),
      pink: '#0fa0fa',
      gt500: colors(Math.random() * 1)
    },
    data: {
      'ZAF': { fillKey: 'gt50', thedata: 1000 },
      'ZWE': { fillKey: 'lt25', thedata: 2000},
      'NGA': { fillKey: 'lt50', thedata: 3000 },
      'MOZ': { fillKey: 'eq50', thedata: 4000 },
      'MDG': { fillKey: 'eq50', thedata: 5000 },
      'EGY': { fillKey: 'gt75', thedata: 6000 },
      'TZA': { fillKey: 'gt75', thedata: 7000 },
      'LBY': { fillKey: 'eq0', thedata: 8000 },
      'DZA': { fillKey: 'gt500', thedata: 9000 },
      'SSD': { fillKey: 'pink', thedata: 10000 },
      'SOM': { fillKey: 'gt50', thedata: 11000 },
      'GIB': { fillKey: 'eq50', thedata: 12000 },
      'AGO': { fillKey: 'lt50', thedata: 13000 }
    },
    geographyConfig: {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo"><strong>',
                    'Number of things in ' + geo.properties.name,
                    ': ' + data.thedata,
                    '</strong></div>'].join('');
        }
    }
  });

  function generateFillColor(value) {

  }