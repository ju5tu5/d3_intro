(function () {
    'use strict';
    var artboard = document.getElementById("artboard");

    var clearArtboard = function () {
        artboard.innerHTML = '';
    };

    var visualisation = {
        domtree: {
            displayed: false,
            dataLoaded: false,
            data: [],
            loadData: function () {
                var walkDOM = function (node, root, func) { // Thanks Douglas Crockford..
                    var newRoot = [],
                        name = func(node);

                    node = node.firstChild;
                    while (node) {
                        walkDOM(node, newRoot, func);
                        node = node.nextSibling;
                    }

                    if (name !== undefined && name !== 'text' && name !== 'script') {
                        root.push({'name': name, 'children': newRoot});
                    } else if (name === 'text' || name === 'script') {
                        root.push({'name': name});
                    }
                };

                var getTextRepresentation = function (node) {
                    switch (node.nodeType) {
                    case 1:
                        return node.tagName.toLowerCase();
                    case 3:
                        if (!node.textContent.match(/^([\s\t\r\n]*)$/)) {
                            return 'text';
                        }
                        break;
                    default:
                        return undefined;
                    }
                };

                this.data = [];
                walkDOM(document.body, this.data, getTextRepresentation);
                this.dataLoaded = true;
            },
            visualise: function () {
                if (!this.dataLoaded) {
                    this.loadData();
                }

                // Original visualisation by Mike Bostock: http://bl.ocks.org/mbostock/4063570..
                var width = window.innerWidth,
                    height = window.innerHeight;

                var cluster = d3.layout.tree()
                    .size([height - 100, width - 160]);

                var diagonal = d3.svg.diagonal()
                    .projection(function (data) { return [data.y, data.x]; });

                var svg = d3.select("#artboard").append("svg:svg")
                    .attr("width", width)
                    .attr("height", height)
                  .append("g")
                    .attr("transform", "translate(80, 50)");

                var nodes = cluster.nodes(this.data[0]),
                    links = cluster.links(nodes);

                var link = svg.selectAll(".link")
                    .data(links)
                  .enter().append("path")
                    .attr("class", "link")
                    .attr("d", diagonal);

                var node = svg.selectAll(".node")
                    .data(nodes)
                  .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (data) { return "translate(" + data.y + "," + data.x + ")"; });

                node.append("circle")
                    .attr("class", function (d) { return d.children ? 'children' : 'noChildren'; })
                    .attr("r", 4.5);

                node.append("text")
                    .attr("dx", function (d) { return d.children ? -8 : 8; })
                    .attr("dy", 3)
                    .style("text-anchor", function (d) { return d.children ? "end" : "start"; })
                    .text(function (data) { return data.name; });

                d3.select(self.frameElement).style("height", height + "px");
                this.displayed = true;
            },
            clear: function () {
                if(this.displayed) {
                    clearArtboard();
                    this.displayed = false;
                }
            }
        },
        basic: {
            displayed: false,
            dataLoaded: false,
            data: [],
            loadData: function () {
                this.data = [];
                for(var i=0; i<12; i++){
                    this.data.push(10+Math.random()*60);
                }
                this.dataLoaded = true;
            },
            visualise: function () {
                if (!this.dataLoaded) {
                    this.loadData();
                }

                var width = window.innerWidth,
                    height = window.innerHeight,
                    spacing = width/(this.data.length+1);

                var svg = d3.select("#artboard").append("svg:svg")
                    .attr("width", width)
                    .attr("height", height);

                var circles = svg.selectAll("circle")
                  .data(this.data)
                    .enter()
                    .append("circle");

                circles.attr("cx", function (d, i) {
                        return (i * spacing) + spacing;
                    })
                    .attr("cy", height / 2)
                    .attr("r", function (d) {
                        return d;
                    })
                    .attr("class", "basicCircle");

                this.displayed = true;
            },
            clear: function () {
                if(this.displayed) {
                    clearArtboard();
                    this.displayed = false;
                }
            }
        },
        scatterplotNoChrome: {
            displayed: false,
            dataLoaded: false,
            data: [],
            loadData: function () {
                this.data = [];
                var max = 51;
                for(var i=0; i<50; i++) {
                    this.data.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)]);
                }
                this.dataLoaded = true;
            },
            visualise: function () {
                if (!this.dataLoaded) {
                    this.loadData();
                }

                var width = window.innerWidth,
                    height = window.innerHeight,
                    padding = 100;

                var svg = d3.select("#artboard").append("svg:svg")
                    .attr("width", width)
                    .attr("height", height);

                //Create scale functions
                var xScale = d3.scale.linear()
                    .domain([0, d3.max(this.data, function(d) { return d[0]; })])
                    .range([padding, width - padding * 2]);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(this.data, function(d) { return d[1]; })])
                    .range([height - padding, padding]);

                //Create circles
                svg.selectAll("circle")
                    .data(this.data)
                  .enter()
                    .append("circle")
                    .attr({
                        cx: function (d) { return xScale(d[0])},
                        cy: function (d) { return yScale(d[1])},
                        r: 3,
                        class: "oef2_cirkel"
                    });

                this.displayed = true;
            },
            clear: function () {
                if(this.displayed) {
                    clearArtboard();
                    this.displayed = false;
                }
            }
        },
        scatterplotAxis: {
            displayed: false,
            dataLoaded: false,
            data: [],
            loadData: function () {
                this.data = [];
                var max = 51;
                for(var i=0; i<50; i++) {
                    this.data.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)]);
                }
                this.dataLoaded = true;
            },
            visualise: function () {
                if (!this.dataLoaded) {
                    this.loadData();
                }

                var width = window.innerWidth,
                    height = window.innerHeight,
                    padding = 100;

                var svg = d3.select("#artboard").append("svg:svg")
                    .attr("width", width)
                    .attr("height", height);

                //Create scale functions
                var xScale = d3.scale.linear()
                    .domain([0, d3.max(this.data, function(d) { return d[0]; })])
                    .range([padding, width - padding * 2]);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(this.data, function(d) { return d[1]; })])
                    .range([height - padding, padding]);

                // Define X axis
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5);

                //Define Y axis
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

                //Create circles
                svg.selectAll("circle")
                    .data(this.data)
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

                //Create Y axis
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ",0)")
                    .call(yAxis);

                this.displayed = true;
            },
            clear: function () {
                if(this.displayed) {
                    clearArtboard();
                    this.displayed = false;
                }
            }
        },
        scatterplotFull: {
            displayed: false,
            dataLoaded: false,
            data: [],
            loadData: function () {
                this.data = [];
                var max = 51;
                for(var i=0; i<50; i++) {
                    this.data.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)]);
                }
                this.dataLoaded = true;
            },
            visualise: function () {
                if (!this.dataLoaded) {
                    this.loadData();
                }

                var width = window.innerWidth,
                    height = window.innerHeight,
                    padding = 100;

                var svg = d3.select("#artboard").append("svg:svg")
                    .attr("width", width)
                    .attr("height", height);

                //Create scale functions
                var xScale = d3.scale.linear()
                    .domain([0, d3.max(this.data, function(d) { return d[0]; })])
                    .range([padding, width - padding * 2]);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(this.data, function(d) { return d[1]; })])
                    .range([height - padding, padding]);

                // Define X axis
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(5);

                //Define Y axis
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);

                // Create circles
                svg.selectAll("circle")
                    .data(this.data)
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

                //Create Y axis
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding + ",0)")
                    .call(yAxis);


                for(var i=0; i<20; i++){
                    var max = 51;
                    this.data.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)]);
                }
                var points = svg.selectAll("circle")
                    .data(this.data)
                    .attr("class", "oef2_cirkel_update")
                  .enter()
                    .append("circle")
                    .attr({
                        cx: function (d) { return xScale(d[0])},
                        cy: function (d) { return yScale(d[1])},
                        r: 5,
                        class: "oef2_cirkel_enter"
                    });

                
                this.displayed = true;
            },
            clear: function () {
                if(this.displayed) {
                    clearArtboard();
                    this.displayed = false;
                }
            }
        },
        interaction: {
            displayed: false,
            dataLoaded: false,
            data: {},
            loadData: function () {
                // data van http://onzetaal.nl/taaladvies/advies/letterfrequentie-in-het-nederlands
                this.data = {e: 18.91, n: 10.03, a: 7.49, t: 6.79, i: 6.50, r: 6.41, o: 6.06, d: 5, s: 3.73, l: 3.57, g: 3.40, v: 2.85, h: 2.38, k: 2.25, m: 2.21, u: 1.99, b: 1.58, p: 1.57, w: 1.52, j: 1.46, z: 1.39, c: 1.24, f: 0.81, x: 0.040, y: 0.035, q: 0.009};
                this.dataLoaded = true;
            },
            visualise: function () {
                if (!this.dataLoaded) {
                    this.loadData();
                }
                
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = window.innerWidth,
                    height = window.innerHeight-100;

                var formatPercent = d3.format(".0%");

                var xScale = d3.scale.ordinal()
                    .domain(d3.keys(this.data))
                    .rangeRoundBands([0, width], .1);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(d3.entries(this.data), function (d) { return d.value/100; })])
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickFormat(formatPercent);

                var cb = d3.select("#artboard").append("label")
                    .attr("style", "position:absolute; top:0; right:100px; z-index:9999;")
                    .text("I like red better!")
                    .append("input")
                        .attr("type", "checkbox");

                var svg = d3.select("#artboard").append("svg:svg")
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
                      .data(d3.entries(this.data))
                    .enter().append("rect")
                      .attr("class", "bar")
                      .attr("x", function(d) { return xScale(d.key); })
                      .attr("width", xScale.rangeBand())
                      .attr("y", function(d) { return yScale(d.value/100); })
                      .attr("height", function(d) { return height - yScale(d.value/100); });


                d3.select("input").on("change", change);

                function change () {
                    svg.selectAll(".bar, .bar_checked")
                        .data(d3.entries(this.data))
                        .attr("class", this.checked?"bar_checked":"bar");
                }

                this.displayed = true;
            },
            clear: function () {
                if(this.displayed) {
                    clearArtboard();
                    this.displayed = false;
                }
            }
        }
    };

    var clearAll = function () {
        for (var key in visualisation) {
            visualisation[key].clear();
        }
    };

    // Start reveal
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,
        rollingLinks: true,
        transition: 'fade',
        dependencies: [
            { src: 'static/js/classList.js', condition: function () { return !document.body.classList; } },
            { src: 'static/js/highlight.js', async: true, callback: function () { hljs.initHighlightingOnLoad(); } },
            { src: 'static/js/zoom.js', async: true, condition: function () {return !!document.body.classList; } }
        ]
    });

    // Visualisations per slide
    Reveal.addEventListener('slidechanged', function (event) {
        var slidecoord = [event.indexh, event.indexv];
        console.log(slidecoord);

        clearAll();

        if (slidecoord.compare([0,0]) || slidecoord.compare([7,1])) {
            visualisation.domtree.visualise();
        }

        if(slidecoord.compare([7,3]) || slidecoord.compare([8,0])){
            visualisation.basic.visualise();
        }

        if(slidecoord.compare([10,0])){
            visualisation.scatterplotNoChrome.visualise();
        }

        if(slidecoord.compare([10,1])){
            visualisation.scatterplotAxis.visualise();
        }

        if(slidecoord.compare([11,0])){
            visualisation.scatterplotFull.visualise();
        }

        if(slidecoord.compare([12,1]) || slidecoord.compare([13,0])){
            visualisation.interaction.visualise();
        }
    });

    // Initial visualisation on the front-slide
    Reveal.addEventListener('ready', function (event) {
        var slidecoord = [event.indexh, event.indexv];

        if (slidecoord.compare([0,0]) && !visualisation.domtree.displayed) {
            visualisation.domtree.visualise();
        }

        if(slidecoord.compare([8,0]) && !visualisation.basic.displayed){
            visualisation.basic.visualise();
        }

        if(slidecoord.compare([10,0]) && !visualisation.basic.displayed){
            visualisation.scatterplotNoChrome.visualise();
        }

        if(slidecoord.compare([10,1]) && !visualisation.basic.displayed){
            visualisation.scatterplotAxis.visualise();
        }

        if(slidecoord.compare([11,0]) && !visualisation.basic.displayed){
            visualisation.scatterplotFull.visualise();
        }

        if(slidecoord.compare([12,1]) && !visualisation.basic.displayed){
            visualisation.interaction.visualise();
        }

        if(slidecoord.compare([13,0]) && !visualisation.basic.displayed){
            visualisation.interaction.visualise();
        }
    });

}());


// Helper functions
Array.prototype.compare = function(array) {
    if (this.length !== array.length)
        return false;
        for (var i=0; i<this.length; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array){
                if (!this[i].compare(array[i])) {
                    return false;
                }
            } else if (this[i] !== array[i]) {
                return false;
        }
    }
    return true;
};
// EOF