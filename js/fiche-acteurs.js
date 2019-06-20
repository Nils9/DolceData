var dataset = [["Western", 3], ["Adventure", 10], ["Crime", 2]];
var dataset2 = [["Fantasy", 5], ["Horror", 4], ["Music", 12]];
var nbAwards = 4;
var favoriteDirector = "Pedro Almodovar"
var favoriteActress = "Pénélope Cruz"

var nb = []
for (i = 0; i < dataset.length; i++) {
  nb.push(dataset[i][1]);
}
var nb2 = []
for (i = 0; i < dataset2.length; i++) {
  nb2.push(dataset2[i][1]);
}

const sum = nb.reduce(function(a, b) {return a + b;});
const sum2 = nb2.reduce(function(a, b) {return a + b;});


// Largeur et hauteur
var w = 50*dataset.length;
var h = 100;
var margin = { top: 10, right: 0, bottom: 10, left: 0};
var step = (w-40*dataset.length)/dataset.length;
var colors = {"Action":"darkslategray", "Adventure":"darkgoldenrod", "Comedy":"darkorchid", "Crime":"crimson", "Drama":"darkolivegreen", "Fantasy":"chartreuse", "Horror":"deeppink", "Music":"chocolate", "Mystery":"azure", "Romance":"palevioletred", "Science Fiction":"lightseagreen", "Short":"coral", "War":"olive",  "Western":"khaki", "Westerns":"khaki"}

// Crée l'élément SVG
var svg1 = d3.select("#haut")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

var svg2 = d3.select("#bas")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
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

var name = svg3.append("text")
.text("Antonio Banderas")
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "white");

for (i = 0; i < nbAwards; i++) {
  var cups = d3.select("#coupe")
  .append("object")
  .attr("data", "coupe.svg")
  .attr("y", 400)
  .attr("width", 50)
  .attr("height", 50+margin.top+margin.bottom)
  .attr('transform', `translate(${margin.top})`)
  .attr("type", "image/svg+xml");
}

var favoriteText1 = d3.select("#fetiche1")
.append("text")
.attr("y", 400)
.text("Réalisateur fétiche: "+ favoriteDirector)
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "red");

var favoriteText2 = d3.select("#fetiche2")
.append("text")
.attr("y", 400)
.text("Actrice fétiche: "+ favoriteActress)
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "red");


svg1.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {return i * w/dataset.length;})
    .attr("y", function(d) {return h-d[1]*100/sum;})
    .attr("width", 40)
    .attr("height", function(d) {return d[1]*100/sum;})
    .attr('fill', function(d) { return colors[d[0]];})
    .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration('200')
               .attr('opacity', '.40')})
     .on('mouseout', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')});

svg2.selectAll("rect")
    .data(dataset2)
    .enter()
    .append("rect")
    .attr("x", function(d, j) {return j * w/dataset2.length;})
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", function(d) {return d[1]*100/sum;})
    .attr('fill', function(d) { return colors[d[0]];})
    .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.40')})
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
             .duration('50')
             .attr('opacity', '1')});