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