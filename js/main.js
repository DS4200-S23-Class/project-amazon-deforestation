// JS File for Amazon Deforestation Project
// Luke Abbatessa, Jenny Cai, Jocelyn Ju, Varun McIntyre
// Last Modified: 04.05.2023


// Instantiate visualization dimensions/limitations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;



/* =====================  VISUALIZATION 1: BAR CHART  ===========================*/

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
					   .attr("class", "pt-tooltip");

	// // Define event handler functions for tooltips
    function handleMouseover(event, d) {
        d3.select(this).classed("highlight-slice", true);

    //    // Make opaque on mouseover
    //    // TOOLTIP.style("opacity", 1);

    //    // Highlight the bar (and outline for accessibility) on mouseover
    //    d3.select(this).attr("class", "highlight")
    }

    function handleMouseclick(event, d) {
    	TOOLTIP.style("opacity", 1);

    	// d3.select(this).attr("stroke", "lime");

		console.log(d3.select(this) + "clicked");

       	TOOLTIP.html("Year Range: <br>" + d.Year_Range + "<br>Average Proportion Area Deforested: <br>" + d3.format(".3f")(d.Average_Proportion_Area_Deforested))
       			.style("left", MARGINS.left*2 + "px")
       			.style("top", "400px")

       	d3.selectAll(".bar").classed("selected", false)

       	if (d3.select(this).classed("selected")) {
       		d3.select(this).classed("selected", false)
       	}
       	else {
       		d3.select(this).classed("selected", true)
       	}


	}

    function handleMouseleave(event, d) {
    	d3.select(this).classed("highlight-slice", false);

      
    //    // Make transparent on mouseleave
   	//    // return column fill and stroke to original
    //    d3.select(this).style("fill", "rosybrown")
    //   				  .style("stroke", "saddlebrown"); 
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
        .attr("id", function(d) { return "vis1-"+ (d.Range_Minimums);})
        .attr("class", "bar")
        .on("mouseover", handleMouseover) // Add event listeners
       // .on("mousemove", handleMousemove)
       .on("mouseleave", handleMouseleave)
       .on("click", handleMouseclick);

    // Create the x-axis
	FRAME1.append("g")
	    .attr("transform", "translate(" + MARGINS.left + 
		   "," + (VIS_HEIGHT + MARGINS.bottom) + ")")
	    .call(d3.axisBottom(xSCALE))
	    .selectAll("text")
	    .attr("class", "axis-text");

    // Provide a label for the x-axis
    FRAME1.append("text")
        .attr("x", 245)
        .attr("y", 490)
        .attr("class", "xlab")
        .text("Years");

	// Create the y-axis
	FRAME1.append("g")
	    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
	    .call(d3.axisLeft(ySCALE_REV))
	    .selectAll("text")
	    .attr("class", "axis-text");

    // Provide a label for the y-axis
    FRAME1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -260)
        .attr("y", 12)
        .attr("class", "xlab")
        .text("Proportion of Area Deforested");

    // Provide a title for the graph
	FRAME1.append("text")
        .attr("x", 255)
        .attr("y", 20)
        .attr("class", "title")
        .text("Deforestation in the Amazon");

});


// /* =====================  VISUALIZATION 3: PIE CHART  ===========================*/


// // Read in the .csv file for Visual Encoding 3
// d3.csv("all_pie_slices.csv").then(function(piedata) {

// 	// Instantiate a radius for the pie chart
// 	const radius = Math.min(FRAME_WIDTH, FRAME_HEIGHT) / 2 - 50;

// 	// Instantiate a frame object for the viz
// 	const FRAME3 = d3.select("#vis-enc-3")
// 	  .append("svg")
// 	    .attr("width", FRAME_WIDTH)
// 	    .attr("height", FRAME_HEIGHT)
// 	  .append("g")
// 	    .attr("transform", `translate(${FRAME_WIDTH/2}, ${FRAME_HEIGHT/2})`);

// 	// Represent the viz data as a dictionary
// 	let pieData = {};
// 	piedata.forEach(function(d) {
// 	    pieData[d.Area_Status] = d.Deforested_Forested_Percentages_2000;
// 	});

// 	// Create a colorway for the pie chart
// 	const color = d3.scaleOrdinal()
// 	  .range(["#ffed00", "#008026"])

// 	// Create the actual pie chart
// 	let pie = d3.pie()
// 	  .value(function(d) {return d[1]})
// 	let data_ready = pie(Object.entries(pieData))

// 	console.log(data_ready)

// 	// Generate the arcs for the slices
// 	const arcGenerator = d3.arc()
// 	  .innerRadius(0)
// 	  .outerRadius(radius)

// 	// Add the slices to the chart
// 	let slices = FRAME3.selectAll('mySlices')
// 	                   .data(data_ready)
// 	                   .join('path')
// 	                   .attr('d', arcGenerator)
// 	                   .attr('fill', function(d){ return(color(d.data[0])) })
// 	                   .attr("class", "slices")
// 			           .on("mouseover", handleMouseover)
// 			           .on("mousemove", handleMousemove)
// 			           .on("mouseleave", handleMouseleave);

// 	function updatePieChart(year) {
// 		let pieData = {};
// 		piedata.forEach(function(d) {
// 			pieData[d.Area_Status] = d['Deforested_Forested_Percentages_' + year];
// 	    });

// 		let pie = d3.pie()
// 	  	  .value(function(d) {return d[1]})
// 		let data_ready = pie(Object.entries(pieData))

// 		let slices = FRAME3.selectAll('.slices')
// 		  .data(data_ready);
		
// 		slices.attr("d", arcGenerator); 

// 		// Update percentage labels for the slices
// 		FRAME3.selectAll('.slice-labs')
// 		  .data(data_ready)
// 		  .text(function(d){ return Number(Math.round(d.data[1] + 'e2') + 'e-2').toFixed(1) + "%"});

// 		// Update title of the chart
// 		FRAME3.select('.title')
// 		  .text(`% Deforestation of Amazon in Year ${year}`);
// 	}

// 	// Add a title to the chart
// 	FRAME3.append("text")
// 	      .attr("y", -220)
// 	      .attr("class", "title")
// 	      .text("% Deforestation of Amazon in Year 2000");

// 	// Create a data list for the legend
// 	const columnData = piedata.map(function(d) {
// 		return d.Area_Status;
// 	});
	
// 	// Instantiate a colorway for the legend
// 	const legendColor = d3.scaleOrdinal()
// 	  .domain(columnData)
// 	  .range(["#ffed00", "#008026"]);

// 	// Add the squares to the legend
// 	const size = 20
// 	FRAME3.selectAll("mydots")
// 	      .data(columnData)
// 	      .enter()
// 	      .append("rect")
// 	        .attr("x", 160)
// 	        .attr("y", function(d,i){ return 150 + i*(size+5)})
// 	        .attr("width", size)
// 	        .attr("height", size)
// 	        .style("fill", function(d){ return legendColor(d)})

// 	// Add labels to the squares
// 	FRAME3.selectAll("mylabels")
// 	      .data(columnData)
// 	      .enter()
// 	      .append("text")
// 	        .attr("x", 160 + size*1.2)
// 	        .attr("y", function(d,i){ return 150 + i*(size+5) + (size/2)})
// 	        .style("fill", "black")
// 	        .text(function(d){ return d})
// 	        .style("alignment-baseline", "middle")
// 	        .attr("class", "sq-labs")

// 	// Create a tooltip for the points on the line
//     const TOOLTIP = d3.select("#vis-enc-3")
//                       .append("div")
// 					  .attr("class", "pt-tooltip");


// 	// Define event handler functions for tooltips
//     function handleMouseover(event, d) {
//        // Make opaque on mouseover
//        TOOLTIP.style("opacity", 1);

//        // Highlight the pie slice on mouseover
//        d3.select(this).attr("class", "highlight-slice");
//     }

//     function handleMousemove(event, d) {
//        TOOLTIP.style("opacity", 1);
//        // Position the tooltip and fill in information 
//        TOOLTIP.html("Percent of Amazon: " + percentage(d))
//        	      .style("right", "170px");
//     }

//     function percentage(d){
//     	return Number(Math.round(d.data[1] + 'e2') + 'e-2').toFixed(1) + "%";
//     }

//     function handleMouseleave(event, d) {
      
//        // Make transparent on mouseleave
//    	   // return column fill and stroke to original
//        TOOLTIP.style("opacity", 0);

//        d3.select(this).classed('highlight-slice', false);
//        d3.select(this).classed('slices', true)
//     }


    /* =====================  VISUALIZATION 1.2: LINE PLOT  ===========================*/

	d3.csv("def_data.csv").then((linedata) => {

		// Print the data
		console.log(linedata)

		// Create the scales for the scatter plot
		const ySCALE_REV = d3.scaleLinear() 
	    	.domain([0, d3.max(linedata, (d) => { return d.Proportion_Area_Deforested; })])  
	    	.range([VIS_HEIGHT, 0]);

		const xSCALE = d3.scaleLinear()
	    	.domain([d3.min(linedata, function(d) { return d.Year; }), d3.max(linedata, function(d) { return d.Year; })])
	    	.range([0, VIS_WIDTH]);

		// Create a tooltip for the points on the line
    	const TOOLTIP = d3.select("#vis-enc-1")
                       	   .append("div")
					       .attr("class", "pt-tooltip");


		// Define event handler functions for tooltips
    	function handleMouseover(event) {
    		console.log('hovering')

           // Highlight the point on mouseover
          	d3.select(this).classed("highlight", true);
        }

        // function handleMousemove(event, d) {
        //    TOOLTIP.style("opacity", 1);
        //    // Position the tooltip and fill in information 
        //    TOOLTIP.html("Year: " + d.Year + "<br>Proportion Area Deforested: " + d3.format(".3f")(d.Proportion_Area_Deforested))
        //            .style("left", event.x + "px")
        //            .style("top", (event.y + 600) + "px"); // Place the tooltip
        // }

        function handleMouseclick(event, d) {
    	    TOOLTIP.style("opacity", 1);

    	    // d3.select(this).attr("stroke", "lime");

		    console.log(d3.select(this) + "clicked");

       	    TOOLTIP.html("Year: " + d.Year + "<br>Proportion Area Deforested: " + d3.format(".3f")(d.Proportion_Area_Deforested))
       			    .style("right", MARGINS.right + "px")
       			    .style("top", "400px")

       	    d3.selectAll(".vis1-point").classed("selected", false)

       	    if (d3.select(this).classed("selected")) {
       		    d3.select(this).classed("selected", false)
       	    }
       	    else {
       		    d3.select(this).classed("selected", true)
       	    }

       	    let selectedYear = d.Year;

       	    updatePieChart(selectedYear);
	    }

        function handleMouseleave(event, d) {
      
           // Make transparent on mouseleave
   	       // return column fill and stroke to original
        	console.log("left")

            d3.select(this).classed("highlight", false);
        }

		let myLine = d3.line()
        	.x(function(d) { return xSCALE(d.Year) - MARGINS.left; }) 
        	.y(function(d) { return ySCALE_REV(d.Proportion_Area_Deforested) - MARGINS.top; }) 
        	.curve(d3.curveMonotoneX)
        
        	FRAME1.append("path")
        	.datum(linedata) 
        	.attr("class", "line") 
        	.attr("transform", "translate(" + 100 + "," + 100 + ")")
        	.attr("d", myLine)
        	.attr("class", "line");

    	let myPoints = FRAME1.append("g")
  			.selectAll("points")  
	      	 .data(linedata) // Passed from .then  
	         .enter()       
	         .append("circle")
	      	    .attr("cx", (d) => { return (xSCALE(d.Year) + MARGINS.left); }) 
	            .attr("cy", (d) => { return (ySCALE_REV(d.Proportion_Area_Deforested) + MARGINS.top); }) 
	            .attr("r", 7)
	            .attr("fill", "green")
	            .attr("opacity", "1")
	            .attr("class", "vis1-point")
	            .attr("id", (d) => { return d.Year; })
	         .on("mouseover", handleMouseover)// Add event listeners
            // .on("mousemove", handleMousemove)
             .on("mouseleave", handleMouseleave)
	         .on("click", handleMouseclick);
    });

/* =====================  VISUALIZATION 2: DOT PLOT  ===========================*/

const FRAME2 = d3.select("#vis-enc-2").append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

d3.csv("all_scatter_points.csv").then((dotdata) => {
	d3.csv("def_data.csv").then((def_data) => {

		// Print the data
		console.log(dotdata)

		const MAX_X_LENGTH = d3.max(dotdata, (d) => { return parseInt(d.x); });
		const MAX_Y_LENGTH = d3.max(dotdata, (d) => { return parseInt(d.y); });

		// Create the scales for scatter plot
		const ySCALE = d3.scaleLinear() 
			.domain([0, MAX_Y_LENGTH])
			.range([VIS_HEIGHT, 0]);

		const xSCALE = d3.scaleLinear()
			.domain([0, MAX_X_LENGTH])
			.range([0, VIS_WIDTH]);
		
		let myPoints = FRAME2.append("g")
			.selectAll("points")  
			.data(dotdata) // Passed from .then  
			.enter()       
			.append("circle")
				.attr("cx", (d) => { return (xSCALE(d.x) + 25); })
				.attr("cy", (d) => { return (ySCALE(d.y) + MARGINS.top + 10); })
				.attr("r", 10)
				.attr("r", 8)
				.attr("class", "pt")
				.attr("fill", function (d) {
					if((d.x-1) < 9 || ((d.x-1) == 9 && d.y <= 5)){ // hard code coords for 2000 to start
						return "green"
					} else {
						return "#DFBE9F"
					}})
				.attr("stroke", "brown")
				.attr("stroke-width", 2)
				.on("mouseover", handleMouseover)
			    .on("mousemove", handleMousemove)
			    .on("mouseleave", handleMouseleave);

		function updateDotPlot(selection) {
			let xcoord = parseInt(def_data.find(d => d.Year === selection).x_coord);
			let ycoord = parseInt(def_data.find(d => d.Year === selection).y_coord);
			d3.selectAll(".pt").attr("fill", function (d) {
					if((d.x-1) < xcoord || ((d.x-1) == xcoord && d.y <= ycoord)){
						return "green"
					} else {
						return "#DFBE9F"
					}})
			// Update title of the chart
			FRAME2.select('.title')
				.text(`% of Amazon Remaining in Year ${selection}`);
		}

		// Add a title
		FRAME2.append("text")
			.attr("y", 25)
			.attr("x", 250)
			.attr("class", "title")
			.text("% of Amazon Remaining in Year 2000");

		// Add subtitle
		FRAME2.append("text")
			.attr("y", 490)
			.attr("x", 150)
			.text('1 "Tree" = 0.5% of Rainforest');

		// add border around vis 2
		let border = FRAME2.select("g")
						.append("rect")
						.attr("height", FRAME_HEIGHT*.85)
						.attr("width", FRAME_WIDTH*.85)
						.attr("class", "border")
						.attr("x", 35)
						.attr("y", 37);

		// Create a tooltip for the points on the line
		const TOOLTIP = d3.select("#vis-enc-2")
						  .append("div")
						  .attr("class", "pt-tooltip");

		// Define event handler functions for tooltips
		function handleMouseover(event) {
			// Make opaque on mouseover
			TOOLTIP.style("opacity", 1);
			// Highlight the bar (and outline for accessibility) on mouseover
			d3.select(this).style("stroke", "lime")
					.style("stroke-width", "4px");
		}

		function handleMousemove(event, d) {
			TOOLTIP.style("opacity", 1);
			// cover edge cases where the ones place is 10 and the tens place is 0
			if (d.y/2 == 10) {
				coords_to_percent = (d.x).toString() + "0%"
			} else if (d.x-1 == 0) {
				coords_to_percent = (d.y/2).toString() + "%"
			} else {
				coords_to_percent = (d.x-1).toString() + (d.y/2).toString() + "%"
			}
			TOOLTIP.html("% Remaining<br>from Point:<br>" + coords_to_percent)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 50) + "px");
		}

		function handleMouseleave(event) {
			// Make transparent on mouseleave
			// return column fill and stroke to original
			TOOLTIP.style("opacity", 0);
			d3.select(this).style('stroke', "brown").style("stroke-width", "2px");
		}

		/* =====================  VISUALIZATION 3: PIE CHART  ===========================*/

		// Read in the .csv file for Visual Encoding 3
		d3.csv("all_pie_slices.csv").then(function(piedata) {

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
			let pieData = {};
			piedata.forEach(function(d) {
				pieData[d.Area_Status] = d.Deforested_Forested_Percentages_2000;
			});

			// Create a colorway for the pie chart
			const color = d3.scaleOrdinal()
			.range(["#ffed00", "#008026"])

			// Create the actual pie chart
			let pie = d3.pie()
			.value(function(d) {return d[1]})
			let data_ready = pie(Object.entries(pieData))

			console.log(data_ready)

			// Generate the arcs for the slices
			const arcGenerator = d3.arc()
			.innerRadius(0)
			.outerRadius(radius)

			// Add the slices to the chart
			let slices = FRAME3.selectAll('mySlices')
							.data(data_ready)
							.join('path')
							.attr('d', arcGenerator)
							.attr('fill', function(d){ return(color(d.data[0])) })
							.attr("class", "slices")
							.on("mouseover", handleMouseover)
							.on("mousemove", handleMousemove)
							.on("mouseleave", handleMouseleave);

			function updatePieChart(year) {
				let pieData = {};
				piedata.forEach(function(d) {
					pieData[d.Area_Status] = d['Deforested_Forested_Percentages_' + year];
				});

				let pie = d3.pie()
				.value(function(d) {return d[1]})
				let data_ready = pie(Object.entries(pieData))

				let slices = FRAME3.selectAll('.slices')
				.data(data_ready);
				
				slices.attr("d", arcGenerator); 

				// Update percentage labels for the slices
				FRAME3.selectAll('.slice-labs')
				.data(data_ready)
				.text(function(d){ return Number(Math.round(d.data[1] + 'e2') + 'e-2').toFixed(1) + "%"});

				// Update title of the chart
				FRAME3.select('.title')
				.text(`% Deforestation of Amazon in Year ${year}`);
			}

			// Add a title to the chart
			FRAME3.append("text")
				.attr("y", -220)
				.attr("class", "title")
				.text("% Deforestation of Amazon in Year 2000");

			// Create a data list for the legend
			const columnData = piedata.map(function(d) {
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
					.style("alignment-baseline", "middle")
					.attr("class", "sq-labs")

			// Create a tooltip for the points on the line
			const TOOLTIP = d3.select("#vis-enc-3")
							.append("div")
							.attr("class", "pt-tooltip");


			// Define event handler functions for tooltips
			function handleMouseover(event, d) {
			// Make opaque on mouseover
			TOOLTIP.style("opacity", 1);

			// Highlight the pie slice on mouseover
			d3.select(this).attr("class", "highlight-slice");
			}

			function handleMousemove(event, d) {
			TOOLTIP.style("opacity", 1);
			// Position the tooltip and fill in information 
			TOOLTIP.html("Percent of Amazon: " + percentage(d))
					.style("right", "170px");
			}

			function percentage(d){
				return Number(Math.round(d.data[1] + 'e2') + 'e-2').toFixed(1) + "%";
			}

			function handleMouseleave(event, d) {
			
			// Make transparent on mouseleave
			// return column fill and stroke to original
			TOOLTIP.style("opacity", 0);

			d3.select(this).classed('highlight-slice', false);
			d3.select(this).classed('slices', true)
			}


			/* =====================  VISUALIZATION 1.2: LINE PLOT  ===========================*/

			d3.csv("def_data.csv").then((linedata) => {

				// Print the data
				console.log(linedata)

				// Create the scales for the scatter plot
				const ySCALE_REV = d3.scaleLinear() 
					.domain([0, d3.max(linedata, (d) => { return d.Proportion_Area_Deforested; })])  
					.range([VIS_HEIGHT, 0]);

				const xSCALE = d3.scaleLinear()
					.domain([d3.min(linedata, function(d) { return d.Year; }), d3.max(linedata, function(d) { return d.Year; })])
					.range([0, VIS_WIDTH]);

				// Create a tooltip for the points on the line
				const TOOLTIP = d3.select("#vis-enc-1")
								.append("div")
								.attr("class", "pt-tooltip");


				// Define event handler functions for tooltips
				function handleMouseover(event, d) {
				// Make opaque on mouseover

				// Highlight the bar (and outline for accessibility) on mouseover
				d3.select(this).classed("highlight-slice", true)
				}

				// function handleMousemove(event, d) {
				// TOOLTIP.style("opacity", 1);
				// // Position the tooltip and fill in information 
				// TOOLTIP.html("Year: " + d.Year + "<br>Proportion Area Deforested: " + d3.format(".3f")(d.Proportion_Area_Deforested))
				// 		.style("left", event.x + "px")
				// 		.style("top", (event.y + 600) + "px"); // Place the tooltip
				// }

				function handleMouseclick(event, d) {
					TOOLTIP.style("opacity", 1);

					// d3.select(this).attr("stroke", "lime");

					console.log(d3.select(this) + "clicked");

					TOOLTIP.html("Year: " + d.Year + "<br>Proportion Area Deforested: " + d3.format(".3f")(d.Proportion_Area_Deforested))
							.style("right", MARGINS.right + "px")
							.style("top", "400px")

					d3.selectAll(".vis1-point").classed("selected", false)

					if (d3.select(this).classed("selected")) {
						d3.select(this).classed("selected", false)
					}
					else {
						d3.select(this).classed("selected", true)
					}

					let selectedYear = d.Year;

					updatePieChart(selectedYear);
					updateDotPlot(selectedYear);
				}

				function handleMouseleave(event, d) {
			
				// Make transparent on mouseleave
				// return column fill and stroke to original

				d3.select(this).classed("highlight-slice", false)
				}

				let myLine = d3.line()
					.x(function(d) { return xSCALE(d.Year) - MARGINS.left; }) 
					.y(function(d) { return ySCALE_REV(d.Proportion_Area_Deforested) - MARGINS.top; }) 
					.curve(d3.curveMonotoneX)
				
					FRAME1.append("path")
					.datum(linedata) 
					.attr("class", "line") 
					.attr("transform", "translate(" + 100 + "," + 100 + ")")
					.attr("d", myLine)
					.attr("class", "line");
					// .style("fill", "none")
					// .style("stroke", "#CC0000")
					// .style("stroke-width", "2");

				let myPoints = FRAME1.append("g")
					.selectAll("points")  
					.data(linedata) // Passed from .then  
					.enter()       
					.append("circle")
						.attr("cx", (d) => { return (xSCALE(d.Year) + MARGINS.left); }) 
						.attr("cy", (d) => { return (ySCALE_REV(d.Proportion_Area_Deforested) + MARGINS.top); }) 
						.attr("r", 7)
						.attr("fill", "green")
						.attr("opacity", "1")
						.attr("class", "vis1-point")
						.attr("id", (d) => { return d.Year; })
					.on("mouseover", handleMouseover) // Add event listeners
					// .on("mousemove", handleMousemove)
					.on("mouseleave", handleMouseleave)
					.on("click", handleMouseclick);
					// .attr("fill", "black");
			})

		});

	})
})

