// var dataset = [];
// var films = [];
// var person = "De Niro - Robert";

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
  let yearMin =  1960;
  let yearMax = 1997;
  let ff = yearFilter(dataset, yearMin, yearMax);
  console.log(ff);
  
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
  films =ff;
  drawFicheActeur(ff, yearMin, yearMax, person);
  
 
  
});

function yearFilter(films, date_min, date_max) {
  let set = [];
  console.log(date_min + " " + date_max);
  for(var i = 0; i<films.length; i++) {
    let myear = films[i].year;
    if ((myear<=date_max) && (myear>=date_min)) {
      set.push(films[i]);

    }
  }
  console.log(set);
  return set;
}

function popularityFilter(films, pop_min, pop_max) {
  let set = [];
  console.log(pop_min + " " + pop_max);
  for(var i = 0; i<films.length; i++) {
    let mpop = films[i].popularity;
    if ((mpop<=pop_max) && (mpop>=pop_min)) {
      set.push(films[i]);

    }
  }
  console.log(set);
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

function getPopularityPerYear(films, yearMin, yearMax, actor){
  var data = [];
  for(var i = yearMin; i<=yearMax; i++){
    var dict = {};
    dict["x"] = i;
    var filmsOfYear = yearFilter(films, i, i);
    dict["y"] = getPopularity(filmsOfYear, actor);
    data.push(dict);
  }
  return data;
}


function allDirectors(films) {
    var director_set = new Set([]);

    for(var i = 0; i<films.length; i++) {
      var dir = films[i].director;
      if (typeof dir === 'undefined' || dir === "" ) {
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
    if(!dir || 0 === dir.length)
    {
      console.log("director unknown!");
    }
    else
    {
      node = {"name": dir,
              "category": "director",
              "popularity": getPopularity(films, dir),
              "favSubject": getFavoriteSubject(films, dir)};
      nodes.push(node);
    }
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

  var links = [];
  for (let dir of directors) {
    if(!dir || 0 === dir.length)
    {
      console.log("director unknown!");
    }
    else
    {
      var link = getLinks(films, dir);
      links = links.concat(getLinks(films, dir));
    }
  }
  return links;
}
