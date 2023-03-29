// JS File for Amazon Deforestation Project
// Luke Abbatessa, Jenny Cai, Jocelyn Ju, Varun McIntyre
// Last Modified: 03.20.2023


// Instantiate visualization dimensions/limitations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Insert tick marks onto slider
let ticks = document.getElementById("ticks");
for (let i = 2000; i < 2022; i++) {
	ticks.innerHTML += '<option value="' + i + '" label="' + i + '" ></option>';
}

// Updates year selected for the slider
const value = document.querySelector("#year")
const input = document.querySelector("#slider")
value.textContent = input.value
input.addEventListener("input", (event) => {
	value.textContent = event.target.value
})


// Append the bars to the FRAME1 element
const FRAME1 = d3.select("#vis-enc-1").append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// Read in the data
d3.csv("avg_def_data.csv").then((data) => {

	// Print the data
	console.log(data)

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
					   .attr("class", "tooltip");
					   // .style("opacity", 0)
					   // .style("background-color", "lightgrey")
					   // .style("border", "solid")
					   // .style("border-width", "2px")
					   // .style("border-radius", "7px")
					   // .style("padding", "3px")
					   // .style("position", "absolute");

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
       TOOLTIP.style("opacity", 1);
       // Position the tooltip and fill in information 
       TOOLTIP.html("Category: " + d.Year_Range + "<br>Value: " + d3.format(".3f")(d.Average_Proportion_Area_Deforested))
               .style("left", event.x + "px")
               .style("top", (event.y + 600) + "px"); // Place the tooltip
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
        // .style("fill", "rosybrown")
        // .style("stroke", "saddlebrown")
        // .style("stroke-width", "3px")
       .on("mouseover", handleMouseover) // Add event listeners
       .on("mousemove", handleMousemove)
       .on("mouseleave", handleMouseleave);

    // Create the x-axis
	FRAME1.append("g")
	    .attr("transform", "translate(" + MARGINS.left + 
		   "," + (VIS_HEIGHT + MARGINS.bottom) + ")")
	    .call(d3.axisBottom(xSCALE))
	    .selectAll("text")
		  // .attr("font-size", "10px")
	    .attr("class", "axis-text");

    // Provide a label for the x-axis
    FRAME1.append("text")
        .attr("x", 245)
        .attr("y", 490)
        // .attr("text-anchor", "middle")
        .attr("class", "xlab")
        .text("Years");

	// Create the y-axis
	FRAME1.append("g")
	    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
	    .call(d3.axisLeft(ySCALE_REV))
	    .selectAll("text")
		  // .attr("font-size", "10px")
	    .attr("class", "axis-text");

    // Provide a label for the y-axis
    FRAME1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -260)
        .attr("y", 12)
        // .attr("text-anchor", "middle")
        .attr("class", "xlab")
        .text("Proportion of Area Deforested");

    // Provide a title for the graph
	FRAME1.append("text")
        .attr("x", 255)
        .attr("y", 20)
        // .attr("text-anchor", "middle")
        // .style("font-size", "22px")
        .attr("class", "title")
        .text("Deforestation in the Amazon");

});

d3.csv("def_data.csv").then((data) => {

	// Print the data
	console.log(data)

	// Create the scales for the scatter plot
	const ySCALE_REV = d3.scaleLinear() 
	    .domain([0, d3.max(data, (d) => { return d.Proportion_Area_Deforested; })])  
	    .range([VIS_HEIGHT, 0]);

	const xSCALE = d3.scaleLinear()
	    .domain([d3.min(data, function(d) { return d.Year; }), d3.max(data, function(d) { return d.Year; })])
	    .range([0, VIS_WIDTH]);

	// Create a tooltip for the points on the line
    const TOOLTIP = d3.select("#vis-enc-1")
                       .append("div")
					   .attr("class", "tooltip");

    let myPoints = FRAME1.append("g")
  		.selectAll("points")  
	      .data(data) // Passed from .then  
	      .enter()       
	      .append("circle")
	      	 .attr("cx", (d) => { return (xSCALE(d.Year) + MARGINS.left); }) 
	         .attr("cy", (d) => { return (ySCALE_REV(d.Proportion_Area_Deforested) + MARGINS.top); }) 
	         .attr("r", 2)
	         .attr("class", "point")
	      .on("mouseover", handleMouseover) // Add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);;
	         // .attr("class", (d) => {d.x})
	         // .attr("fill", "black");

	// Define event handler functions for tooltips
    function handleMouseover(event, d) {
      
       // Make opaque on mouseover
       TOOLTIP.style("opacity", 1);

       // Highlight the bar (and outline for accessibility) on mouseover
       d3.select(this).style("fill", "lightseagreen")
      				  .style("stroke", "lightseagreen")
      				  .style("stroke-width", "5px");
    }

    function handleMousemove(event, d) {
       TOOLTIP.style("opacity", 1);
       // Position the tooltip and fill in information 
       TOOLTIP.html("Year: " + d.Year + "<br>Proportion Area Deforested: " + d3.format(".3f")(d.Proportion_Area_Deforested))
               .style("left", event.x + "px")
               .style("top", (event.y + 600) + "px"); // Place the tooltip
    }

    function handleMouseleave(event, d) {
      
       // Make transparent on mouseleave
   	   // return column fill and stroke to original
       TOOLTIP.style("opacity", 0);

       d3.select(this).style("fill", "black")
       				  .style("stroke", "black")
       				  .style("stroke-width", "5px"); 
    }

	let myLine = d3.line()
        .x(function(d) { return xSCALE(d.Year) - MARGINS.left; }) 
        .y(function(d) { return ySCALE_REV(d.Proportion_Area_Deforested) - MARGINS.top; }) 
        .curve(d3.curveMonotoneX)
        
        FRAME1.append("path")
        .datum(data) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", myLine)
        .attr("class", "line");
        // .style("fill", "none")
        // .style("stroke", "#CC0000")
        // .style("stroke-width", "2");


    // Add a slider
    const value = document.querySelector("#year")
	const input = document.querySelector("#slider")
	value.textContent = input.value
	input.addEventListener("input", (event) => {
  		value.textContent = event.target.value
	})

	
})

// // Updates the chart when slider is moved?
// function yearSelectedData(year) {
// 	d3.selectAll("points")
// 	  .filter(function(d) {
// 	  	console.log("hi2");
// 	  		return d3.select(this).attr("class") == year;
//   	  })
//   	  .attr("class", function (d) {
//   	  					if(d.x == year){
//   	  						return "selected"
// 						} else {
// 				  			return (d) => {d.x}
// 						}
// 	  })
// };

// // Listens to slider and calls function above
// d3.select("#slider").on("change", function(d){
//     selectedValue = this.value
//     yearSelectedData(selectedValue);
// })

const FRAME2 = d3.select("#vis-enc-2").append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

d3.csv("all_scatter_points.csv").then((data) => {

	// Print the data
	console.log(data)

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
			 .attr("r", 8)
	         .attr("class", "point")
			 .attr("fill", function (d) {
				if(d.x < 8 || (d.x == 8 && d.y < 17)){
				  return "green"
				} else {
				  return "white"
				}})
			 .attr("stroke", function (d) {
				if(d.x < 8 || (d.x == 8 && d.y < 17)){
					return "darkgreen"
				} else {
					return "brown"
				}})
			 .attr("stroke-width", 2);

	// add border around vis 2
	let border = FRAME2.select("g")
					.append("rect")
  					.attr("height", FRAME_HEIGHT)
  					.attr("width", FRAME_WIDTH)
  					.attr("class", "border");
  					// .style("stroke", "black")
  					// .style("stroke-width", 10)
  					// .style("fill", "none");

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

// Read in the .csv file for Visual Encoding 3
d3.csv("all_pie_slices.csv").then(function(data) {

	// Instantiate a radius for the pie chart
	const radius = Math.min(FRAME_WIDTH, FRAME_HEIGHT) / 2 - 50;

	// Instantiate a frame object for the viz
	const FRAME3 = d3.select("#vis-enc-3")
	  .append("svg")
	    .attr("width", FRAME_WIDTH)
	    .attr("height", FRAME_HEIGHT)
	  .append("g")
	    .attr("transform", `translate(${FRAME_WIDTH/2}, ${FRAME_HEIGHT/2})`);

	// Represent the viz data as a dictionary
	const pieData = {};
	data.forEach(function(d) {
		pieData[d.Area_Status] = d.Deforested_Forested_Percentages_2000;
	});

	// Create a colorway for the pie chart
	const color = d3.scaleOrdinal()
	  .range(["#ffed00", "#008026"])

	// Create the actual pie chart
	const pie = d3.pie()
	  .value(function(d) {return d[1]})
	const data_ready = pie(Object.entries(pieData))

	// Generate the arcs for the slices
	const arcGenerator = d3.arc()
	  .innerRadius(0)
	  .outerRadius(radius)

	// Add the slices to the chart
	FRAME3.selectAll('mySlices')
	      .data(data_ready)
	      .join('path')
	      .attr('d', arcGenerator)
	      .attr('fill', function(d){ return(color(d.data[0])) })
	      // .attr("stroke", "black")
	      // .style("stroke-width", "2px")
	      // .style("opacity", 0.7)
	      .attr("class", "slices");

	// Add a title to the chart
	FRAME3.append("text")
	      .attr("y", -220)
	      // .attr("text-anchor", "middle")
	      // .attr("font-size", "22px")
	      .attr("class", "title")
	      .text("% Deforestation of Amazon in Year 2000");

	// Add percentage labels to the slices
	FRAME3.selectAll('mySlices')
	      .data(data_ready)
	      .join('text')
	      .text(function(d){ return Math.round(d.data[1]) + "%"})
	      .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
	      // .style("text-anchor", "middle")
	      // .style("font-size", 17)
	      .attr("class", "slice-labs")

	// Create a data list for the legend
	const columnData = data.map(function(d) {
		return d.Area_Status;
	});
	
	// Instantiate a colorway for the legend
	const legendColor = d3.scaleOrdinal()
	  .domain(columnData)
	  .range(["#ffed00", "#008026"]);

	// Add the squares to the legend
	const size = 20
	FRAME3.selectAll("mydots")
	      .data(columnData)
	      .enter()
	      .append("rect")
	        .attr("x", 160)
	        .attr("y", function(d,i){ return 150 + i*(size+5)})
	        .attr("width", size)
	        .attr("height", size)
	        .style("fill", function(d){ return legendColor(d)})

	// Add labels to the squares
	FRAME3.selectAll("mylabels")
	      .data(columnData)
	      .enter()
	      .append("text")
	        .attr("x", 160 + size*1.2)
	        .attr("y", function(d,i){ return 150 + i*(size+5) + (size/2)})
	        .style("fill", "black")
	        .text(function(d){ return d})
	        // .attr("text-anchor", "left")
	        .style("alignment-baseline", "middle")
	        // .style("font-size", 11)
	        .attr("class", "sq-labs")
});


