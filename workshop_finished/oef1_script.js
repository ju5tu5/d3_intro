/* Jouw wonderlijke Javascript */
var dataset = [1,1,2,3,5,8,13,21,34,55]; // voer een serie getallen in bijv. [1,1,2,3,5,8]

var svg = d3.select("body").append("svg")
    .attr("width", 400)
    .attr("height", 300);

var circles = svg.selectAll("circle")
  .data(dataset)
    .enter()
    .append("circle");

circles.attr("cx", function (d, i) {
        return (i * 50) + 25;
    })
    .attr("cy", 150)
    .attr("r", function (d) { return d; })
    .attr("class", "oef1_cirkel");