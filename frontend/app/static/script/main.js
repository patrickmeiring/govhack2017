var pageBody = $("#page-body")
let socket = io();

// connection initiation callback
socket.on('connect', function(data) {
});

// mesage from Serial port
socket.on('data_1', function(data) {
	console.log("Data: " + data);
});

function createChart(title, chartWidth, chartHeight) {
	var chartPane = $("<div>", {class : "chart-pane"})
	var chartTitle = $("<div>", {class : "chart-title", "text" : title})
	var chart = $("<svg>", {class : "chart"});
	chart.attr("width", chartWidth).attr("height", chartHeight)

	pageBody.append(chartPane);
	chartPane.append(chartTitle);
	chartPane.append(chart);

	var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom,
    graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

    
}


$(document).ready(function() {
	configureBarGraph("solar-hw-chart", {
		valueAttribute: "AverageInstallations",
		labelAttribute: "Region",
		yLabel: "Rebate claims per dwelling",
		tooltipSeries: [{
			label: "Average claims per dwelling",
			attribute: "AverageInstallations",
			numDecimals: 3,
		}, {
			label: "Total claims",
			attribute: "Installations",
			numDecimals: 0,
		}, {
			label: "Total dwellings",
			attribute: "Dwellings",
			numDecimals: 0,
		}]
	});
	
	
	//http://ec2-54-79-91-24.ap-southeast-2.compute.amazonaws.com/api/api/energy
	loadData(4001);
	
	
});

function loadData(postcode) {
	$.ajax({
		url: "http://ec2-54-79-91-24.ap-southeast-2.compute.amazonaws.com/api/energy/SolarHotWaterByRegion",
		context: document.body
	}).done(function(data) {
		setBarGraphData("solar-hw-chart", data);
	});
	
	$(window).resize(function() {		
		redrawBarGraph("solar-hw-chart");
		redrawLineChart("first-chart");
		redrawLineChart("second-chart");
	});

	// // this one will fail for now
	// $.ajax({
	// 	url: "http://ec2-54-79-91-24.ap-southeast-2.compute.amazonaws.com/api/api/SOMETHING",
	// 	context: document.body
	// }).done(function(data) { // change "fail" to "done" once api is ready
	// 	renderLineChart(data);
	// });
	setLineChartData("first-chart", [])
	setLineChartData("second-chart", [])
}

function setLineChartData(id, data) {
	// MockData overwriting data
	data = [
	{
		"state" : "QLD",
		"values" : [
			{
				"date" : "2017-01-01",
				"value" : "10"
			},
			{
				"date" : "2017-01-02",
				"value" : "20"
			},
			{
				"date" : "2017-01-03",
				"value" : "20"
			},
			{
				"date" : "2017-01-04",
				"value" : "40"
			},
			{
				"date" : "2017-01-05",
				"value" : "25"
			}
		]
	},
	{
		"state" : "NSW",
		"values" : [
			{
				"date" : "2017-01-01",
				"value" : "50"
			},
			{
				"date" : "2017-01-02",
				"value" : "10"
			},
			{
				"date" : "2017-01-03",
				"value" : "30"
			},
			{
				"date" : "2017-01-04",
				"value" : "20"
			},
			{
				"date" : "2017-01-05",
				"value" : "10"
			}
		]
	}];
	
	var selector = "#" + id;
	$(selector).data("chart-data", data);
	redrawLineChart(id);
}


function redrawLineChart(id) {
	var div = $("#" + id);
	var data = div.data("chart-data");
	if (!data) {
		// Data not yet loaded.
		return;
	}
	
	var parseDate = d3.timeParse("%Y-%m-%d");

	var svg = d3.select("#" + id + " svg"),
    margin = {top: 20, right: 80, bottom: 100, left: 50},
    width = +div.innerWidth() - margin.left - margin.right,
    height = +div.innerHeight() - margin.top - margin.bottom;
	
	// Clear the data in the chart before we begin		
	svg.selectAll("*").remove();

    var graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xScale = d3.scaleTime().range([0, width]),
		yScale = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
		.x(function(d) { console.log(d.date); return xScale(parseDate(d.date)); })
		.y(function(d) { return yScale(+d.value); });
	
	var dataPoints = [].concat.apply([], data.map(function (stateData) {
		return stateData.values;//.map(function (point) { point.date });
	}));

	xScale.domain(d3.extent(dataPoints, function(d) { return parseDate(d.date); }));

	yScale.domain([10, 50]);

	graph.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")))
		.selectAll("text")
			.style("text-anchor", "end")
        	.attr("dx", "-.8em")
        	.attr("dy", ".15em")
        	.attr("transform", "rotate(-65)");


	graph.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(yScale))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("Y AXIS");

	graph.selectAll(".trend-line")
		.data(data)
		.enter()
		.append("path")
		.attr("stroke", function(d, i) { return z(i); })
		.attr("fill", "none")
		.attr("class", "trend-line")
		.attr("d", function(d) { return line(d.values); });

	// city.append("text")
	// 	.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
	// 	.attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.power) + ")"; })
	// 	.attr("x", 3)
	// 	.attr("dy", "0.35em")
	// 	.style("font", "10px sans-serif")
	// 	.text(function(d) { return d.id; });
}

function configureBarGraph(id, config) {
	var selector = "#" + id;
	$(selector).data("chart-config", config);
}

function setBarGraphData(id, data) {
	var selector = "#" + id;
	$(selector).data("chart-data", data);
	redrawBarGraph(id);
}

function redrawBarGraph(id) {
	var div = $("#" + id);
	var data = div.data("chart-data");
	var config = div.data("chart-config");
	if (!data || !config) {
		// Data not yet loaded.
		return;
	}
	 
	var svgSelector = "#" + id + " svg";
	var svg = d3.select(svgSelector),
		margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = +div.innerWidth() - margin.left - margin.right,
		height = +div.innerHeight() - margin.top - margin.bottom;

	var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		yScale = d3.scaleLinear().rangeRound([height, 0]);

	// Clear the data in the chart before we begin		
	svg.selectAll("*").remove();
	
	var g = svg.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			function formatThousandsWithRounding(n, dp){
				// Cross-browser way of formatting numbers nicely
				// https://stackoverflow.com/questions/5731193/how-to-format-numbers-using-javascript
				var w = n.toFixed(dp), k = w|0, b = n < 0 ? 1 : 0,
				u = Math.abs(w-k), d = (''+u.toFixed(dp)).substr(2, dp),
				s = ''+k, i = s.length, r = '';
				while ( (i-=3) > b ) { r = ',' + s.substr(i, 3) + r; }
				return s.substr(0, i + 3) + r + (d ? '.'+d: '');
			};
			
			var result = "<div>";
			for (var i = 0; i < config.tooltipSeries.length; i++) {
				var series = config.tooltipSeries[i];
				var value = d[series.attribute];
				if (value !== undefined) {
					if (i > 0) {
						result += "<br/>";
					}
					if (series.numDecimals !== undefined) {
						value = formatThousandsWithRounding(value, series.numDecimals);
					}
					result += "<strong>" + series.label + ":</strong> ";
					result += "<span>" + value + "</span>";
				}
			}
			result += "</div>";
			return result;
		});
	
	
	svg.call(tip);
	
	xScale.domain(data.map(function(d) { return d[config.labelAttribute]; }));
	yScale.domain([0, d3.max(data, function(d) { return d[config.valueAttribute]; })]);

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale));

			
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(yScale).ticks(10))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.attr("text-anchor", "end")
		.text(config.yLabel);

	g.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return xScale(d[config.labelAttribute]); })
		.attr("y", function(d) { return yScale(d[config.valueAttribute]); })
		.attr("width", xScale.bandwidth())
		.attr("height", function(d) { return height - yScale(d[config.valueAttribute]); })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
}

