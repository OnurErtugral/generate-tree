const githubCorner = `<a
href="https://github.com/OnurErtugral/component-tree"
class="github-corner"
aria-label="View source on GitHub"
><svg
  width="60"
  height="60"
  viewBox="0 0 250 250"
  style="
    fill: #fff;
    color: #151513;
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  "
  aria-hidden="true"
>
  <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
  <path
    d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
    fill="currentColor"
    style="transform-origin: 130px 106px;"
    class="octo-arm"
  ></path>
  <path
    d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
    fill="currentColor"
    class="octo-body"
  ></path></svg></a
>
`;

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
  </head>
  <body>
    ${githubCorner}
    <div id="canvas"></div>

    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="data.js"></script>
    <script src="script.js"></script>
  </body>
</html>
`;

const script = `
var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g");

var tree = d3.tree().size([height, width - 200]);
var root = d3.hierarchy(data, (d) => d.children);

tree(root);

var drawArea = svg
  .append("g")
  .classed("drawArea", true)
  .attr("transform", "translate(" + 75 + "," + 0 + ")");

  var defs = drawArea.append("defs");
  var gradient = defs
    .append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "50%")
    .attr("y2", "50%")
    .attr("gradientUnits", "userSpaceOnUse");
  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "0%")
    .attr("stop-color", d3.interpolateInferno(0.5))
    .attr("stop-opacity", 1);
  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "25%")
    .attr("stop-color", d3.interpolateInferno(0.6))
    .attr("stop-opacity", 1);
  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "50%")
    .attr("stop-color", d3.interpolateInferno(0.7))
    .attr("stop-opacity", 1);
  gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "75%")
    .attr("stop-color", d3.interpolateInferno(0.8))
    .attr("stop-opacity", 1);
  gradient
    .append("stop")
    .attr("class", "end")
    .attr("offset", "100%")
    .attr("stop-color", d3.interpolateInferno(1))
    .attr("stop-opacity", 1);

var nodes = root.descendants();
var links = root.descendants().slice(1);
var i = 0;

var link = drawArea
  .append("g")
  .classed("paths", true)
  .selectAll(".link")
  .data(links, function(d) {
    return d.id || (d.id = ++i);
  })
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", (d) => {
    return (
      "M" +
      d.y +
      "," +
      d.x +
      "C" +
      (d.parent.y + 50) +
      "," +
      d.x +
      " " +
      (d.parent.y + 150) +
      "," +
      d.parent.x +
      " " +
      d.parent.y +
      "," +
      d.parent.x
    );
  })
  .attr("id", (d) => {
    return "link-" + d.id;
  })
  .attr("stroke", "url(#svgGradient)");

var node = drawArea
  .append("g")
  .classed("nodes", true)
  .selectAll(".node")
  .data(nodes, function(d) {
    return d.id || (d.id = ++i);
  })
  .enter()
  .append("g")
  .attr("class", function(d) {
    return "node" + (d.children ? " node--internal" : " node--leaf");
  })
  .attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")";
  })

  .on("mouseenter", function(d) {
    root.path(d).forEach((link) => {
      d3.select("#link-" + link.id)
        .style("stroke", "#00cdff")
        .style("stroke-width", "4");
      d3.select("#circle-" + link.id).style("fill", "red");
    });
  })
  .on("mouseleave", function(d) {
    root.path(d).forEach((link) => {
      d3.select("#link-" + link.id)
        .style("stroke", "url(#svgGradient)")
        .style("stroke-width", "2");
      d3.select("#circle-" + link.id).style("fill", "#777");
    });
  });

node
  .append("circle")
  .attr("r", 4.5)
  .on("mouseenter", function(d) {
  })
  .attr("id", (d) => {
    return "circle-" + d.id;
  });

node
  .append("text")
  .attr("dy", 4)
  .attr("x", function(d) {
    return d.children ? -8 : 8;
  })
  .style("text-anchor", function(d) {
    return d.children ? "end" : "start";
  })
  .text(function(d) {
    return d.data.path;
  });

var zoom = d3
  .zoom()
  .scaleExtent([0.5, 4])
  .translateExtent([[-width/2, -height/2], [width*1.5, height*1.5]])
  .extent([[0, 0], [width, height]])
  .on("zoom", updateChart);

d3.select("#canvas svg").call(zoom);
function updateChart() {
  d3.select("svg g").attr("transform", d3.event.transform);
}
`;

const style = `
body {
  font-family: sans-serif;
  background-color: #242626;
}
.node circle {
  fill: #777;
  transition: all 0.3s;
  cursor: pointer;
}

.node text {
  font: 11px sans-serif;
  user-select: none;
  cursor: pointer;
  font-weight: 300;
  fill: #c0c0c0;
}

.node--internal circle {
  fill: #777;
}

.node--internal text {
  text-shadow: 0 1px 0 #242626, 0 -1px 0 #242626, 1px 0 0 #242626,
    -1px 0 0 #242626;
}

.link {
  fill: none;
  stroke-opacity: 0.4;
  stroke-width: 2px;
  transition: all 0.3s;
}
`;

module.exports = { htmlTemplate, script, style };
