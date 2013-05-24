// data van http://onzetaal.nl/taaladvies/advies/letterfrequentie-in-het-nederlands
var data = {e: 18.91, n: 10.03, a: 7.49, t: 6.79, i: 6.50, r: 6.41, o: 6.06, d: 5, s: 3.73, l: 3.57, g: 3.40, v: 2.85, h: 2.38, k: 2.25, m: 2.21, u: 1.99, b: 1.58, p: 1.57, w: 1.52, j: 1.46, z: 1.39, c: 1.24, f: 0.81, x: 0.040, y: 0.035, q: 0.009};

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var xScale = d3.scale.ordinal()
    .domain(d3.keys(data))
    .rangeRoundBands([0, width], .1);

var yScale = d3.scale.linear()
    .domain([0, d3.max(d3.entries(data), function (d) { return d.value/100; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.selectAll(".bar")
      .data(d3.entries(data))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.key); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d.value/100); })
      .attr("height", function(d) { return height - yScale(d.value/100); });

// VOEG HIER INTERACTIE TOE!