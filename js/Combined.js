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

    var groupedTeams = keys.map(function (key) {
        return dict[key];
    })

    //console.log("grouped", groupedTeams);
    //console.log("grouped length", groupedTeams.length);
    

    return groupedTeams;
}

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

    var groupedDrivers = keys.map(function (key) {
        return dict[key];
    })

    //console.log("grouped", groupedDrivers);

    return groupedDrivers;
}

var drawLinesConstructor = function (constructors, targetConstructor, xScale, yScale) {
    var teams = groupByTeam(constructors)
    var lineGenerator = d3.line()
        .x(function (teamYear) {
            return xScale(teamYear.Year)
        })
        .y(function (teamYear) {
            return yScale(teamYear.Points)
        })
        //.curve(d3.curveCardinal)
        
    var lines = targetConstructor
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
                
                //d3.select("#team")
                //.text(team.Team)

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




    targetConstructor
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

var drawLinesDriver = function (drivers, targetDriver, xScale, yScale) {
    var competitors = groupByCompetitor(drivers)
    var lineGenerator = d3.line()
        .defined(d => !isNaN(d.Points))
        .x(function (driverYear) {
            return xScale(driverYear.Year)
        })
        .y(function (driverYear) {
            return yScale(driverYear.Points)
        })
        .curve(d3.curveCardinal)

    var lines = targetDriver
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




    targetDriver
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
var initGraphConstructor = function (constructors) {
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



    var constructorGraph = {
        width: screen.width - margins.left - margins.right,
        height: screen.height - margins.top - margins.bottom
    }
    console.log("constructor graph", constructorGraph);

    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var targetConstructor = d3.select("svg")
        .append("g")
        .attr("id", "constructorGraph")
        .attr("transform",
            "translate(" + margins.left + "," +
            margins.top + ")");


    var xScale = d3.scaleLinear()
        .domain([1958, 2020])
        .range([0, constructorGraph.width])

    var yScale = d3.scaleLinear()
        .domain([0, 800])
        .range([constructorGraph.height, 0])

    drawAxes(constructorGraph, margins, xScale, yScale);
    drawLinesConstructor(constructors, targetConstructor, xScale, yScale);
    drawLabels(constructorGraph, margins);
    groupByTeam(constructors)

}

var initGraphDriver = function (drivers) {
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



    var driverGraph = {
        width: screen.width - margins.left - margins.right,
        height: screen.height - margins.top - margins.bottom
    }
    console.log("driver graph", driverGraph);

    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var targetDriver = d3.select("svg")
        .append("g")
        .attr("id", "driverGraph")
        .attr("transform",
            "translate(" + margins.left + "," +
            margins.top + ")");


    var xScale = d3.scaleLinear()
        .domain([1958, 2020])
        .range([0, driverGraph.width])

    var yScale = d3.scaleLinear()
        .domain([0, 800])
        .range([driverGraph.height, 0])

    drawAxes(driverGraph, margins, xScale, yScale);
    drawLinesDriver(drivers, targetDriver, xScale, yScale);
    drawLabels(driverGraph, margins);
    groupByCompetitor(drivers)

}




var successFCN = function (values) {
    console.log("values", values)
    
    var constructors = values[0]
    var drivers = values[1]
    initGraphConstructor(constructors)
    initGraphDriver(drivers)
    

}

var failureFCN = function (error) {
    console.log("error", error)
    
}

var constructorPromise = d3.csv("../constructors.csv")

var driverPromise = d3.csv("../drivers.csv")

var promises = [constructorPromise, driverPromise]

Promise.all(promises)
.then(successFCN, failureFCN)