var drawLines = function (constructors, target, xScale, yScale) {
    var lineGenerator = d3.line()
        .x(function (race) 
           {
            return xScale(race.Points)
            })
        .y(function (race) 
           {
            return yScale(race.Year)
            })
        .curve(d3.curveCardinal)

    var lines = d3.select("svg")
        .select("#constructorGraph")
        .selectAll("g")
        .data(constructors)
        .enter()
        .append("g")
        .classed("line", true)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 10)
        .on("mouseover", function (constructor) {
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
        .on("mouseout", function (constructor) {
            if (!d3.select(this).classed("off")) {
                d3.selectAll(".line")
                    .classed("selected", false)
            }
            d3.select("#tooltip")
                .classed("hidden", true)



        })


    lines.append("path")
        .datum(constructor)
        .attr("d", lineGenerator)
    
    target
    .selectAll("circle")
    .data(constructors)
    .enter()
    .append("circle")
    .attr("cx", function(race)
         {
        return xScale(race.Year)
    })
    .attr("cy", function(race)
         {
        return yScale(race.Points)
    })
    .attr("r", 2.5)
    .on("mouseenter" ,function(race)
      {
        
      var xPos = d3.event.pageX;
      var yPos = d3.event.pageY;
      
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
        d3.select("#Team")
        .text(constructor.Team);
        
        d3.select("#Year")
        .text(constructor.Year);
      })//tool tip off
    .on("mouseleave",function()
    {
        d3.select("#tooltip")    
        .classed("hidden",true);
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
    drawLines(constructors, target, xScale, yScale);
    drawLabels(graph, margins);

}



var racingPromise = d3.csv("/constructors.csv")

var successFCN = function (constructors) {
    console.log("constructors", constructors)
    setBanner("Here are your constructors")
    initGraph(constructors)

}

var failureFCN = function (error) {
    console.log("error", error)
    setBanner("Constructors not found")
}

racingPromise.then(successFCN, failureFCN)

var setBanner = function (message) {
    d3.select("#banner")
        .text(message)
}
