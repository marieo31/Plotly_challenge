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


  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  console.log("buildCharts")
  console.log(sample)

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = "/samples/"+sample
  console.log(url)
  d3.json(url).then(function(response){
    // @TODO: Build a Bubble Chart using the sample data
      console.log(response)
      trace = {x: response.otu_ids,
              y: response.sample_values,
              mode: "markers"
      }
      var data = [trace];

      var layout = {title: "Belly button bubble plot"
      }

      Plotly.newPlot("bubble",data, layout )
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).      


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
