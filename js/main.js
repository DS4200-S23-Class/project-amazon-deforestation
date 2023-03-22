// JS File for Amazon Deforestation Project
// Luke Abbatessa, Jenny Cai, Jocelyn Ju, Varun McIntyre
// Last Modified: 03.20.2023


// Insert tick marks onto slider
let ticks = document.getElementById("ticks");
for (let i = 2000; i < 2022; i++) {
	ticks.innerHTML += '<option value="' + i + '" label="' + i + '" ></option>';
}

// Instantiate visualization dimensions/limitations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Append the bars to the FRAME1 element
const FRAME1 = d3.select("#vis-enc-1").append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// Read in the data
d3.csv("avg_def_data.csv").then((data) => {

	// Create the scales and bin range for the histogram
	const ySCALE_REV = d3.scaleLinear() 
	    .domain([0, d3.max(data, (d) => { return d.Average_Proportion_Area_Deforested; })])  
	    .range([VIS_HEIGHT, 0]);

	const xSCALE = d3.scaleLinear()
	    .domain([d3.min(data, function(d) { return d.Range_Minimums; }), d3.max(data, function(d) { return d.Range_Maximums; })])
	    .range([0, VIS_WIDTH]);

	// Create a tooltip for the barplot
    const TOOLTIP = d3.select("#vis-enc-1")
                       .append("div")
					   .attr("class", "tooltip")
					   .style("opacity", 0)
					   .style("background-color", "lightgrey")
					   .style("border", "solid")
					   .style("border-width", "2px")
					   .style("border-radius", "7px")
					   .style("padding", "70px")
					   .style("position", "absolute");

	// Define event handler functions for tooltips
    function handleMouseover(event, d) {
      
       // Make opaque on mouseover
       TOOLTIP.style("opacity", 1);

       // Highlight the bar (and outline for accessibility) on mouseover
       d3.select(this).style("fill", "lightseagreen")
      				  .style("stroke", "black")
      				  .style("stroke-width", "3px");
    }

    function handleMousemove(event, d) {
      
       // Position the tooltip and fill in information 
       TOOLTIP.html("Category: " + d.Year_Range + "<br>Value: " + d3.round(d.Average_Proportion_Area_Deforested, 3))
               .style("left", event.x + "px")
               .style("top", event.y + "px"); // Place the tooltip
    }

    function handleMouseleave(event, d) {
      
       // Make transparent on mouseleave
   	   // return column fill and stroke to original
       TOOLTIP.style("opacity", 0);
       d3.select(this).style("fill", "rosybrown")
      				  .style("stroke", "saddlebrown"); 
    }

    // Create the bars and add event listeners
    FRAME1.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return xSCALE(d.Range_Minimums) + MARGINS.left; })
        .attr("y", function(d) { return ySCALE_REV(d.Average_Proportion_Area_Deforested) + MARGINS.top; })
        .attr("width", function(d) { return xSCALE(d.Range_Maximums) - xSCALE(d.Range_Minimums); })
        .attr("height", function(d) { return VIS_HEIGHT - ySCALE_REV(d.Average_Proportion_Area_Deforested); })
        .attr("class", "bar")
        .style("fill", "rosybrown")
        .style("stroke", "saddlebrown")
       .on("mouseover", handleMouseover) // Add event listeners
       .on("mousemove", handleMousemove)
       .on("mouseleave", handleMouseleave);

    // Create the x-axis
	FRAME1.append("g")
	    .attr("transform", "translate(" + MARGINS.left + 
		   "," + (VIS_HEIGHT + MARGINS.bottom) + ")")
	    .call(d3.axisBottom(xSCALE))
	    .selectAll("text")
		  .attr("font-size", "10px");

    // Provide a label for the x-axis
    FRAME1.append("text")
        .attr("x", 245)
        .attr("y", 490)
        .attr("text-anchor", "middle")
        .text("Years");

	// Create the y-axis
	FRAME1.append("g")
	    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
	    .call(d3.axisLeft(ySCALE_REV))
	    .selectAll("text")
		  .attr("font-size", "10px");

    // Provide a label for the y-axis
    FRAME1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -260)
        .attr("y", 12)
        .attr("text-anchor", "middle")
        .text("Proportion of Area Deforested");

    // Provide a title for the graph
	FRAME1.append("text")
        .attr("x", 255)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("Deforestation in the Amazon");

});

d3.csv("def_data.csv").then((data) => {

	// Create the scales for the scatter plot
	const ySCALE_REV = d3.scaleLinear() 
	    .domain([0, d3.max(data, (d) => { return d.Proportion_Area_Deforested; })])  
	    .range([VIS_HEIGHT, 0]);

	const xSCALE = d3.scaleLinear()
	    .domain([d3.min(data, function(d) { return d.Year; }), d3.max(data, function(d) { return d.Year; })])
	    .range([0, VIS_WIDTH]);

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

    const value = document.querySelector("#year")
	const input = document.querySelector("#slider")
	value.textContent = input.value
	input.addEventListener("input", (event) => {
  		value.textContent = event.target.value
	})

	
})

const FRAME2 = d3.select("#vis-enc-2").append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

d3.csv("all_scatter_points.csv").then((data) => {

	const MAX_X_LENGTH = d3.max(data, (d) => { return parseInt(d.x); });
  	const MAX_Y_LENGTH = d3.max(data, (d) => { return parseInt(d.y); });

	// Create the scales for scatter plot
	const ySCALE = d3.scaleLinear() 
	    .domain([0, MAX_Y_LENGTH])
	    .range([VIS_HEIGHT, 0]);

	const xSCALE = d3.scaleLinear()
	    .domain([0, MAX_X_LENGTH])
	    .range([0, VIS_WIDTH]);
	
    let myPoints = FRAME2.append("g")
  		.selectAll("points")  
	      .data(data) // Passed from .then  
	      .enter()       
	      .append("circle")
	      	 .attr("cx", (d) => { return (xSCALE(d.x) + MARGINS.left); })
	         .attr("cy", (d) => { return (ySCALE(d.y) + MARGINS.top); })
	         .attr("r", 10)
	         .attr("class", "point")
			 .style("fill", "green");
	
	const value = document.querySelector("#year")
	const input = document.querySelector("#slider")
	value.textContent = input.value
	input.addEventListener("input", (event) => {
		value.textContent = event.target.value
	})
})


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

