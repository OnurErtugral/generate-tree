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
var width = window.innerWidth - 50;
var height = window.innerHeight - 50;

var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(40,0)");

var cluster = d3.tree().size([height, width - 100]);
var root = d3.hierarchy(data, d => d.children);
cluster(root);
var link = svg
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

var node = svg
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

node.append("circle").attr("r", 2.5);

node
  .append("text")
  .attr("dy", 3)
  .attr("x", function(d) {
    return d.children ? -8 : 8;
  })
  .style("text-anchor", function(d) {
    return d.children ? "end" : "start";
  })
  .text(function(d) {
    return d.data.path;
  });

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
