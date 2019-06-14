var dataset = [ 3, 10, 2 ];
var dataset2 = [ 5, 4, 12 ];

const sum = dataset.reduce(function(a, b) {return a + b;});
const sum2 = dataset2.reduce(function(a, b) {return a + b;});

// Largeur et hauteur
var w = 50*dataset.length;
var h = 100;
var margin = { top: 10, right: 0, bottom: 10, left: 0};
var step = (w-40*dataset.length)/dataset.length;

// Crée l'élément SVG
var svg1 = d3.select("#haut")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "red");

var svg2 = d3.select("#bas")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "blue")
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

var svg3 = d3.select("#actor")
            .append("svg")
            .attr("width", w-step)
            .attr("height", 20+margin.top+margin.bottom)
            .append("rect")
            .attr("width", w-step)
            .attr("height", 20+margin.top+margin.bottom)
            .style("fill", "black")
            .attr('transform', `translate(${margin.left}, ${margin.top})`);


svg1.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {return i * w/dataset.length;})
    .attr("y", function(d) {return h-d*100/sum;})
    .attr("width", 40)
    .attr("height", function(d) {return d*100/sum;})
    .text(function(d) {
        return d;
   });

svg2.selectAll("rect")
    .data(dataset2)
    .enter()
    .append("rect")
    .attr("x", function(d, j) {return j * w/dataset2.length;})
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", function(d) {return d*100/sum;})

svg1.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
        return Math.round(d*100/sum);
   })
   .attr("x", function(d, i) {
        return i * (w / dataset.length)+14;
   })
   .attr("y", function(d) {
        return h-d*100/sum+10;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "15px")
   .attr("fill", "white");

svg2.selectAll("text")
  .data(dataset2)
  .enter()
  .append("text")
  .text(function(d) {
       return Math.round(d*100/sum);
  })
  .attr("x", function(d, i) {
       return i * (w / dataset2.length) + 14;
  })
  .attr("y", function(d) {
       return d*100/sum;
  })
  .attr("font-family", "sans-serif")
   .attr("font-size", "15px")
   .attr("fill", "white");
