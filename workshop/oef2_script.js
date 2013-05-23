var width = 500,
    height = 300,
    padding = 30,
    max = 51,
    data = [];

for(var i=0; i<20; i++) {
    data.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)]);
}

//Create scale functions
var xScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d[0]; })])
    .range([padding, width - padding * 2]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d[1]; })])
    .range([height - padding, padding]);

// Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

// //Define Y axis
// var yAxis = d3.svg.axis()
//     .scale(yScale)
//     .orient("left")
//     .ticks(5);

//Create SVG element
var svg = d3.select("body")
  .append("svg")
    .attr({
        width: width,
        height: height
    });

//Create circles
svg.selectAll("circle")
    .data(data)
  .enter()
    .append("circle")
    .attr({
        cx: function (d) { return xScale(d[0])},
        cy: function (d) { return yScale(d[1])},
        r: 3,
        class: "oef2_cirkel"
    });

//Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

// //Create Y axis
// svg.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(" + padding + ",0)")
//     .call(yAxis);

setInterval(function () {
    data.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)]);
    var points = svg.selectAll("circle")
        .data(data)
        .attr("class", "oef2_cirkel_update")
      .enter()
        .append("circle")
        .attr({
            cx: function (d) { return xScale(d[0])},
            cy: function (d) { return yScale(d[1])},
            r: 3,
            class: "oef2_cirkel_enter"
        })
      .exit().remove();

}, 1000);