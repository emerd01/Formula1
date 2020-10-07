var groupByScore = function (points) {
    var keys = [];
    var dict = {};


    points.forEach(function (point) {
        if (dict[point.Place]) {
            dict[point.Place].push(point);
        } else {
            dict[point.Place] = [point];
            keys.push(point.Place);
        }
    })

    var grouped = keys.map(function (key) {
        return dict[key];
    })

    console.log("grouped", grouped);

    return grouped;
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

            d3.select("#driverName")
                .text(race.Name)



        }) //tool tip off
        .on("mouseleave", function () {
            d3.select("#tooltip")
                .classed("hidden", true);
        })



}

var drawLines = function (scoring, target, xScale, yScale) {
    var firstPlace = scoring.map(function(score){
        return [score.Seasons, score.first]
    })
    var secondPlace = scoring.map(function(score){
        return [score.Seasons, score.second]
    })
    var thirdPlace = scoring.map(function(score){
        return [score.Seasons, score.third]
    })
    var fourthPlace = scoring.map(function(score){
        return [score.Seasons, score.fourth]
    })
    var fifthPlace = scoring.map(function(score){
        return [score.Seasons, score.fifth]
    })
    var sixthPlace = scoring.map(function(score){
        return [score.Seasons, score.sixth]
    })
    var seventhPlace = scoring.map(function(score){
        return [score.Seasons, score.seventh]
    })
    var eigthPlace = scoring.map(function(score){
        return [score.Seasons, score.eighth]
    })
    var ninthPlace = scoring.map(function(score){
        return [score.Seasons, score.ninth]
    })
    var tenthPlace = scoring.map(function(score){
        return [score.Seasons, score.tenth]
    })
    var allScores = [firstPlace, secondPlace, thirdPlace, fourthPlace, fifthPlace, sixthPlace, seventhPlace, eigthPlace, ninthPlace, tenthPlace]
    
    console.log("all places together", allScores)
    
    var places = groupByScore(allScores)
    var places = places[0]
    console.log("places", places)
    console.log("places0", places[0][1][0])
    var lineGenerator = d3.line()
        .x(function (placeYear) {
            return xScale(placeYear[0][1])
        })
        .y(function (placeYear) {
            return yScale(placeYear.Position)
        })
        .curve(d3.curveCardinal)
    
        //console.log("scores", scoring)
    
    
    
        
    var lines = target
        .selectAll("g")
        .data(places)
        .enter()
        .append("g")
        .classed("line", true)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 10)
        .on("mouseover", function (place) {
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
        .on("mouseout", function (place) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)
            }
            d3.select("#tooltip")
                .classed("hidden", true)



        })


    lines.append("path")
        .datum(function(place){
        return place
    })
        .attr("d", lineGenerator)

    


    target
        .selectAll("circle")
        .data(scoring)
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

            d3.select("#place")
                .text(race.place)

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

var drawAxes3 = function (graphDim, margins, xScale, yScale) {

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("d"))

    var yAxis = d3.axisLeft()
        .scale(yScale)

    var axes = d3.select("#pointsGraph")
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

var drawLabels3 = function (graphDim, margins) {
    var labels = d3.select("#pointsGraph")
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
var initGraph = function (scoring) {
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
        .domain([1950,2020])
        .range([0, graph.width])

    var yScale = d3.scaleLinear()
        .domain([0, 25])
        .range([graph.height, 0])

    drawAxes(graph, margins, xScale, yScale);
    drawLines(scoring, target, xScale, yScale);
    drawLabels(graph, margins);
    groupByScore(scoring);
    
    
    /*
    var years = [1958,2020]
    
    d3.select("#allTime")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var years = (1950, 2020)
        drawLines(scoring, target, xScale, yScale)
    })
    
    d3.select("#before2010")
        .on("click", function(){
        d3.selectAll("g")
            .remove()
        var years = (1950, 2010)
        drawLines(scoring, target, xScale, yScale)
    })
    
    */
    

}

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

    d3.select("#pointsGraph")
        .attr("width", screen.width)
        .attr("height", screen.height)

    var target = d3.select("#pointsGraph")
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


var successFCN = function (values) {
    var scoring  = values[0]
    
    var colors = values[1]
    
    var drivers =  values[2]
                          
    console.log("drivers", drivers)                      
    
    //console.log("scoring", scoring)
    
    initGraph(scoring)
    
    
    

}

var failureFCN = function (error) {
    console.log("error", error)
    
}

var scoringPromise = d3.csv("../scoring.csv")

var colorPromise = d3.csv("../colors.csv")

var driverPromise = d3.csv("../drivers.csv")

var promises = [scoringPromise, colorPromise, driverPromise]

Promise.all(promises)
.then(successFCN, failureFCN)