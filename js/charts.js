//Deliverable 1

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);//just to inspect data 
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1 D1. Create the buildCharts function.
function buildCharts(sample) {
  // 2 D1. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3 D1. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4 D1. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = samples.filter(sampleData=>sampleData.id == sample);

    // 1 D3. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var desiredMeta = metadata.filter(sampleId=>sampleId.id == sample); 

    //  5 D1. Create a variable that holds the first sample in the array.
    var resultSample = desiredSample[0];

    // 2 D3. Create a variable that holds the first sample in the metadata array.
    var resultMeta = desiredMeta[0];
    console.log(resultMeta);

    // 6 D1. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = resultSample.otu_ids;
    var labels = resultSample.otu_labels;
    var values = resultSample.sample_values;

    // 3 D3. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(resultMeta.wfreq);
    
    // 7 D1. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var xvalues = values.slice(0,10).map(val => val).reverse();
    var text = labels.slice(0,10).map(txt=>txt).reverse();

    // 8 D1. Create the trace for the bar chart. 
    
    var barData = [{
      x: xvalues,
      y: yticks,
      text: text,
      type : "bar",
      orientation :'h'
    }];
    // 9 D1. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title:"Sample Values"},
      yaxis: {title:"Bacteria IDs"}, 
      width: 400,
      height:450,
      margin: {
        l: 120,
        r: 70,
        b: 100,
        t: 100,
      },
     
    };
    // 10 D1. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    //Deliverable 2
    // 1 D2. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode : "markers",
      marker: {
        color:ids,
        size:values
      }
    }];

    // 2 D2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis : {title:" Sample Values"},
      margin: { 
        l:50,
        r: 40,
        t: 100,
        b: 100
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    //Deliverable 3 Plot code

    // 4 D3. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text:"Belly Button Washing Frequency"},
      gauge:{
        axis : {range: [null,10]},
        bar: {color:"darkslateblue"},
        steps:[
          {range: [0,2],color :"lightcoral"},
          {range: [2,4],color: "palevioletred"},
          {range: [4,6],color:"plum"},
          {range: [6,8],color:"orchid"},
          {range: [8,10],color:"mediumorchid"}
        ],
      }    
    }];
  
    // 5 D3. Create the layout for the gauge chart.
    var gaugeLayout = { 
      
      margin: { t: 20, r: 15, l: 15, b: 20 }
    };

    // 6 D3. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
    
  });
}




