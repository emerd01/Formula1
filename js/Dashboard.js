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
    console.log("grouped length", grouped.length);


    return grouped;
}

var drawLines = function (constructors, target, xScale, yScale) {
    var teams = groupByTeam(constructors)
    var colorScale = d3.scaleOrdinal()
    var lineGenerator = d3.line()
        .x(function (teamYear) {
            return xScale(teamYear.Year)
        })
        .y(function (teamYear) {
            return yScale(teamYear.Points)
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

            d3.select("#team")
                .text(team.Team)

            d3.select("points")
                .text(team.Points)

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
        .datum(function (team) {
            return team
        })
        .attr("d", lineGenerator)




    target
        .selectAll("circle")
        .data(constructors)
        .enter()
        .append("circle")
        .attr("cx", function (race) {
            return xScale(race.Year)
        })
        .attr("cy", function (race) {
            return yScale(race.Points)
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

            d3.select("points")
                .text(race.Points)


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

    var axes = d3.select("#constructorGraph")
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
    var labels = d3.select("#constructorGraph")
        .append("g")
        .classed("labels", true)

    labels.append("text")
        .text("Constructor Points Over Time")
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
var initGraph = function (constructors) {
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

    d3.select("#constructorGraph")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var target = d3.select("#constructorGraph")
        .append("g")
        .attr("id", "constructorCanvas")
        .attr("transform",
            "translate(" + margins.left + "," +
            margins.top + ")");

    var yearStart = 1958
    
    var yearEnd = 2020
    
    d3.select("#allTime")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var yearStart = 1958
        var yearEnd = 2020
        drawAxes(graph, margins, xScale, yScale)
        drawLines(constructors, target, xScale, yScale)
    })
    
    d3.select("#before2010")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var yearStart = 1958
        var yearEnd = 2010
        drawAxes(graph, margins, xScale, yScale)
        drawLines(constructors, target, xScale, yScale)
    })
    
    d3.select("#after2010")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var yearStart = 2010
        var yearEnd = 2020
        drawAxes(graph, margins, xScale, yScale);
        drawLines(constructors, target, xScale, yScale)
        })
    
    
    var xScale = d3.scaleLinear()
        .domain([yearStart, yearEnd])
        .range([0, graph.width])
    

    var yScale = d3.scaleLinear()
        .domain([0, 800])
        .range([graph.height, 0])

    drawAxes(graph, margins, xScale, yScale);
    drawLines(constructors, target, xScale, yScale);
    drawLabels(graph, margins);
    groupByTeam(constructors);
    
    
    
    
    
}

var successFCN = function (values) {
    
    var constructors = values[0]
    
    var colors = values[1]
    
    initGraph(constructors)

}

var failureFCN = function (error) {
    console.log("error", error)
}

var constructorPromise = d3.csv("../constructors.csv")

var colorPromise = d3.csv("../colors.csv")

var constructorPromises = [constructorPromise, colorPromise]

Promise.all(constructorPromises)
    .then(successFCN, failureFCN)

constructorPromise.then(successFCN, failureFCN)