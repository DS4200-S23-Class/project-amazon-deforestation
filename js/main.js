// JS File for Amazon Deforestation Project
// Luke Abbatessa, Jenny Cai, Jocelyn Ju, Varun McIntyre
<<<<<<< HEAD
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
=======
// Last Modified: 03.19.2023

// Instantiate visualization dimensions/limitations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Read in the data
d3.csv("avg_def_data.csv").then((data) => {

	// Create the scales and bin range for the histogram
	const ySCALE_REV = d3.scaleLinear() 
	    .domain([0, d3.max(data, (d) => { return d.Average_Proportion_Area_Deforested; })])  
	    .range([VIS_HEIGHT, 0]);

	const xSCALE = d3.scaleLinear()
	    .domain([d3.min(data, function(d) { return d.Range_Minimums; }), d3.max(data, function(d) { return d.Range_Maximums; })])
	    .range([0, VIS_WIDTH]);

	// const histogram = d3.histogram()
	//     .value(function(d) { return d.Midyear; })
	//     .domain(xSCALE.domain())
	//     .thresholds(xSCALE.ticks(7));

	// const BINS = histogram(data);

	// Append the bars to the FRAME1 element
	const FRAME1 = d3.select("#vis-enc-1").append("svg")
        .attr("height", FRAME_HEIGHT)
        .attr("width", FRAME_WIDTH)
        .attr("class", "frame");

    FRAME1.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xSCALE(d.Range_Minimums) + MARGINS.left; })
        .attr("y", function(d) { return VIS_HEIGHT - ySCALE_REV(d.Average_Proportion_Area_Deforested) + MARGINS.top; })
        .attr("width", function(d) { return xSCALE(d.Range_Maximums) - xSCALE(d.Range_Minimums) + 1; })
        .attr("height", function(d) { return ySCALE_REV(d.Average_Proportion_Area_Deforested); })
        .style("fill", "rosybrown")
        .style("stroke", "saddlebrown");

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
	    .selectAll("text")
		  .attr("font-size", "10px");
>>>>>>> 5cb5d8b9b45aa2b1032f4462e07ef7344b2de0f3

});

d3.csv("def_data.csv").then((data) => {

	// Create the scales for the scatter plot
	const ySCALE_REV = d3.scaleLinear() 
	    .domain([0, d3.max(data, (d) => { return d.Proportion_Area_Deforested; })])  
	    .range([VIS_HEIGHT, 0]);

	const xSCALE = d3.scaleLinear()
	    .domain([d3.min(data, function(d) { return d.Year; }), d3.max(data, function(d) { return d.Year; })])
	    .range([0, VIS_WIDTH]);

	// Append the points to the FRAME1 element
	const FRAME1 = d3.select("#vis-enc-1").append("svg")
        .attr("height", FRAME_HEIGHT)
        .attr("width", FRAME_WIDTH)
        .attr("class", "frame");

    let myPoints = FRAME1.append("g")
  		.selectAll("points")  
	      .data(data) // Passed from .then  
	      .enter()       
	      .append("circle")
	      	 .attr("cx", (d) => { return (xSCALE(d.Year) + MARGINS.left); }) 
	         .attr("cy", (d) => { return (ySCALE_REV(d.Proportion_Area_Deforested) + MARGINS.top); }) 
	         .attr("r", 2)
	         .attr("class", "point");


	let myLine = d3.line()
        .x(function(d) { return xSCALE(d.Year) - MARGINS.left; }) 
        .y(function(d) { return ySCALE_REV(d.Proportion_Area_Deforested) - MARGINS.top; }) 
        .curve(d3.curveMonotoneX)
        
        FRAME1.append("path")
        .datum(data) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", myLine)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
}

	)


// create a function that will show and hide the text for motivation
// and data on click of the button
function showMotivation() {
	let x = document.getElementById('motivation');
	let button = document.getElementById("button")

	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}

}

document.getElementById("button").addEventListener("click", showMotivation)


function showData() {
	let x = document.getElementById("data");
	let button = document.getElementById("data-button")

	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

document.getElementById("button-div").addEventListener("click", showData)

