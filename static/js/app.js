
// Initialise graphs

var databar = [{
    x: [],
    y: [],
    text:[],
    type: "bar",
    orientation: "h",
    hoverinfo:"text",
    }];
    
// var databar = [trace];

var layoutbar = {
  hovermode: 'closest',
  hoverlabel: { bgcolor: "#4eb3d3", opacity:0.4},
  title: 'Top 10 Occuring Microbial Species'
  };
    
Plotly.newPlot("bar",databar, layoutbar)



var databubble = [{
    x: [],
    y: [],
    text: [],
    hoverinfo: "text",
    mode: 'markers',
    marker: {
        color: [],
        colorscale: 'Cividis',
        opacity: 0.8,
        size: [],
        }
    }];
      
     
      
var layoutbubble = {
    title: 'All Microbial Species',
    hovermode: 'closest',
    showlegend: false,
    height: 800,
    width: 1200,
    xaxis: {title: {
        text: 'OTU ID'
        }}
    };
      
Plotly.newPlot('bubble', databubble, layoutbubble);

// Gauge as pie chart for greater control over needle
var datagauge = [
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

        }];
      
      var layoutgauge = { 
        width: 400, 
        height: 400, 
        margin: { t: 0, b: 0, l: 0, r: 0},
        // title: {text:'<b>Bellybutton Washing Frequency</b>', 
        //         x:0.5, xanchor:'center', 
        //         y:0.98, yanchor:'top'
        //         },
        // annotations: [{text:'Scrubs per Week', 
        //               x:0.5, xanchor:'center', 
        //               y:0.9, yanchor:'top', 
        //               showarrow: false}],
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
            y1: 0.52,
            line: {
              color: 'firebrick'
            }},
        ]};

Plotly.newPlot('gauge', datagauge, layoutgauge);


// Get json data

d3.json("samples.json").then(data =>{
    
    // create dropdown list from subjects
    var subjects = data.names;
    var subjectselect = d3.select("#selDataset");
                
    subjects.forEach(i => {
      var option = subjectselect.append("option");                 
      var optionValue = option.attr("value",i);
      optionValue.text(i);
      });

    // default is first subject  
    var subject = "940";

    // call function to update plot for default
    updatePlot(subject);



    // event listener to filter data on selection of new subject from dropdown
    d3.selectAll("#selDataset").on("change", filterData);

    // filter function
    function filterData(){

      // set subject as filter option
      var filterOption = d3.select("#selDataset");
  
      subject = filterOption.property("value");

      // call update plot function
      updatePlot(subject);

    };

// function to update plot with new subject values
    function updatePlot(subject) {

      // get subject metadata
        var metadatapanel = d3.select('#sample-metadata');
        metadatapanel.selectAll("p").remove();
        var metadataid = data.metadata.filter(d => d.id === parseInt(subject));
        
        // get wash frequecy for gauge 
        var washes = metadataid[0].wfreq;
        


        var rwash = (washes == 0 | washes == null) ? 3.1 : ((20*(10-washes)-10)/180)*(Math.PI);
        console.log(Math.cos(Math.PI))

        // get (x,y) for line end 
        var xwash = 0.2*Math.cos(rwash)+0.5;
        var ywash = 0.2*Math.sin(rwash)+0.5;
 

        // update panel with metadata
        Object.entries(metadataid[0]).forEach(([key,value]) => {
          metadatapanel.append("p").text(key + ": " + value);
          });

          // get sample data for subect
        var e = data.samples.filter(d => d.id === subject);
 
        // map sample values
        var sample_values = e.map(d => d.sample_values);

        // map otu ids
        var otu_ids = e.map(d => d.otu_ids);

        // map otu lables 
        var otu_labels = e.map(d => d.otu_labels);

      // var sortedValues = sortList.map(i => sample_values[0][sortList[i]])
      // var sortedIDs = sortList.map(i => otu_ids[i])
      // var sortedLabels = sortList.map(i => otu_labels[i])
      
      // slice to get top 10 values for bar chart
      var top10values = sample_values[0].slice(0,10);
      var top10ids = otu_ids[0].slice(0,10);
      var idlb = top10ids.map(d => "otu " + d);
      var top10labels = otu_labels[0].slice(0,10);

      // make lables appear with line breaks so easier to read
      var labelsplit = top10labels.map(d => (d.split(";")).join("<br>"));
      
      // get all labels for bubble chart
      var alllabels = otu_labels[0].map(d => (d.split(";")).join("<br>"));



      // restyle all plots
      Plotly.restyle("bar", 'x', [top10values.reverse()]);
      Plotly.restyle('bar','y',[idlb.reverse()]);
      Plotly.restyle('bar','text',[labelsplit.reverse()]);
      Plotly.restyle("bubble", 'y', [sample_values[0]]);
      Plotly.restyle("bubble", 'x', [otu_ids[0]]);
      Plotly.restyle('bubble',{'marker.size':[sample_values[0]]});
      Plotly.restyle('bubble',{'marker.color':[otu_ids[0]]});
      Plotly.restyle('bubble','text',[alllabels]);
      Plotly.relayout('gauge',{'shapes[0].x1':xwash,'shapes[0].y1':ywash})


}
});








