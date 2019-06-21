//create somewhere to put the force directed graph
var svg_graph = d3.select("#graph"),
 width = +svg_graph.attr("width"),
 height = +svg_graph.attr("height");

//d3 code goes here

//Characters
var nodes_data =  [
    {"name": "Lillian", "sex": "F"},
    {"name": "Gordon", "sex": "M"},
    {"name": "Sylvester", "sex": "M"},
    {"name": "Mary", "sex": "F"},
    {"name": "Helen", "sex": "F"},
    {"name": "Jamie", "sex": "M"},
    {"name": "Jessie", "sex": "F"},
    {"name": "Ashton", "sex": "M"},
    {"name": "Duncan", "sex": "M"},
    {"name": "Evette", "sex": "F"},
    {"name": "Mauer", "sex": "M"},
    {"name": "Fray", "sex": "F"},
    {"name": "Duke", "sex": "M"},
    {"name": "Baron", "sex": "M"},
    {"name": "Infante", "sex": "M"},
    {"name": "Percy", "sex": "M"},
    {"name": "Cynthia", "sex": "F"}
]

//Relationships
//type: A for Ally, E for Enemy
var links_data = [
    {"source": "Sylvester", "target": "Gordon", "type":"A" },
    {"source": "Sylvester", "target": "Lillian", "type":"A" },
    {"source": "Sylvester", "target": "Mary", "type":"A"},
    {"source": "Sylvester", "target": "Jamie", "type":"A"},
    {"source": "Sylvester", "target": "Jessie", "type":"A"},
    {"source": "Sylvester", "target": "Helen", "type":"A"},
    {"source": "Helen", "target": "Gordon", "type":"A"},
    {"source": "Mary", "target": "Lillian", "type":"A"},
    {"source": "Ashton", "target": "Mary", "type":"A"},
    //{"source": "Duncan", "target": "Jamie", "type":"A"},
    {"source": "Gordon", "target": "Jessie", "type":"A"},
    {"source": "Sylvester", "target": "Fray", "type":"E"},
    {"source": "Fray", "target": "Mauer", "type":"A"},
    {"source": "Fray", "target": "Cynthia", "type":"A"},
    {"source": "Fray", "target": "Percy", "type":"A"},
    {"source": "Percy", "target": "Cynthia", "type":"A"},
    {"source": "Infante", "target": "Duke", "type":"A"},
    {"source": "Duke", "target": "Gordon", "type":"A"},
    {"source": "Duke", "target": "Sylvester", "type":"A"},
    {"source": "Baron", "target": "Duke", "type":"A"},
    {"source": "Baron", "target": "Sylvester", "type":"E"},
    {"source": "Evette", "target": "Sylvester", "type":"E"},
    {"source": "Cynthia", "target": "Sylvester", "type":"E"},
    {"source": "Cynthia", "target": "Jamie", "type":"E"},
    {"source": "Mauer", "target": "Jessie", "type":"E"}
]

//set up the simulation
//nodes only for now
var simulation = d3.forceSimulation()
              .nodes(nodes_data);

//add forcess
//we're going to add a charge to each node
//also going to add a centering force
simulation
    .force("charge_force", d3.forceManyBody().strength(-500))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2));

var radius = 20;

//draw circles for the F
var node = svg_graph.append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(nodes_data)
        .enter()
        .append("rect")
        .attr("width", radius)
        .attr("height", radius)
        .attr("rx", d => d.sex == "M" ? 100 : 0)
        .attr("fill", rectColour)
        .on("click", handleClick)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

var lastCircle = null;

function handleClick(d, i) {  // Add interactivity
      if(lastCircle != null)
      {
          d3.select(lastCircle).attr("fill", "blue");
      }

      if(this == lastCircle)
      {
        d3.select(lastCircle).attr("fill", "blue");
        lastCircle = null;
      }
      else
      {
        // Use D3 to select element, change color and size
        d3.select(this).attr("fill", "orange");
        lastCircle = this;
      }
    }

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
    // Specify where to put label of text
    svg_graph.append("text").attr("id", "t" + i).attr("x", function() { return d.x - 30; }).attr("y", function() { return d.y - 15; })
    .text(d.name);
  }

function handleMouseOut(d, i) {
    // Select text by id and then remove
    d3.select("#t" + i).remove();  // Remove text location
  }


//Function to choose what color circle we have
//Let's return blue for males and red for females
function rectColour(d){
    if(d.sex =="M"){
        return "blue";
    } else {
        return "blue";
    }
}


function tickActions() {
    //update circle positions to reflect node updates on each tick of the simulation
    node.attr("x", function(d) { return d.x-radius/2; })
        .attr("y", function(d) { return d.y-radius/2; })
  }



simulation.on("tick", tickActions );

//Create the link force
//We need the id accessor to use named sources and targets
var link_force =  d3.forceLink(links_data)
                        .id(function(d) { return d.name; })

simulation.force("links",link_force)

//draw lines for the links
var link = svg_graph.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(links_data)
    .enter().append("line")
      .attr("stroke-width", 2)
      .style("stroke", linkColour);


//Function to choose the line colour and thickness
//If the link type is "A" return green
//If the link type is "E" return red
function linkColour(d){
    if(d.type == "A"){
        return "green";
    } else {
        return "green";
    }
}


// The complete tickActions function
function tickActions() {
    //update circle positions each tick of the simulation
    node
        .attr("x", function(d) { return d.x-radius/2; })
        .attr("y", function(d) { return d.y-radius/2; });

    //update link positions
    //simply tells one end of the line to follow one node around
    //and the other end of the line to follow the other node around
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

//create drag handler with d3.drag()
var drag_handler = d3.drag()
    .on("start", drag_start)
    .on("drag", drag_drag)
    .on("end", drag_end);

function drag_start(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function drag_drag(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

var fixedNodes = [];

function drag_end(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = d.x;
  d.fy = d.y;
  fixedNodes.push(d);
}

document.getElementById('body').addEventListener('keydown', (e) => {
    if(e.key == "r")
    {
      console.log(fixedNodes);
      for(d in fixedNodes)
      {
        fixedNodes[d].fx = null;
        fixedNodes[d].fy = null;
        console.log(d);
      }

      fixedNodes = [];

      console.log(fixedNodes);
    }
});


//apply the drag_handler to our circles
drag_handler(node);
drag_handler(link);
