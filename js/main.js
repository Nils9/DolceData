const w = 500;
const h = 500;
const padX = 30;
const padY = 30;
var dataset = [];
var x;
var y;
let clickX;
let clickY;
let firstclick = false;
let canvas = d3.select("#canvas");
var svg = canvas.append("svg").attr("width", w).attr("height", h);
let place = d3.select("#place");
let code = d3.select("#code");
let zone = d3.select("#pop_select");

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
console.log("First row : ", rows[42]);
console.log("Last row : ", rows[1111]);
    }
  x = d3.scaleLinear().domain(d3.extent(rows, (row) => row.long)).range([0, w]);
  y = d3.scaleLinear().domain(d3.extent(rows, (row) => row.lat)).range([h, 0]);
  dataset = rows;
let ff = yearFilter(dataset, 1950, 1995);
let popu = getPopularity(ff, "Redford - Robert");
let award = getNbOfAwards(ff, "Redford - Robert");
let sixSubjects = getSixSubjects(ff, "Redford - Robert");
let director = favoriteDirector(ff, "Redford - Robert");
});

function yearFilter(films, date_min, date_max) {
  let set = [];
  console.log("Year filter " +date_min + " to "+ date_max );

  for(var i = 0; i<films.length; i++) {
  let myear = films[i].year;
    if ((myear<date_max) && (myear>date_min)) {
    set.push(films[i]);
    console.log(films[i]);
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
      if ((mpop<date_max) && (mpop>date_min)) {
        set.push(films[i]);
        console.log(films[i]);
      }
    }
  console.log("-> Total: " + set.length + " films");
  return set;
}

function getPopularity(films, actor) {
  var popu = 0;
  for(var i = 0; i<films.length; i++) {
    if (films[i].actor == actor) {
      popu = popu + films[i].popularity;
    }
  }
  console.log("Popularity of "+ actor +" : " + popu);
  return popu;
}

function getNbOfAwards(films, actor) {
  var n = 0;
  for(var i = 0; i<films.length; i++) {
    if ((films[i].actor == actor) && (films[i].award == "Yes")){
      n = n + 1;
    }
  }
  console.log("Number of Awards "+ actor +" : " + n);
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

function getFilmsPerSubject(films, actor){
  var filmsPerSubject = {"Action":0, "Adventure":0, "Comedy":0, "Crime":0, "Drama": 0, "Fantasy": 0, "Horror": 0, "Music": 0, "Mystery": 0, "Romance": 0, "Science-Fiction": 0, "Short": 0, "War": 0, "Western": 0, "Westerns": 0};
  for(var i = 0; i<films.length; i++) {
    if (films[i].actor == actor) {
      filmsPerSubject[films[i].subject] = filmsPerSubject[films[i].subject]+1;
    }
  }
  return filmsPerSubject;
}

function getSixSubjects(films, actor){
  var dict = getFilmsPerSubject(films, actor)
  var filmsPerSubject = sort_object(dict);
  console.log(filmsPerSubject.slice(0,6));
  return filmsPerSubject.slice(0,6);
}

function getFavoriteSubject(films, actor){
  var dict = getFilmsPerSubject(films, actor)
  var filmsPerSubject = sort_object(dict);
  return filmsPerSubject[0][0];
}

function favoriteDirector(films, actor){
  var directors = {};
  for(var i = 0; i<films.length; i++) {
    if (films[i].actor == actor) {
      if(films[i].director in directors){
        directors[films[i].director] = directors[films[i].director]+1;
      }
      else{
          directors[films[i].director] = 1;
      }
    }
  }
  sortedDirectors = sort_object(directors);
  return sortedDirectors[0][0];
}
