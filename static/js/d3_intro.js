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

        if (slidecoord.compare([0,0]) || slidecoord.compare([3,0])) {
            visualisation.domtree.visualise();
        }


    });

    // Initial visualisation on the front-slide
    Reveal.addEventListener('ready', function (event) {
        var slidecoord = [event.indexh, event.indexv];

        if (slidecoord.compare([0,0]) && !visualisation.domtree.displayed) {
            visualisation.domtree.visualise();
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