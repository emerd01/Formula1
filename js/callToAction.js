var groupByTeam = function (cars) {
    var keys = [];
    var dict = {};


    cars.forEach(function (car) {
        if (dict[car.Team]) {
            dict[car.Team].push(car);
        } else {
            dict[car.Team] = [car];
            keys.push(car.Team);
        }
    })

    var grouped = keys.map(function (key) {
        return dict[key];
    })

    console.log("grouped", grouped);

    return grouped;
}

var drawLines = function (positions, target, xScale, yScale) {
    var teams = groupByTeam(positions)
    var lineGenerator = d3.line()
        .x(function (teamYear) {
            return xScale(teamYear.Year)
        })
        .y(function (teamYear) {
            return yScale(teamYear.Position)
        })
        .curve(d3.curveCardinal)
        
    var lines = target
        .selectAll("g")
        .data(teams)
        .enter()
        .append("g")
        .classed("line", true)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 10)
        .on("mouseover", function (team) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)

                d3.select(this)
                    .classed("selected", true)
                    .raise()


            }
            var xPos = d3.event.pageX;
            var yPos = d3.event.pageY;

            d3.select("#tooltip")
                .classed("hidden", false)
                .style("top", yPos + "px")
                .style("left", xPos + "px")

        })
        .on("mouseout", function (team) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)
            }
            d3.select("#tooltip")
                .classed("hidden", true)



        })


    lines.append("path")
        .datum(function(team){
        return team
    })
        .attr("d", lineGenerator)

    


    target
        .selectAll("circle")
        .data(positions)
        .enter()
        .append("circle")
        .attr("cx", function (race) {
            return xScale(race.Year)
        })
        .attr("cy", function (race) {
            return yScale(race.Position)
        })
        .attr("r", 2.5)
        .on("mouseenter", function (race) {

            var xPos = d3.event.pageX;
            var yPos = d3.event.pageY;

            d3.select("#tooltip")
                .classed("hidden", false)
                .style("top", yPos + "px")
                .style("left", xPos + "px")

            d3.select("#team")
                .text(race.Team)

            d3.select("position")
                .text(race.Position)


        }) //tool tip off
        .on("mouseleave", function () {
            d3.select("#tooltip")
                .classed("hidden", true);
        })



}



var makeTranslateString = function (x, y) {
    return "translate(" + x + "," + y + ")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function (graphDim, margins, xScale, yScale) {

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("d"))

    var yAxis = d3.axisLeft()
        .scale(yScale)

    var axes = d3.select("svg")
        .append("g")
    axes.append("g")
        .attr("transform", makeTranslateString(margins.left, margins.top + graphDim.height))
        .call(xAxis)
    axes.append("g")
        .attr("transform", makeTranslateString(margins.left, margins.top))
        .call(yAxis)

}

//graphDim -object that stores dimensions of the graph area
//margins - object that stores the size of the margins
var drawLabels = function (graphDim, margins) {
    var labels = d3.select("svg")
        .append("g")
        .classed("labels", true)

    labels.append("text")
        .text("Point Distribution Over Time")
        .classed("title", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graphDim.width / 2))
        .attr("y", margins.top - 10)
    labels.append("text")
        .text("Years")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("x", margins.left + (graphDim.width / 2))
        .attr("y", graphDim.height + 85)

    labels.append("g")
        .attr("transform", "translate(0," +
            ((graphDim.height / 2)) + ")")
        .append("text")
        .text("Points")
        .classed("label", true)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
}


//sets up several important variables and calls the functions for the visualization.
var initGraph = function (positions) {
    //size of screen
    var screen = {
        width: 800,
        height: 700
    }
    //how much space on each side
    var margins = {
        left: 35,
        right: 20,
        top: 50,
        bottom: 50
    }



    var graph = {
        width: screen.width - margins.left - margins.right,
        height: screen.height - margins.top - margins.bottom
    }
    console.log(graph);

    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var target = d3.select("svg")
        .append("g")
        .attr("id", "graph")
        .attr("transform",
            "translate(" + margins.left + "," +
            margins.top + ")");


    var xScale = d3.scaleLinear()
        .domain([1950, 2020])
        .range([0, graph.width])

    var yScale = d3.scaleLinear()
        .domain([0, 25])
        .range([graph.height, 0])

    drawAxes(graph, margins, xScale, yScale);
    drawLines(positions, target, xScale, yScale);
    drawLabels(graph, margins);
    groupByTeam(positions)

}

var successFCN = function (values) {
    var scoring  = values[0]
    
    var colors = values[1]
    
    console.log("scoring", scoring)
    initGraph(scoring)

}

var failureFCN = function (error) {
    console.log("error", error)
    setBanner("positions not found")
}

var scoringPromise = d3.csv("../scoring.csv")

var colorPromise = d3.csv("../colors.csv")

var promises = [scoringPromise, colorPromise]

Promise.all(promises)
.then(successFCN, failureFCN)

constructorPromise.then(successFCN, failureFCN)


