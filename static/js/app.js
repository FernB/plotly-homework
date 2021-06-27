


var trace = {
    x: [],
    y: [],
    text:[],
    type: "bar",
    orientation: "h",
    // hovertemplate:"<b>OTU Label:</b><br>"+"%{text}"+"<extra></extra>",
    hoverinfo:"text",
    };
    
var databar = [trace];

var layoutbar = {
  hovermode: 'closest',
  hoverlabel: { bgcolor: "#4eb3d3", opacity:0.4},
};
    
    Plotly.newPlot("bar",databar, layoutbar)



    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        text: [],
        hoverinfo: "text",
        mode: 'markers',
        marker: {
          color: [10, 11, 12, 13],
          colorscale: 'Cividis',
          opacity: [1, 0.8, 0.6, 0.4],
          size: [40, 60, 80, 100],
        }
      };
      
      var data3 = [trace1];
      
      var layoutbubble = {
        title: 'Marker Size and Color',
        hovermode: 'closest',
        showlegend: false,
        height: 800,
        width: 1200,
        xaxis: {title: {
          text: 'OTU ID'
        }}
      };
      
      Plotly.newPlot('bubble', data3, layoutbubble);


      var data = [
        // {
        //   domain: { x: [0, 1], y: [0, 1] },
        //   // value: 2,
        //   title: { text: "Speed" },
        //   type: "indicator",
        //   mode: "gauge",
        //   // delta: { reference: 380 },
        //   gauge: {
        //     axis: { range: [null, 9], tickmode: "linear", tick0: 0, dtick: 1 },
        //     steps: [
        //       { range: [0, 1], color: "rgb(100,0,0)" },
        //       { range: [1, 2], color: "rgb(200,100,0)" },
        //       { range: [2, 3], color: "rgb(150,130,0)" },
        //       { range: [3, 4], color: "rgb(150,150,35)" },
        //       { range: [4, 5], color: "rgb(128,128,0)" },
        //       { range: [5, 6], color: "rgb(200,255,100)" },
        //       { range: [6, 7], color: "rgb(50,200,35)" },
        //       { range: [7, 8], color: "rgb(0,150,0)" },
        //       { range: [8, 9], color: "rgb(0,100,0)" },

        //     ],
        //     // threshold: {
        //     //   line: { color: "red", width: 4 },
        //     //   thickness: 0.75,
        //     //   value: 2,

        //     // }
        //   }
        // }
        {
          values: [20, 20, 20, 20, 20, 20,20, 20, 20,180],
          labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3','1-2', '0-1',' ' ],
          textposition: 'inside',
          textinfo: 'label',
          marker: {
            colors: ["rgb(0,69,41)", "rgb(0,104,55)", "rgb(35,132,67)", "rgb(65,171,93)", "rgb(120,198,121)","rgb(173,221,142)","rgb(217,240,163)", "rgb(247,252,185)", "rgb(255,255,229)","rgb(255,255,255)"],
          },
          domain: {row:0, column: 0},
          name: 'Scrubs per Week',
          rotation: 90,
          hoverinfo: 'none',
          hole: .4,
          type: 'pie'

        }




      ];
      
      var layout = { 
        width: 400, 
        height: 400, 
        margin: { t: 0, b: 0 },
        title: {text:'<b>Bellybutton Washing Frequency</b>', x:0.5, xanchor:'center', y:0.98, yanchor:'top'},
        annotations: [{text:'Scrubs per Week', x:0.5, xanchor:'center', y:0.9, yanchor:'top', showarrow: false}],
        showlegend: false,
        shapes: [
          {
            type: 'line',
            // x0: 0.5,
            // y0:0.32,
            // x1: 0.5,
            // y1: 0.6,
            x0: 0.5,
            y0:0.5,
            x1: 0.5,
            y1: 0.7,

            
            line: { color: "firebrick", width: 4 },
          },
          {
            type: 'circle',

            fillcolor: 'firebrick',
            x0: 0.48,
            y0: 0.48,
            x1: 0.52,
            y1: 0.51,
            line: {
              color: 'firebrick'
            }},

    


        ]

      };

      Plotly.newPlot('gauge', data, layout);






d3.json("samples.json").then(data =>{
    console.log(data.samples);



    var subjects = data.names;
    var subjectselect = d3.select("#selDataset");
                
    subjects.forEach(i => {
    var option = subjectselect.append("option");                 
    var optionValue = option.attr("value",i);
    optionValue.text(i);
    });

    d3.selectAll("#selDataset").on("change", filterData);

function filterData() {

  var filterOption = d3.select("#selDataset");
  
  var subject = filterOption.property("value");

  var metadatapanel = d3.select('#sample-metadata');
  metadatapanel.selectAll("p").remove();
  var metadataid = data.metadata.filter(d => d.id === parseInt(subject));
  var washes = metadataid[0].wfreq;
  console.log(washes)

  // var rwash = (washes == 0 | washes == null) ? 3 : (((18*(10-washes))+(washes-5))*(Math.PI/180));

  var rwash = (washes == 0 | washes == null) ? 3 : (202.5+(-22.5*washes))*(Math.PI/180);


  var xwash = 0.2*Math.cos(rwash)+0.5;
  var ywash = 0.2*Math.sin(rwash)+0.5;
  console.log(xwash)

  
  Object.entries(metadataid[0]).forEach(([key,value]) => {
  
  metadatapanel.append("p").text(key + ": " + value);
   
    });


    var e = data.samples.filter(d => d.id === subject);
// e.sort((a,b) => b.sample_values[0] - a.sample_values[0]);
    // console.log(e[0]);
// var x = e[0];

    var sample_values = e.map(d => d.sample_values);



// console.log(sample_values[0]);
// var indexList = sample_values[0].map((item, index, array) => {return {"index": index, "item": item}});
// console.log(indexList)
// var sortList = indexList.sort((a,b) => b.item - a.item);
//  var sortList = indexList.map(b => b.index).slice(0,10).reverse();

// var top10 = e.slice(0,10).reverse();
// var resultlist = []

// var result = {};
// var keys = ['otu_ids',"otu_labels","sample_values"];
var otu_ids = e.map(d => d.otu_ids);
// keys.forEach((i) => result[] = 
var otu_labels = e.map(d => d.otu_labels);

// var sortedValues = sortList.map(i => sample_values[0][sortList[i]])
// var sortedIDs = sortList.map(i => otu_ids[i])
// var sortedLabels = sortList.map(i => otu_labels[i])

var top10values = sample_values[0].slice(0,10);
var top10ids = otu_ids[0].slice(0,10);
var idlb = top10ids.map(d => "otu " + d);
var top10labels = otu_labels[0].slice(0,10);
var labelsplit = top10labels.map(d => (d.split(";")).join("<br>"));
console.log(labelsplit)
var alllabels = otu_labels[0].map(d => (d.split(";")).join("<br>"));




// console.log(top10values)
// console.log(top10ids)
// console.log(top10labels)

var max = top10ids.reduce((a,b) => Math.max(a,b));
var min = top10ids.reduce((a,b) => Math.min(a,b));

Plotly.restyle("bar", 'x', [top10values.reverse()]);
Plotly.restyle('bar','y',[idlb.reverse()]);
Plotly.restyle('bar','text',[labelsplit.reverse()]);
Plotly.restyle("bubble", 'y', [sample_values[0]]);
Plotly.restyle("bubble", 'x', [otu_ids[0]]);
Plotly.restyle('bubble',{'marker.size':[sample_values[0]]});
Plotly.restyle('bubble',{'marker.color':[otu_ids[0]]});
Plotly.restyle('bubble','text',[alllabels]);
Plotly.relayout('gauge',{'shapes[0].x1':xwash,'shapes[0].y1':ywash})
// Plotly.restyle("bubble", 'cmax', [max]);
// Plotly.restyle("bubble", 'cmin', [min]);



// var metadatapanel = d3.select('#sample-metadata');
// var metadataid = data.metadata.filter(d => d.id === parseInt(subject));

// Object.entries(metadataid[0]).forEach(([key,value]) => {

// metadatapanel.append("p").text(key + ": " + value);
 
//   });






// var trace = {
//     x: top10values.reverse(),
//     y: idlb.reverse(),
//     type: "bar",
//     orientation: "h"
//     };
    
//     var data2 = [trace];
    
//     Plotly.newPlot("bar",data2)






}
});








