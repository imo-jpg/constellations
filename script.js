const width = 500;
const height = 500;
const padding = 20;
let dataset;
let i;
let j;
let k;

const svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

// async function parseData() {
//     let parsedData = await d3.json("constellations.json");
//     return parsedData;
// }

d3.json("constellations.json").then(function(data){

    dataset = data.features;

    xScale = d3.scaleLinear()
    .domain([
        d3.min(dataset, function(d) {
            return d3.min(d.geometry.coordinates[0][0]);
        }),
        d3.max(dataset, function(d) {
            return d3.max(d.geometry.coordinates[0][0]);
        }),
    ])
    .range([padding, width - padding]);

    yScale = d3.scaleLinear()
    .domain([
        d3.min(dataset, function(d) {
            return d3.min(d.geometry.coordinates[0][1]);
        }),
        d3.max(dataset, function(d) {
            return d3.max(d.geometry.coordinates[0][1]);
        }),
    ])
    .range([padding, width - padding]);

    var g = svg.selectAll(".collection") //<-- group per outer array
                .data(dataset)
                .enter()
                .append("g")
                .attr("class", "collection");

            g.selectAll("point") //<-- here the nest
                .data(function(d){
                    console.log(d);
                    return d.geometry.coordinates[0]; //<-- this is your array of points
                })
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", function(d) {
                    // return xScale(d.geometry.coordinates[0][j][0]);
                    return xScale(d[0]);
                })
                .attr("cy", function(d) {
                    // return yScale(d.geometry.coordinates[0][j][1]);
                    return yScale(d[1]);

                })
                .attr("r", 3)
                .attr("opacity", .75)
                .attr("fill", "#ffffff")
                .attr("stroke", "none");

    for (i = 0; i < dataset.length; i++) {

        if (dataset[i].geometry.coordinates.length > 1) {
            dataset.splice(i,1);
        };

        
        // console.log(dataset[i].geometry.coordinates[0].length);
        // console.log(dataset[i]);

        for (j = 0; j < dataset[i].geometry.coordinates[0].length; j++) {
            // console.log(j);

            //I think this isn't working because of the way d3 binds data. A for loop probably won't work.
            //It looks like maybe I'd have to create a bunch of non-nested arrays for each of the coordinate pairs?
            //And then run the below code again?
            // svg.selectAll("circle")
            //     .data(dataset)
            //     .enter()
            //     .append("circle")
            //     .attr("cx", function(d) {
            //         return xScale(d.geometry.coordinates[0][j][0]);
            //     })
            //     .attr("cy", function(d) {
            //         return xScale(d.geometry.coordinates[0][j][1]);
            //     })
            //     .attr("r", 3)
            //     .attr("opacity", .75)
            //     .attr("fill", "#ffffff")
            //     .attr("stroke", "none");
   
        }


    }

    


});

// console.log(document.getElementsByTagName("circle"));

// yScale = d3.scaleLinear()
//     .domain([
//         d3.min(dataset[i].geometry.coordinates[j], function(d) {
//             return d[1];
//         }),
//         d3.max(dataset[i].geometry.coordinates[j], function(d) {
//             return d[1];
//         }), 
//     ])
//     .range([height - padding, padding]);

// yScale = d3.scaleLinear()
//         .domain([
//             d3.min(dataset, function(d) {
//                 // console.log(d.geometry.coordinates);
//                 return d.geometry.coordinates[0][0][1];
//             }),
//             d3.max(dataset, function(d) {
//                 return d.geometry.coordinates[0][0][1];
//             }), 
//         ])
//         .range([height - padding, padding]);

// xScale = d3.scaleLinear()
//     .domain([
//         d3.min(dataset, function(d) {
//             // console.log(d.geometry.coordinates);
//             return d.geometry.coordinates[0][0][0];
//         }),
//         d3.max(dataset, function(d) {
//             return d.geometry.coordinates[0][0][0];
//         }), 
//     ])
//     .range([padding, width - padding]);

// svg.selectAll("circle")
                //     .data(dataset[i].geometry.coordinates)
                //     .enter()
                //     .append("circle")
                //     .attr("cx", function(d) {
                //         // console.log(dataset);
                //         return xScale(d[j][0]);
                //     })
                //     .attr("cy", function(d) {
                //         // console.log((d[j][k]));
                //         return yScale(d[j][1]);
                //     })
                //     .attr("r", 3)
                //     .attr("opacity", .75)
                //     .attr("fill", "#ffffff")
                //     .attr("stroke", "none");
