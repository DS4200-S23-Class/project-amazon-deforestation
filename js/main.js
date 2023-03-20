// JS File for Amazon Deforestation Project
// Luke Abbatessa, Jenny Cai, Jocelyn Ju, Varun McIntyre
// Last Modified: 03.20.2023

// Set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#vis-enc-1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
      	  `translate(${margin.left},${margin.top})`);

// Get the data
d3.csv("avg_def_data.csv").then( function(data) {

	// X axis: scale and draw:
	const x = d3.scaleLinear()
	    .domain([2000, 2021])
	    .range([0, width]);
	svg.append("g")
	    .attr("transform", `translate(0, ${height})`)
	    .call(d3.axisBottom(x));

	// Set the parameters for the histogram
	const histogram = d3.histogram()
	    .value(function(d) { return d.Average_Proportion_Area_Deforested; })
	    .domain(x.domain())
	    .thresholds(x.ticks(7));

	// And apply this function to data to get the bins
	const bins = histogram(data);

	// Y axis: scale and draw:
	const y = d3.scaleLinear()
	    .range([height, 0]);
	    y.domain([0, d3.max(bins, function(d) { return d.length; })]);
	svg.append("g")
	    .call(d3.axisLeft(y));

	// Append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .join("rect")
          .attr("x", 1)
      .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")

});