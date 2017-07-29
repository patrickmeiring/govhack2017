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
	renderLineChart();
	$.ajax({
		url: "http://ec2-54-79-91-24.ap-southeast-2.compute.amazonaws.com/api/api/energy",
		context: document.body
	}).done(function(data) {
		renderBarGraph(data);
	});
});

function renderLineChart(data) {
	var svg = d3.select("#first-chart");
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xScale = d3.scaleTime().range([0, width]),
		yScale = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return xScale(d.date); })
		.y(function(d) { return yScale(d.power); });
	
	var today = new Date(2017, 10, 11);
	var yesterday = new Date(2017, 10, 10);
	var cities = [{
		id: "Queensland",
		values: [{
			date: today,
			power: 10
		}, {
			date: yesterday,
			power: 11
		}]
	}];

/*	var cities = data.columns.slice(1).map(function(id) {
		return {
		id: id,
		values: data.map(function(d) {
			return {date: d.date, temperature: d[id]};
		})
		};
	});*/
	var dataPoints = [].concat.apply([], cities.map(function (city) {
		return city.values;//.map(function (point) { point.date });
	}));

	xScale.domain(d3.extent(dataPoints, function(d) { return d.date; }));

	yScale.domain([
		d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.power; }); }),
		d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.power; }); })
	]);

	z.domain(cities.map(function(c) { return c.id; }));

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale));

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(yScale))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("Temperature, ºF");

	var city = g.selectAll(".city")
		.data(cities)
		.enter().append("g")
		.attr("class", "city");

	city.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.id); });
		
	city.append("text")
		.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.power) + ")"; })
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "10px sans-serif")
		.text(function(d) { return d.id; });
}

function renderBarGraph(data) {
	
	var svg = d3.select("#solar-hw-chart svg"),
		margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;
	$("#solar-hw-chart svg").attr("data-chart", JSON.stringify(data));

	var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		yScale = d3.scaleLinear().rangeRound([height, 0]);

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