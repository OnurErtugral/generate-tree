const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
  </head>
  <body>
    <div id="canvas"></div>

    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="data.js"></script>
    <script src="script.js"></script>
  </body>
</html>
`;

const script = `
var margin = { top: 10, right: 30, bottom: 30, left: 70 };
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cluster = d3.tree().size([height, width - 200]);
var root = d3.hierarchy(data, d => d.children);
cluster(root);
var drawArea = svg.append("g").classed("drawArea", true);

var link = drawArea
  .append("g")
  .classed("paths", true)
  .selectAll(".link")
  .data(root.descendants().slice(1))
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", d => {
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
  });

var node = drawArea
  .append("g")
  .classed("nodes", true)
  .selectAll(".node")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("class", function(d) {
    return "node" + (d.children ? " node--internal" : " node--leaf");
  })
  .attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")";
  });

node.append("circle").attr("r", 3);

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
  .scaleExtent([1, 4])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on("zoom", updateChart);

//  add an invisible rect
d3.select("svg")
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .call(zoom);

function updateChart() {
  drawArea.attr("transform", d3.event.transform);
}


`;

const style = `body {
  font-family: sans-serif;
}

.node circle {
  fill: #999;
}

.node text {
  font: 12px sans-serif;
  user-select: none;
}

.node--internal circle {
  fill: #555;
}

.node--internal text {
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

.link {
  fill: none;
  stroke: #555;
  stroke-opacity: 0.4;
  stroke-width: 1.5px;
}
`;

module.exports = { htmlTemplate, script, style };
