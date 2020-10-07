var groupByCompetitor = function (cars) {
    var keys = [];
    var dict = {};


    cars.forEach(function (car) {
        if (dict[car.Name]) {
            dict[car.Name].push(car);
        } else {
            dict[car.Name] = [car];
            keys.push(car.Name);
        }
    })

    var grouped = keys.map(function (key) {
        return dict[key];
    })

    console.log("grouped", grouped);

    return grouped;
}

var drawLines3 = function (drivers, target, xScale, yScale) {
    var competitors = groupByCompetitor(drivers)
    var lineGenerator = d3.line()
        .x(function (driverYear) {
            return xScale(driverYear.Year)
        })
        .y(function (driverYear) {
            return yScale(driverYear.Points)
        })
        .curve(d3.curveCardinal)
    
    //trying to add vertical line at 2010 for graph, but nothing is showing up
    target.append("line")
        .attr("x1", 2010)
        .attr("y1", 0)
        .attr("x2", 2010)
        .attr("y2", 450)
        .style("stroke","red")
        .style("stroke-width", 2)
        .style("fill", "none")
        
    

    var lines = target
        .selectAll("g")
        .data(competitors)
        .enter()
        .append("g")
        .classed("line", true)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 10)
        .on("mouseover", function (driver) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)

                d3.select(this)
                    .classed("selected", true)
                    .raise()

                d3.select("#name")
                    .text(driver.Name)


            }
            var xPos = d3.event.pageX;
            var yPos = d3.event.pageY;

            d3.select("#tooltip")
                .classed("hidden", false)
                .style("top", yPos + "px")
                .style("left", xPos + "px")

        })
        .on("mouseout", function (driver) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)
            }
            d3.select("#tooltip")
                .classed("hidden", true)

        })


    lines.append("path")
        .datum(function (driver) {
            return driver
        })
        .attr("d", lineGenerator)




    target
        .selectAll("circle")
        .data(drivers)
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

            d3.select("#name")
                .text(race.Name)



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
var drawAxes3 = function (graphDim, margins, xScale, yScale) {

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("d"))

    var yAxis = d3.axisLeft()
        .scale(yScale)

    var axes = d3.select("#driverGraph")
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
var drawLabels3 = function (graphDim, margins) {
    var labels = d3.select("#driverGraph")
        .append("g")
        .classed("labels", true)

    labels.append("text")
        .text("Driver Points Over Time")
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
var initGraph3 = function (drivers) {
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

    d3.select("#driverGraph")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var target = d3.select("#driverGraph")
        .append("g")
        .attr("id", "driverCanvas")
        .attr("transform",
            "translate(" + margins.left + "," +
            margins.top + ")");

    var yearStart = 1950
        
    var yearEnd = 2020
    
    d3.select("#allTime")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var yearStart = 1950
        var yearEnd = 2020
        drawAxes3(graph, margins, xScale, yScale)
        drawLines3(drivers, target, xScale, yScale)
    })
    
    d3.select("#before2010")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var yearStart = 1950
        var yearEnd = 2010
        drawAxes3(graph, margins, xScale, yScale);
        drawLines3(drivers, target, xScale, yScale)
    })
    
    d3.select("#after2010")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var yearStart = 2010
        var yearEnd = 2020
        drawAxes3(graph, margins, xScale, yScale);
        drawLines3(drivers, target, xScale, yScale)
        })

    var xScale = d3.scaleLinear()
        .domain([yearStart, yearEnd])
        .range([0, graph.width])
    

    var yScale = d3.scaleLinear()
        .domain([0, 450])
        .range([graph.height, 0])

    drawAxes3(graph, margins, xScale, yScale);
    drawLines3(drivers, target, xScale, yScale);
    drawLabels3(graph, margins);
    groupByCompetitor(drivers);
    
    

}

var successFCN3 = function (driverValues) {
    
    var drivers = driverValues[0]
    
    var colors = driverValues[1]
    
    console.log("colors", colors)
    
    initGraph3(drivers)

}

var failureFCN3 = function (error) {
    console.log("error", error)
    setBanner("Drivers not found")
}


var driverPromise = d3.csv("../drivers.csv")

var colorPromise = d3.csv("../colors.csv")

var driverPromises = [driverPromise, colorPromise]

Promise.all(driverPromises)
    .then(successFCN3, failureFCN3)

driverPromise.then(successFCN3, failureFCN3)
