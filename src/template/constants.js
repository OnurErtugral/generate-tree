const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
var width = Math.min( window.innerWidth - 50 , 1200);
var height = window.innerHeight - 50;

var svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(40,0)");

var cluster = d3.cluster().size([height, width - 100]);
var root = d3.hierarchy(data, d => d.children);
cluster(root);

svg
  .selectAll("path")
  .data(root.descendants().slice(1))
  .enter()
  .append("path")
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
  })
  .style("fill", "none")
  .attr("stroke", "#ccc");

svg
  .selectAll("g")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("transform", d => "translate(" + d.y + "," +  d.x + ")")
  .append("circle")
  .attr("r", 7)
  .style("fill", "#69b3a2")
  .attr("stroke", "black")
  .style("stroke-width", 2);
`;

module.exports = { htmlTemplate, script };
