
const w = 500;
const h = 500;
const padX = 30;
const padY = 30;
let dataset = [];
let x;
let y;
let clickX;
let clickY;
let firstclick = false;

let canvas = d3.select("#canvas");
let svg = canvas.append("svg").attr("width", w).attr("height", h);
let place = d3.select("#place");
let code = d3.select("#code");
let zone = d3.select("#pop_select");

function draw()
{
  svg.selectAll("rect").data(dataset)
  .enter().append("rect")
  .attr("width", (d) => Math.max(2, Math.log10(d.pop))).attr("height", (d) => Math.max(2, Math.log10(d.pop)))
  .attr("x", (d) => x(d.long)).attr("y", (d) => y(d.lat))
  .attr("fill", (d) => d3.rgb(d.dens, 128, 128))
  .on("mouseover", (d) => {place.text("City : " + d.place); code.text("Postal Code : " + d.codeP);})
  .on("mouseout", (d) => {place.text("City : "); code.text("Postal Code : ");});

  svg.append("g").attr("class", "x axis")
  .attr("transform", "translate(0, " + (h-1) + ")")
  .call(d3.axisTop().scale(x));

  svg.append("g").attr("class", "y axis")
  .call(d3.axisRight().scale(y));

  svg.append("rect").attr("id", "rect_sel").attr("style", "stroke: #000000; stroke-width: 3; fill: none;");

  canvas.on("mousedown", function() {
    clickX = d3.mouse(this)[0];
    clickY = d3.mouse(this)[1];
    firstclick = true;
  });

  canvas.on("mouseup", function() {
    if(firstclick)
    {
      firstclick = false;

      var a = Math.min(d3.mouse(this)[0], clickX);
      var b = Math.max(d3.mouse(this)[0], clickX);
      var c = Math.min(d3.mouse(this)[1], clickY);
      var d = Math.max(d3.mouse(this)[1], clickY);

      if(a == b && c == d)
      {
        d3.select("#rect_sel").attr("visibility", "hidden");
        zone.text("Population in the selected zone : " + 0);
        return;
      }

      var total = 0;
      for(var i in dataset)
      {
        var da = dataset[i];
        if(x(da.long) >= a && x(da.long) <= b && y(da.lat) >= c && y(da.lat) <= d)
        {
          total += da.pop;
        }
      }

      zone.text("Population in the selected zone : " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    }
  })

  canvas.on("mousemove", function() {
    if(firstclick)
    {
      d3.select("#rect_sel").attr("visibility", "visible");
      d3.select("#rect_sel").attr("width", Math.abs(d3.mouse(this)[0] - clickX)).attr("height", Math.abs(d3.mouse(this)[1] - clickY))
      .attr("x", Math.min(clickX, d3.mouse(this)[0])).attr("y", Math.min(clickY, d3.mouse(this)[1]));
    }
  });
}

d3.csv("data/film.csv")
.row(function (d) {
  return {
    year: +d["Year"],
    length: +d.Length,
    title: d.Title,
    subject: d.Subject,
    actor: d.Actor,
    director: d.Director,
    actress: d.Actress,
    popularity: +d.Popularity,
    award: d.Awards,
  };
})
.get((error, rows) => {
  //callback
  console.log("Loaded : " + rows.length);
  if(rows.length > 0)
    {
      ;
      console.log("First row : ", rows[42]);
      console.log("Last row : ", rows[1111]);
    }
  x = d3.scaleLinear().domain(d3.extent(rows, (row) => row.long)).range([0, w]);
  y = d3.scaleLinear().domain(d3.extent(rows, (row) => row.lat)).range([h, 0]);
  dataset = rows;
  let ff = yearFilter(dataset, 1975, 1980);
  console.log(ff);
  let person = "Redford - Robert";
  let popu = getPopularity(ff, person);
  console.log("Popularity of "+  person +" : " + popu);
  let award = getNbOfAwards(ff, person);
  let sixSubjects = getSixSubjects(ff, person);
  let director = favoriteDirector(ff, person);
  console.log("Favourite director : " + director);
  console.log("Links of " + director + " :")
  let actor_links = getLinks(ff, director);
  console.log("All Links");
  let links = computeAllLinks(ff);
  console.log(links);
  console.log("All Nodes");
  let nodes = computeAllNodes(ff);
  console.log(nodes);
  //draw();
});

function yearFilter(films, date_min, date_max) {
  let set = [];
  console.log("Year filter " +date_min + " to "+ date_max );
  for(var i = 0; i<films.length; i++) {
    let myear = films[i].year;
    if ((myear<=date_max) && (myear>=date_min)) {
      set.push(films[i]);
    }
  }
  console.log("-> Total: " + set.length + " films");
  return set;
}

function popularityFilter(films, pop_min, pop_max) {
  let set = [];
  console.log("Popularity filter " +pop_min + " to "+ pop_max );
  for(var i = 0; i<films.length; i++) {
    let mpop = films[i].popularity;
    if ((mpop<=pop_max) && (mpop>=pop_min)) {
      set.push(films[i]);

    }
  }
  console.log("-> Total: " + set.length + " films");
  return set;
}


function getPopularity(films, person) {

  var popu = 0;
  for(var i = 0; i<films.length; i++) {
    if ((films[i].actor ==  person)||(films[i].actress ==  person)||(films[i].director ==  person)) {
      popu = popu + films[i].popularity;
    }
  }
  
  return popu;
}


function getNbOfAwards(films, person) {
  var n = 0;
  for(var i = 0; i<films.length; i++) {
    if (((films[i].actor ==  person)||(films[i].actress ==  person)||(films[i].director ==  person)) && (films[i].award == "Yes")){
      n = n + 1;
    }
  }
  console.log("Number of Awards "+ person +" : " + n);
  return n;
}

function sort_object(obj) {
    items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    return(items)
}

function getFilmsPerSubject(films, person){
  var filmsPerSubject = {"Action":0, "Adventure":0, "Comedy":0, "Crime":0, "Drama": 0, "Fantasy": 0, "Horror": 0, "Music": 0, "Mystery": 0, "Romance": 0, "Science-Fiction": 0, "Short": 0, "War": 0, "Western": 0, "Westerns": 0};
  for(var i = 0; i<films.length; i++) {
    if (((films[i].actor ==  person)||(films[i].actress ==  person)||(films[i].director ==  person))) {
      filmsPerSubject[films[i].subject] = filmsPerSubject[films[i].subject]+1;
    }
  }
  return filmsPerSubject;
}

function getSixSubjects(films, person){
  var dict = getFilmsPerSubject(films, person);
  var filmsPerSubject = sort_object(dict);
  //console.log("Person film per subject : " + filmsPerSubject.slice(0,6));
  return filmsPerSubject.slice(0,6);

}

function getFavoriteSubject(films, person){
  var dict = getFilmsPerSubject(films, person)
  var filmsPerSubject = sort_object(dict);
  return filmsPerSubject[0][0];
}

function favoriteDirector(films, person){
  var directors = {};
  for(var i = 0; i<films.length; i++) {
    if ((films[i].actor ==  person)||(films[i].actress ==  person)) {
      if(films[i].director in directors){
        directors[films[i].director] = directors[films[i].director]+1;
      }
      else{
        directors[films[i].director] = 1;
      }
    }
  }
  sortedDirectors = sort_object(directors);
  if (sortedDirectors.length > 0) {
    return sortedDirectors[0][0];
  }

  else {
    return 0;
  }
  
}

function allDirectors(films) {
    var director_set = new Set([]);
  
    for(var i = 0; i<films.length; i++) {
      var dir = films[i].director;
      if (typeof dir === 'undefined' || dir == "" ) {
        // variable is undefined
      }
      else {
        director_set = director_set.add(films[i].director);  
      }
          
    }
    return director_set;
}

function getLinks(films, director){
  var actors = {};
  for(var i = 0; i< films.length; i++) {
    if(films[i].director == director){

      if(films[i].actor in actors ){
        actors[films[i].actor]+=1;
      }
      else{
        actors[films[i].actor]=1;
      }
      if(films[i].actress in actors){
        actors[films[i].actress]+=1;
      }
      else{
        actors[films[i].actress]=1;
      }
    }

  }
  var links = [];
  for(key in actors) {
    link = {"source": director, "target": key, "nbOfFilm": actors[key]};
    links.push(link);
  }
  return links;
}


function computeAllNodes(films) {
  var actors = new Set([]);
  var actresses = new Set([]);
  var directors = new Set([]);
  for (var i = 0; i < films.length; i++) {
    actors.add(films[i].actor);
    actresses.add(films[i].actress);
    directors.add(films[i].director);
  }

  var nodes = [];
  for (let dir of directors) {
    node = {"name": dir, 
            "category": "director", 
            "popularity": getPopularity(films, dir),
            "favSubject": getFavoriteSubject(films, dir)};
    nodes.push(node);
  }

  for (let act of actors) {
    node = {"name": act, 
            "category": "actor", 
            "popularity": getPopularity(films, act),
            "favSubject": getFavoriteSubject(films, act)};
    nodes.push(node);
  }

  for (let act of actresses) {
    node = {"name": act, 
            "category": "actress", 
            "popularity": getPopularity(films, act),
            "favSubject": getFavoriteSubject(films, act)};
    nodes.push(node);
  }

  return nodes;
}


function computeAllLinks(films) {
  var directors = allDirectors(films);
  console.log(directors);
  var links = [];
  for (let dir of directors) {
    var link = getLinks(films, dir);
    links = links.concat(getLinks(films, dir));
  }
  return links; 
}

