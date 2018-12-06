function buildMetadata(sample) {
  console.log("buildMetadata")
  console.log(sample)

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let url = "/metadata/"+sample
  // console.log(url)
  d3.json(url).then(function(response){
    // console.log(response)
    // var data = response

    // Use d3 to select the panel with id of `#sample-metadata`
    let pbody = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    pbody.html("")    

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.      
    Object.entries(response).forEach(([key,value]) => {
      pbody.append("p").text(key+": "+value)
    })    

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    console.log(response.WFREQ)    

      // Enter a speed between 0 and 180
      // var level = response.WFREQ;
      // Enter a speed between 0 and 180
      var level = 3; //response.WFREQ;

      var nb_div = 10;
      var val_max = 9;

      // Trig to calc meter point
      var degrees = 180*(1 - 1/nb_div*(0.5 + level)), // 180 - level*180*/nb_div + 10),
          radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      console.log(degrees)
      console.log(x)
      console.log(y)

      // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);


      console.log(Array(nb_div).fill(50/nb_div).concat(50))
      var data = [
        { type: 'scatter',
        x: [0], y:[0],
          marker: {size: 28, color:'850000'},
          showlegend: false,
          name: 'WashFreq',
          text: level,
          hoverinfo: 'text+name'},
        { values: Array(nb_div).fill(50/nb_div).concat(50),
        rotation: 90,
        text: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(14, 127, 0, .5)', 
                         'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 
                         'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 
                         'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)'
                        ]},
        labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];

      var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        title: 'Gauge Speed 0-100',
        // height: 1000,
        // width: 1000,
        xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
      };

      Plotly.newPlot('gauge', data, layout);


  })


}

function buildCharts(sample) {
  console.log("buildCharts")
  // console.log(sample)

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = "/samples/"+sample
  console.log(url)
  d3.json(url).then(function(response){
    // console.log(response)

    // @TODO: Build a Bubble Chart using the sample data      
      trace = {x: response.otu_ids,
              y: response.sample_values,
              mode: "markers",
              name: response.otu_labels,
              text: response.otu_labels,
              marker: {
                size: response.sample_values,
                color: response.otu_ids,
              }              
      }
      var data = [trace];

      var layout = {
        title: "Belly button bubble plot",
        showlegend: false,
      }

      Plotly.newPlot("bubble", data, layout )
    


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).    

      // Let's zip the lists all together
      var zip_data = response.otu_ids.map(function(e,i){
          return [e, response.sample_values[i], response.otu_labels[i]]
      })
      // console.log(zip_data)

      // lets sort
      var sorted = zip_data.sort(function(a,b){
        return b[1] - a[1]
      })
      // console.log(sorted)

      // unzipping and slicing the 10 first elements
      var data_sorted = {
        "otu_ids": sorted.slice(0,10).map(e => e[0]),
        "sample_values": sorted.slice(0,10).map(e => e[1]),
        "otu_labels": sorted.slice(0,10).map(e => e[2])
      }
      // console.log(data_sorted)

      var data_pie = [{
        values: data_sorted.sample_values,
        // name: data_sorted.otu_labels,
        // text: data_sorted.otu_labels,  
        hovertext:  data_sorted.otu_labels,       
        labels: data_sorted.otu_ids,  
        type: 'pie'
      }];
      
      var layout_pie = {
        showlegend: true,
        legend: {
          x: 1,
          y: 0.5
        }
      };
      
      Plotly.newPlot('pie', data_pie, layout_pie);      


  })



}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


    //   var data = []
    //   for (var i = 0; i < response.otu_ids.length; i++) { 
        
    //     data.push({
    //       x: [response.otu_ids[i]],
    //       y: [response.sample_values[i] ],
    //       mode: "markers",
    //       name: response.otu_labels[i],
    //       marker: {
    //         size: [response.sample_values[i]],
    //         color: [response.otu_ids[i]],
    //       }
    //     })      
    //   }
    // console.log(data)