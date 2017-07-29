var pageBody = $("#page-body")
let socket = io();

// connection initiation callback
socket.on('connect', function(data) {
});

// mesage from Serial port
socket.on('data_1', function(data) {
	console.log("Data: " + data);
});

function createChart(title, width, height) {
	var chartPane = $("<div>", {class : "chart-pane"})
	var chartTitle = $("<div>", {class : "chart-title", "text" : title})
	var chart = $("<svg>", {class : "chart", width : width, height : height});
	pageBody.append(chartPane);
	chartPane.append(chartTitle);
	chartPane.append(chart);
}

// <div class="chart-pane">
//         <div class="vis-title">Something something</div>
//         <svg class="chart" width="1200" height="600"/>
//       </div>