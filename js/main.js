// JS File for Amazon Deforestation Project
// Luke Abbatessa, Jenny Cai, Jocelyn Ju, Varun McIntyre
// Last Modified: 03.19.2023

// Instantiate visualization dimensions/limitations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Create a frame for Visual Encoding 1
const FRAME1 = d3.select("#vis-enc-1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

// Read in the data
d3.csv("avg_def_data.csv").then((data) => {

	// Initialize the maximum y value
	const MAXy = d3.max(data, (d) => { return parseInt(d.Average_Proportion_Area_Deforested); });

	// Create the y scale
	const ySCALE_REV = d3.scaleLinear()
	                   .domain([0, MAXy])
	                   .range([VIS_HEIGHT, 0]);

	// Create the x scale
	const xSCALE = d3.scaleLinear()
	               .range([ 0, VIS_WIDTH ])
	               .domain([2000, 2021]);

	// Create the x-axis
	FRAME1.append("g")
	   .attr("transform", "translate(" + MARGINS.left +
	   	"," + (VIS_HEIGHT + MARGINS.bottom) + ")")
	   .call(d3.axisBottom(xSCALE))
	   .selectAll("text")
	     .attr("font-size", "10px");

	// Create the y-axis
	FRAME1.append("g")
	   .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
	   .call(d3.axisLeft(ySCALE_REV))
	   .selectALL("text")
	     .attr("font-size", "10px");

	// Create the bars
	FRAME1.selectAll("bar")
	.data(data)
	.enter()
	.append("rect")
	  .attr("x", function(d) { return xSCALE(d.Midyear) + MARGINS.left; })
	  .attr("y", function(d) { return ySCALE_REV(d.Average_Proportion_Area_Deforested) + MARGINS.top; })
	  .attr("height", function(d) { return VIS_HEIGHT - ySCALE(d.Average_Proportion_Area_Deforested); })
	  .attr("class", "bar");

});