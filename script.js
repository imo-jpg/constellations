const width = 1200;
const height = 1000;
const padding = 40;

const svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

d3.json("constellations.json").then(function(data){

    let dataset = data.features;

    let zodiacOnly = [];

    for (let i = 0; i < data.features.length; i++) {
        if (dataset[i].id == 'Lib' || dataset[i].id == 'Psc' || dataset[i].id == 'Ari' || dataset[i].id == 'Leo' || dataset[i].id == 'Cnc' || dataset[i].id == 'Sco' || dataset[i].id == 'Tau' || dataset[i].id == 'Sgr' || dataset[i].id == 'Gem' || dataset[i].id == 'Vir' || dataset[i].id == 'Cap' || dataset[i].id == 'Aqr') {
            zodiacOnly.push(data.features[i]);
        } else {}
    };

    xScale = d3.scaleLinear()
        .domain([
            d3.min(zodiacOnly, function(d) {
                return d3.min(d.geometry.coordinates[0][0]);
            }),
            d3.max(zodiacOnly, function(d) {
                return d3.max(d.geometry.coordinates[0][0]);
            }),
        ])
        .range([padding, width - padding]);

    yScale = d3.scaleLinear()
        .domain([
            d3.min(zodiacOnly, function(d) {
                return d3.min(d.geometry.coordinates[0][1]);
            }),
            d3.max(zodiacOnly, function(d) {
                return d3.max(d.geometry.coordinates[0][1]);
            }),
        ])
        .range([padding, height - padding]);

    const collection = svg.selectAll(".collection") //<-- the outer array
        .data(zodiacOnly)
        .enter()
        .append("g")
        .attr("class", d => d.id);

    collection.selectAll("point") //<-- here the nest
        .data(d => d.geometry.coordinates[0]) //<-- the points within the inner array in that outer array
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("fill", "#ffffff")
        .attr("opacity", .75)
        .attr("r", 3)
        .attr("stroke", "none");
    
    let nodes = [];    
    let starID = {};
    console.log(zodiacOnly);

    for (let h = 0; h < zodiacOnly.length; h ++) {
        for (let i = 0; i < zodiacOnly[h].geometry.coordinates.length; i++) {
            for (let j = 0; j < zodiacOnly[h].geometry.coordinates[i].length; j++) {
                const star = zodiacOnly[h].geometry.coordinates[i][j];
                const ident = zodiacOnly[h].id;
                starID = {
                    "star": star,
                    "ident": ident
                };
                console.log(starID);
                nodes.push(starID);
            }
        }
    }

    console.log(nodes);

    nodes.forEach(function(d){
        d.star[0] = xScale(d.star[0]);
        d.star[1] = yScale(d.star[1]);
    });

    for (let k = 0; k < nodes.length; k++) {

        const link = d3.linkHorizontal()({
            source: nodes[k].star,
            target: nodes[k+1].star
            });
            
        //   Append the link to the svg element
        svg.append('path')
            .attr('d', link)
            .attr('stroke', 'white')
            .attr('fill', 'none'); 
    }

    return svg.node();

});