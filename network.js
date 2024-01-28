import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const nodes = [
    { id: 1, title: "Clinical Domain", group: 1 }, 
    { id: 2, title: "Imaging Technology", group: 2 }, 
    { id: 3, title: "Algorithmic Technology", group: 3 },

    { id: 4, title: "A", group: 1 },
    { id: 5, title: "B", group: 1 },
    { id: 6, title: "C", group: 1 },
    { id: 7, title: "D", group: 1 },
    { id: 8, title: "E", group: 1 },
    { id: 9, title: "F", group: 1 },
    { id: 10, title: "G", group: 1 },

    { id: 11, title: "H", group: 2 },
    { id: 12, title: "I", group: 2 },
    { id: 13, title: "J", group: 2 },
    { id: 14, title: "K", group: 2 },
    { id: 15, title: "L", group: 2 },

    { id: 16, title: "M", group: 3 },
    { id: 17, title: "N", group: 3 },
    { id: 18, title: "O", group: 3 },
    { id: 19, title: "P", group: 3 },
    { id: 20, title: "Q", group: 3 },
    { id: 21, title: "R", group: 3 },
    { id: 22, title: "S", group: 3 },
    { id: 23, title: "T", group: 3 }    
];

const links = [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 1 },

    { source: 1, target: 4 },
    { source: 1, target: 5 },
    { source: 1, target: 6 },
    { source: 1, target: 7 },
    { source: 1, target: 8 },
    { source: 1, target: 9 },
    { source: 1, target: 10 },

    { source: 2, target: 11 },
    { source: 2, target: 12 },
    { source: 2, target: 13 },
    { source: 2, target: 14 },
    { source: 2, target: 15 },

    { source: 3, target: 16 },
    { source: 3, target: 17 },
    { source: 3, target: 18 },
    { source: 3, target: 19 },
    { source: 3, target: 20 },
    { source: 3, target: 21 },
    { source: 3, target: 22 },
    { source: 3, target: 23 }
];

let width = window.innerWidth;
let height = window.innerHeight;

let nodeRadiusCenter = width / 25;
let nodeRadius = width / 50;
let linkDistanceCenter = width;
let linkDistance = width / 10;

let padding = 20;

// Specify the color scale.
const color = d3.scaleOrdinal(d3.schemeCategory10);

const collideForce = d3.forceCollide(d => (d.id === 1 || d.id === 2 || d.id === 3) ? nodeRadiusCenter + padding : nodeRadius + padding);

const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(link => {
        // Check if the link is between nodes 1-3
        if ((link.source.id === 1 || link.source.id === 2 || link.source.id === 3) &&
            (link.target.id === 1 || link.target.id === 2 || link.target.id === 3)) {
            return linkDistanceCenter;
        } else {
            return linkDistance;
        }
    });



// Create a simulation with several forces.
const simulation = d3.forceSimulation(nodes)
    .force("link", linkForce)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", collideForce) // Add the forceCollide
    .on("tick", ticked);

simulation.force("radial", d3.forceRadial(d => {
        return d.id !== 1 && d.id !== 2 && d.id !== 3 ? 250 : 0; // Push nodes away if they are not in groups 1-3
    }, width / 2, height / 2).strength(.5)); // Adjust the strength and radius as needed
    
// simulation.force("customRepulsion", customRepulsion(0.05)) // Add the custom force with a strength factor


var svg = d3.select("#network")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Add a line for each link, and a circle for each node.
const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", d => (d.id === 1 || d.id === 2 || d.id === 3) ? nodeRadiusCenter : nodeRadius)
    .style("opacity", 0.60)  // Set the node transparency
    .attr("fill", d => color(d.group))
    .on("mouseenter", mouseEnter)
    .on("mouseleave", mouseLeave)

const labels = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .text(d => d.title)
    .style("visibility", d => (d.id === 1 || d.id === 2 || d.id === 3) ? "visible" : "hidden")
    .style("font-size", "20px")  // Match <p> font-size
    .style("font-weight", "bold")  // Make the font bold
    .style("text-anchor", "middle")  // Center the text horizontally
    .attr("dy", ".35em") // Vertically align text. Adjust as needed
    .attr("x", 0)
    .attr("y", 0)
    .on("mouseenter", mouseEnter)
    .on("mouseleave", mouseLeave)

    // Function to apply a small perturbation to node positions
function animateGraph() {
    let amplitude = 10; // Amplitude of the oscillation

    // Calculate new center coordinates, for example, a gentle oscillation
    const newCenterX = width / 2 + Math.sin(Date.now() / 1000) * amplitude; // 20 is the amplitude
    const newCenterY = height / 2 + Math.cos(Date.now() / 1000) * amplitude; // Oscillate in both X and Y

    // Update the center force
    simulation.force("center", d3.forceCenter(newCenterX, newCenterY));
    simulation.alpha(0.3).restart(); // Restart the simulation with a small alpha

}

// Start the animation with an interval
d3.interval(animateGraph, 0.5);

function mouseEnter(event, d) {
    const enlargedRadius = (d.id === 1 || d.id === 2 || d.id === 3) ? nodeRadiusCenter * 2 : nodeRadius * 2;

    d3.select(this)
      .transition()
      .duration(150)
      .attr("r", enlargedRadius)  // Enlarge radius on hover
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 1.5);
    // Additional actions on mouse enter, if any

    d3.select("#info-box").text(`Hovering over node: ${d.title}`);

    // if (d.id > 3 || d.group === 1) {
    //     d3.selectAll(".labels text")
    //         .filter(label => label.group === d.group)
    //         .style("visibility", "visible");
    // }

}

function mouseLeave(event, d) {
    const originalRadius = (d.id === 1 || d.id === 2 || d.id === 3) ? nodeRadiusCenter : nodeRadius;

    d3.select(this)
      .transition()
      .duration(150)
      .attr("r", originalRadius)  // Return to original radius
    //   .attr("stroke", null)
    //   .attr("stroke-width", null);
    // Additional actions on mouse leave, if any

    d3.select("#info-box").text("Hover over a node...");

    // if (d.id > 3 || d.group === 1) {
    //     d3.selectAll(".labels text")
    //         .filter(label => label.group === d.group)
    //         .style("visibility", "hidden");
    // }

}

// Set the position attributes of links and nodes each time the simulation ticks.
function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);


    labels
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

}

function resizeGraph() {
    width = window.innerWidth;
    height = window.innerHeight;

    svg.attr("width", width)
       .attr("height", height);

    simulation.force("center", d3.forceCenter(width / 2, height / 2))
              .alpha(1).restart(); // Restart the simulation for the new size
}

// Add resize event listener
window.addEventListener('resize', resizeGraph);
