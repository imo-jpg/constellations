const width = 1250;
const height = 500;
const padding = 40;
let allStars = [];
let oneConst = [];
let p = document.getElementsByTagName("p");


const svg = d3.select(".container")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("id", "svg");
    // .attr('transform', 'rotate(90)');

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

    xScale = d3.scaleLinear()
        .domain([
            d3.min(nodes, d => d.star[0]),
            d3.max(nodes, d => d.star[0])
        ])
        .range([width - 2*padding, 2*padding]);
    
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

(async function interactivity() {
    // window.onload = function() {
    //     console.log("hi");
    //     toMobile();
    // };

    await makeChart();

    setTimeout(toMobile(), 1000);

    showHighlighted();

    

    // document.addEventListener("DOMContentLoaded", function(){
    //     toMobile(event);
    // });


    function showHighlighted() {
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
       
        if (thisClass == 'reset') {
            movement(1, [0,0]);
        } else {
            for (e=0; e < allStars.length; e++) {
                if (allStars[e].ident == thisClass) {
                    oneConst.push(allStars[e]);
                }
            }

            let sortedArray = oneConst.sort(function(a, b) {
                return b[0] - a[0];
            });
    
            let median = Math.round((oneConst.length) / 2);
            let middleStarX = xScale((oneConst[median].star[0]));
            let middleStarY = yScale((oneConst[median].star[1]));
            let middleStar = [middleStarX, middleStarY]; 
            movement(2.5, middleStar);
        }  
        oneConst = [];
    }

    const zoom = d3.zoom()
        .scaleExtent([1/2, 4])
        .on("zoom", zoomed);
        
    svg.call(zoom)
    .on("wheel.zoom", null)
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);

    function zoomed() {
        g.attr('transform', d3.event.transform);
    }

    function movement(scaleFactor, middleStar) {
        svg
            .transition()
            .duration(500)
            .call(zoom.transform, d3.zoomIdentity)
            .transition()
            .duration(800)
            .call(zoom.scaleTo, scaleFactor, middleStar);
    }

    function toMobile() {

        container = document.getElementsByClassName("container")[0];
        console.log(container);
        titles = document.getElementsByClassName("titles")[0];
        resetLink = document.getElementById("reset");

        if (screen.width <= 700) {
            
            let newHeight = 3000;
            let newWidth = 700;

            xScale.range([newHeight-padding, padding]);
        
            yScale.range([padding, newWidth-padding]);
            
            svg.attr("height", newHeight + 100).attr("width", "100%");

            g.selectAll("circle")
            .attr("cy", d => xScale(d.star[0]))
            .attr("cx", d => yScale(d.star[1]))
            .attr("fill", "#ffffff")
            .attr("opacity", .75)
            .attr("r", 3)
            .attr("stroke", "none");

            // svg.attr("transform", "translate(0 1250) rotate(90) scale(2.5)");
            // svg.attr("height", "100vh").attr("width", "100%");

            container.classList.add("mobileContainer");
            titles.classList.add("mobile");
            resetLink.classList.add("mobileReset");

            for (let i = 0; i < p.length; i++) {
                p[i].classList.add("mobileTitle");
            }

        container.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            let j = 0;

            for (let i = 1; i < p.length; i ++) {
                if (container.scrollTop > j && container.scrollTop < j + 120) {    
                    p[i].style.fontSize = "60px";
                } else {
                    p[i].style.fontSize = "0px";
                }
                j += 120;
            }
        }
            
        } else {
            svg.attr("transform", "rotate(0)");
            titles.classList.remove("mobile");
            resetLink.classList.remove("mobileReset");
            container.classList.add("mobileContainer");

            for (let i = 0; i < p.length; i++) {
                p[i].classList.remove("mobileTitle");
            }


            //still needto add the stuff here that redraws the stars back to (desktop-sized) normal
          }
    }


})();

