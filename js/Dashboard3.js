var groupByDriver = function (cars) {
    var keys = [];
    var dict = {};


    cars.forEach(function (car) {
        if (dict[car.Driver]) {
            dict[car.Driver].push(car);
        } else {
            dict[car.Driver] = [car];
            keys.push(car.Driver);
        }
    })

    var grouped = keys.map(function (key) {
        return dict[key];
    })

    console.log("grouped", grouped);

    return grouped;
}

var drawLines = function (drivers, target, xScale, yScale) {
    var competitors = groupByDriver(drivers)
    /*var lineGenerator = d3.line()
        .x(function (driverYear) {
            return xScale(driverYear.Year)
        })
        .y(function (driverYear) {
            return yScale(driverYear.Points)
        })
        .curve(d3.curveCardinal)
        
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
        .datum(function(driver){
        return driver
    })
        .attr("d", lineGenerator)

    */


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

            d3.select("#Team")
                .text(driver.Team)

            d3.select("#Year")
                .text(driver.Year)

            d3.select("Points")
                .text(driver.Points)


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
var initGraph = function (drivers) {
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
        .domain([0, 500])
        .range([graph.height, 0])

    drawAxes(graph, margins, xScale, yScale);
    drawLines(drivers, target, xScale, yScale);
    drawLabels(graph, margins);
    groupByDriver(drivers)

}

var successFCN = function (drivers) {
    console.log("drivers", drivers)
    setBanner("Here are your drivers")
    initGraph(drivers)

}

var failureFCN = function (error) {
    console.log("error", error)
    setBanner("Drivers not found")
}

var constructorPromise = d3.csv("../constructors.csv")

var driverPromise = d3.csv("../drivers.csv")

var promises = [constructorPromise, driverPromise]

Promise.all(promises)
.then(successFCN, failureFCN)

driverPromise.then(successFCN, failureFCN)


var setBanner = function (message) {
    d3.select("#constructorBanner")
        .text(message)
}
