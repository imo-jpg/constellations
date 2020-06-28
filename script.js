const width = 1250;
const height = 500;
const padding = 40;
let allStars = [];
const oneConst = [];

const svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("id", "svg");

const g = svg.append("g")
    .attr("id", "g");

async function makeChart() {
    let data = await d3.json("constellations.json");
    await addStars(data);
    await mapStars(allStars);
}

async function addStars(data) {

    let dataset = data.features;

    let zodiacOnly = [];

    for (let i = 0; i < data.features.length; i++) {
        if (dataset[i].id == 'Lib' || dataset[i].id == 'Psc' || dataset[i].id == 'Ari' || dataset[i].id == 'Leo' || dataset[i].id == 'Cnc' || dataset[i].id == 'Sco' || dataset[i].id == 'Tau' || dataset[i].id == 'Sgr' || dataset[i].id == 'Gem' || dataset[i].id == 'Vir' || dataset[i].id == 'Cap' || dataset[i].id == 'Aqr') {
            zodiacOnly.push(data.features[i]);
        } else {}
    };
    
    let starID = {};

    for (let h = 0; h < zodiacOnly.length; h ++) {
        for (let i = 0; i < zodiacOnly[h].geometry.coordinates.length; i++) {
            for (let j = 0; j < zodiacOnly[h].geometry.coordinates[i].length; j++) {
                const star = zodiacOnly[h].geometry.coordinates[i][j];
                const ident = zodiacOnly[h].id;
                starID = {
                    "star": star,
                    "ident": ident
                };
                allStars.push(starID);
            }
        }
    }
}

async function mapStars(nodes) {

    console.log("clicked");
    xScale = d3.scaleLinear()
        .domain([
            d3.min(nodes, d => d.star[0]),
            d3.max(nodes, d => d.star[0])
        ])
        .range([width - padding, padding]);
    
    yScale = d3.scaleLinear()
        .domain([
            d3.min(nodes, d => d.star[1]),
            d3.max(nodes, d => d.star[1])
        ])
        .range([height-2*padding, 2*padding]);

    // nodes.forEach(function(d){
    //     d.star[0] = xScale(d.star[0]);
    //     d.star[1] = yScale(d.star[1]);
    // });

    g.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", d => d.ident)
        .attr("cx", d => xScale(d.star[0]))
        .attr("cy", d => yScale(d.star[1]))
        .attr("fill", "#ffffff")
        .attr("opacity", .75)
        .attr("r", 3)
        .attr("stroke", "none");
}

(async () => {
    await makeChart();
    
    showHighlighted();

    function showHighlighted() {
        p = document.getElementsByTagName("p");
        for (var i = 0, len = p.length; i < len; i++) {
            p[i].addEventListener("mouseover", (e) => highlight(e));
            p[i].addEventListener("mouseleave", (e) => remove(e));
            p[i].addEventListener("click", (e) => zoomIn(e));
        }
    }

    function highlight(event) {
        thisClass = event.currentTarget.id;
        theseStars = document.getElementsByClassName(`${thisClass}`);
        for (let k = 0; k < theseStars.length; k++) {
            theseStars[k].classList.add("highlight");
        };
    }

    function remove(event) {
        thisClass = event.currentTarget.id;
        theseStars = document.getElementsByClassName(`${thisClass}`);
        for (let k = 0; k < theseStars.length; k++) {
            theseStars[k].classList.remove("highlight");        
        };
    }

    function zoomIn(event) {
        thisClass = event.currentTarget.id;
        for (e=0; e < allStars.length; e++) {
            if (allStars[e].ident == thisClass) {
                oneConst.push(allStars[e]);
            }
        }
        const median = Math.round((oneConst.length) / 2);
        const middleStarX = xScale(oneConst[median].star[0]);
        const middleStarY = yScale(oneConst[median].star[1]);
        const middleStar = [middleStarX, middleStarY]; 
        transition(middleStar);  
    }
    
    const zoom = d3.zoom()
        .on("zoom", zoomed);
        
    svg.call(zoom)
    .on("wheel.zoom", null);;

    function zoomed() {
    g.attr('transform', `translate(${d3.event.transform.x},  	 ${d3.event.transform.y}) scale(${d3.event.transform.k})`);
    }

    function transition(zoomPoint) {
        svg.transition()
            .duration(700)
            .call(zoom.scaleBy, 2.5, zoomPoint);
    }


})();

