const width = 500;
const height = 700;
const padding = 20;
let dataset;
let i;
let j;
let k;

const svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

d3.json("constellations.json").then(function(data){

    dataset = data.features;

    let zodiacOnly = [];

    for (i = 0; i < data.features.length; i++) {
        if (dataset[i].id == 'Lib' || dataset[i].id == 'Psc' || dataset[i].id == 'Ari' || dataset[i].id == 'Leo' || dataset[i].id == 'Cnc' || dataset[i].id == 'Sco' || dataset[i].id == 'Tau' || dataset[i].id == 'Sgr' || dataset[i].id == 'Gem' || dataset[i].id == 'Vir' || dataset[i].id == 'Cap' || dataset[i].id == 'Aqr') {
            zodiacOnly.push(data.features[i]);
        } else {}
    };

    console.log(zodiacOnly);



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
    .range([padding, height - padding]);

    var g = svg.selectAll(".collection") //<-- group per outer array
                .data(dataset)
                .enter()
                .append("g")
                .attr("class", function(d) {
                    console.log(d.id.includes('Lib'));
                    return d.id;
                });

            g.selectAll("point") //<-- here the nest
                .data(function(d){
                    return d.geometry.coordinates[0]; //<-- this is your array of points
                })
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("cx", function(d) {
                    // return xScale(d.geometry.coordinates[0][0]);
                    return xScale(d[0]);
                })
                .attr("cy", function(d) {
                    // return yScale(d.geometry.coordinates[0][1]);
                    return yScale(d[1]) - 100;
                })
                .attr("fill", "#ffffff")
                .attr("opacity", .75)
                .attr("r", 3)
                .attr("stroke", "none");

    // for (i = 0; i < dataset.length; i++) {

    //     if (dataset[i].geometry.coordinates.length > 1) {
    //         dataset.splice(i,1);
    //     };

    //     for (j = 0; j < dataset[i].geometry.coordinates[0].length; j++) {
   
    //     }


    // }

    


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
