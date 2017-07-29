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
	$.ajax({
		url: "http://ec2-54-79-91-24.ap-southeast-2.compute.amazonaws.com/api/api/energy",
		context: document.body
	}).done(function(data) {
		renderBarGraph(data);
	});

	// // this one will fail for now
	// $.ajax({
	// 	url: "http://ec2-54-79-91-24.ap-southeast-2.compute.amazonaws.com/api/api/SOMETHING",
	// 	context: document.body
	// }).done(function(data) { // change "fail" to "done" once api is ready
	// 	renderLineChart(data);
	// });
	renderLineChart([])
});

function renderLineChart(data) {

	// MockData overwriting data
	var data = [
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

	var parseDate = d3.timeParse("%Y-%m-%d");

	var svg = d3.select("#first-chart"),
    margin = {top: 20, right: 80, bottom: 100, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
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

function renderBarGraph(data) {
	
	var svg = d3.select("#solar-hw-chart"),
		margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		yScale = d3.scaleLinear().rangeRound([height, 0]);

	if (!data) {
	data = [{
		Postcode: "A",
		Count: 10
	}, {
		Postcode: "B",
		Count: 15
	}];
	}
	
	var g = svg.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
  xScale.domain(data.map(function(d) { return d.Postcode; }));
  yScale.domain([0, d3.max(data, function(d) { return d.Count; })]);

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
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.Postcode); })
      .attr("y", function(d) { return yScale(d.Count); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.Count); });
}