var anchorList = [];  //variable to store all anchors
var plotData = [];

let margin = {top:50, right:150, bottom:50, left:80}, width = 700, height = 700;	
var main_r = 200;   //radius of the outer circle
var main_cx= 200;   //x-axis of centerpoint of the outer circle
var main_cy = 200;  //y-axis of centerpoint of the outer circle
    
var svg = d3.select("body")
                .append("svg")
                .attr("width", 700) 
                .attr("height", 700)
                .append("g")
                .attr("transform", "translate(100,100)");
  
//plot all the outer circle
svg.append("circle")
    .style("stroke", "gray")
    .style("fill", "black")
    .attr("r", main_r)
    .attr("cx", main_cx)
    .attr("cy", main_cy)
    .style("fill", "#fff")

let drag_anchor = svg.append('g')
		                .attr('class', 'drag_anchor')
	                    .attr('transform', `translate(${margin.left},${margin.top})`)
	                    .attr('display', 'none');
 
const findDatasets = () => fetch('http://localhost:5000/datasets', {
    method: 'GET',
});

const loadDataset = (name) => {
    const params = new URLSearchParams();
    params.append('name', name)
    return fetch('http://localhost:5000/datasets/load?' + params.toString(), {
    method: 'GET',
});
}

d3.select("#selected-dropdown").text("White Wine Quality");

d3.select("select")
  .on("change",function(d){
    var selected = d3.select("#d3-dropdown").node().value;
    loadDataset(selected).then((response) => response.json().then(async function(data){
        columns = ['fixedacidity','volatileacidity','citricacid','residualsugar','chlorides','freesulfurdioxide','totalsulfurdioxide','density','pH','sulphates','alcohol','quality','label']
        plotData = data;
        anchorList = await plotAnchor(data); //calling function to plot the anchors      
        create_anchor(anchorList);
        labelList = await plotLabel(columns);
        draw_label(labelList)
        plot_circles(data, anchorList); //calling function to plot all the datapoints
    })); 
    
    d3.select("#selected-dropdown").text(selected);
})

d3.select("#Button_cluster")
    .on("click", function(){
        var selected = d3.select("#d3-dropdown").node().value;
        loadDataset(selected).then((response) => response.json().then(async function(data){
            columns = ['fixedacidity','volatileacidity','citricacid','residualsugar','chlorides','freesulfurdioxide','totalsulfurdioxide','density','pH','sulphates','alcohol','quality','label']
            plotData = data;
            anchorList = await plotAnchor(data); //calling function to plot the anchors      
            create_anchor(anchorList);
            labelList = await plotLabel(columns);
            draw_label(labelList)
            plot_circles_clusters(data, anchorList); //calling function to plot all the datapoints
        })); 
    }) 

d3.select("#Button_column")
    .on("click", function(){
        var selected = d3.select("#d3-dropdown").node().value;
        loadDataset(selected).then((response) => response.json().then(async function(data){
            columns = ['fixedacidity','volatileacidity','citricacid','residualsugar','chlorides','freesulfurdioxide','totalsulfurdioxide','density','pH','sulphates','alcohol','quality','label']
            plotData = data;
            anchorList = await plotAnchor(data); //calling function to plot the anchors      
            create_anchor(anchorList);
            labelList = await plotLabel(columns);
            draw_label(labelList)
            plot_circles(data, anchorList); //calling function to plot all the datapoints
        })); 
    }) 



// Calling the API
loadDataset('White Wine Quality').then((response) => response.json().then(async function(data){
    columns = ['fixedacidity','volatileacidity','citricacid','residualsugar','chlorides','freesulfurdioxide','totalsulfurdioxide','density','pH','sulphates','alcohol','quality','label']
    plotData = data;
    anchorList = await plotAnchor(data); //calling function to plot the anchors      
    create_anchor(anchorList);
    labelList = await plotLabel(columns);
    draw_label(labelList)
    plot_circles(data, anchorList); //calling function to plot all the datapoints
    })); 

//function to plot all the anchors
function plotAnchor(data){ 
    let anchorPoints = [];
    // Calculation to get the (x,y) point of anchors anchors
    for ( var i = 0; i < data[0].length - 2; i++ ){
        anchorPoints.push({
        x: main_r * Math.cos(i * (2*Math.PI)/(12-1)) + main_cx,
        y: main_r * Math.sin(i * (2*Math.PI)/(12-1)) + main_cy,
        z: i 
        });
    }
    console.log(anchorPoints)
    return anchorPoints;
}

//declare group for all the anchor points and anchor label
var anchorGroup = svg.append("g"); 

//function to plot anchor point
function create_anchor(anchorPoints){
         
    //plot all the anchors 
    anchorGroup.selectAll("circle").remove();
    anchorGroup.selectAll("circle")  
                .data(anchorPoints)
                .enter()
                .append("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r",6)  
                .style("fill",function(d) { return d.z})
                .on('mouseenter', function(d){
                    let damouse = d3.mouse(this); 
                    svg.select('g.drag_anchor').attr('transform',  `translate(${margin.left + damouse[0] +0},${margin.top+damouse[1] - 50})`).ease(d3.easeQuad);
                    svg.select('g.drag_anchor').attr('display', 'block');
                })
                .on('mouseout', function(d){
                    svg.select('g.drag_anchor').attr('display', 'none');
                })
                .call(d3.drag()
                .on('start', drag_start)
                .on('drag', while_dragging)
                .on('end', drag_end))
            
            //append text lable to all the anchors              
 }

function plotLabel(data){ 
    let LabelPoints = [];
    // Calculation to get the (x,y) point of anchors anchors
    for ( var i = 0; i < data.length - 2; i++ ){
        LabelPoints.push({
        x: main_r * Math.cos(i * (2*Math.PI)/(12-1)) + main_cx,
        y: main_r * Math.sin(i * (2*Math.PI)/(12-1)) + main_cy,
        z: data[i] 
        });
    }
    return LabelPoints;
}

function draw_label(LabelPoints){

    anchorGroup.selectAll("text").remove();
    anchorGroup.selectAll("text")
                .data(LabelPoints)
                .enter()
                .append("text")
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr('dx', d => Math.cos(d.theta) * 15)
                .attr('dy', d => Math.sin(d.theta)<0?Math.sin(d.theta)*(15):Math.sin(d.theta)*(15)+ 10)
                .text(function(d){return d.z;})
                .attr('text-anchor', function (d) {
                if(Math.cos(d.angle) > 0)
                    return 'start';
                else
                    return 'end';
                })
}
 
function drag_start(d){ 
    d3.select(this).raise().classed('active', true);
}

function drag_end(d){ 
    d3.select(this).classed('active', false);
    d3.select(this).attr('stroke-width', 0);
}

function while_dragging(d, i) {
    d3.select(this).raise().classed('active', true);

    let val_x = d3.event.x - main_r;
    let val_y = d3.event.y - main_r;
    let updated_angle = Math.atan2( val_y , val_x ) ;	
    updated_angle = updated_angle<0? 2*Math.PI + updated_angle : updated_angle;
    d.theta = updated_angle;
    d.x = main_r + Math.cos(updated_angle) * main_r;
    d.y = main_r + Math.sin(updated_angle) * main_r;
    d3.select(this).attr('cx', d.x).attr('cy', d.y);

    // again draw the anchors
    let newAnchors = plotAnchor(plotData);
    newAnchors[i].x = d.x;
    newAnchors[i].y =  d.y;
    create_anchor(newAnchors);
    draw_label(newAnchors)
    // replot all the datapoints accroding to the new anchors
    plot_circles(plotData, newAnchors);

}

function anchors(lable, x, y) {
    this.lable = lable
    this.x = x
    this.y = y
}

//calculation for datapoints 
function cal_datapoints(force_bet_nodes, quality) {
    this.force_bet_nodes = force_bet_nodes ;
    this.quality = quality;
        
    this.total = function() {
                var force = this.force_bet_nodes.map(function(a) {  return a.force;})
                                    .reduce(function(a,b) {return a+b});
                return force;
    }
    
    this.x_coord = function() {
                var x = this.force_bet_nodes.map(function(a) {return a.force*a.attractor.x})
                                            .reduce(function(a,b) {return a+b})/this.total();
                return x;
    }
       
    this.y_coord = function() {
                var y = this.force_bet_nodes.map(function(a) {return a.force*a.attractor.y})
                                              .reduce(function(a,b) {return a+b})/this.total();
                return y;
    }
    
    this.coordinates = [this.x_coord(),this.y_coord()]
}

var circleGroup = svg.append("g"); //group for all the datapoints
    
function plot_circles(data, anchorList){
    console.log("test", anchorList);
    const attractors = [];
    //get all the element of anchorList and store in attractors
    for (const anchorObj of anchorList) {
        var str = anchorObj.z  = new anchors(anchorObj.z,anchorObj.x,anchorObj.y);
        eval(str);
        attractors.push(str);
    }

    var datapoints = []; //array to store the datapoints
    //scale the last column 'quality' according to the colors
    var colorScale = d3.scaleOrdinal()
                        .domain([d3.max(data.map(d => d.quality)), d3.max(data.map(d => d.quality))])
                        .range(['red', 'blue', 'green','yellow']);
            
    for ( var i = 0; i < data.length; i++ ) {
        const nodeArray = [];
        for (const attr of attractors) {
            const col_name = attr.lable;
            const obj = {
                attractor: attr,
                force: data[i][col_name]
            }
            nodeArray.push(obj);
        }
        //create datapoints
        datapoints.push(new cal_datapoints(nodeArray, data[i][11]))
    };     
        
    var div = d3.select("body").append("div")				
                    .style("opacity", 0) 
                    .attr("position","absolute")
                    .attr("text-align","center");	
                        
    var div = d3.select("body").append("div")	
                    .attr("class", "tooltip")				
                    .style("opacity", 0);
    
    circleGroup.selectAll("circle").remove()  //remove all the datapoints after dragging anchors

    //plot the datapoints
    circleGroup.selectAll("circle")
                .data(datapoints)
                .enter()
                .append("circle")
                .attr("cx",function(d) { return d.x_coord();})
                .attr("cy",function(d) { return d.y_coord();})
                .attr("r",6)
                .attr('stroke', 'black')
				.attr('stroke-width', 0.5)
                .style("fill", function(d, i){ return colorScale(d.quality)})
                //implementing tooltip
                .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(100)		
                        .style("opacity", .8);		
                    div	.html("quality </br>"  + d.quality )	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 31) + "px");	
                })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(450)		
                        .style("opacity", 0);	
                });
    //color scale bar 
    d3.select("#opacity_bar").on("input", function () {
        circleGroup.selectAll('circle')
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .style("opacity", d3.select("#opacity_bar").property("value")/100);
    });

}
      
  
function plot_circles_clusters(data, anchorList){
    const attractors = [];
    //get all the element of anchorList and store in attractors
    for (const anchorObj of anchorList) {
        var str = anchorObj.z  = new anchors(anchorObj.z,anchorObj.x,anchorObj.y);
        eval(str);
        attractors.push(str);
    }

    var datapoints = []; //array to store the datapoints
    //scale the last column 'quality' according to the colors
    var colorScale = d3.scaleOrdinal()
                        .domain([d3.max(data.map(d => d.quality)), d3.max(data.map(d => d.quality))])
                        .range(['#D35400', '#F1C40F', '#58D68D']);
            
    for ( var i = 0; i < data.length; i++ ) {
        const nodeArray = [];
        for (const attr of attractors) {
            const col_name = attr.lable;
            const obj = {
                attractor: attr,
                force: data[i][col_name]
            }
            nodeArray.push(obj);
        }
        //create datapoints
        datapoints.push(new cal_datapoints(nodeArray, data[i][12]))
    };     
        
    var div = d3.select("body").append("div")				
                    .style("opacity", 0) 
                    .attr("position","absolute")
                    .attr("text-align","center");	
                        

    var div = d3.select("body").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
    
    circleGroup.selectAll("circle").remove()  //remove all the datapoints after dragging anchors

    //plot the datapoints
    circleGroup.selectAll("circle")
                .data(datapoints)
                .enter()
                .append("circle")
                .attr("cx",function(d) { return d.x_coord();})
                .attr("cy",function(d) { return d.y_coord();})
                .attr("r",6)
                .attr('stroke', 'black')
		        .attr('stroke-width', 0.5)
                .style("fill", function(d, i){ return colorScale(d.quality)})
                //implementing tooltip
                .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(100)		
                        .style("opacity", .8);		
                    div	.html("quality </br>"  + d.quality )	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 31) + "px");	
                })					
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(450)		
                        .style("opacity", 0);	
                });
    //color scale bar 
    d3.select("#opacity_bar").on("input", function () {
            circleGroup.selectAll('circle')
                        .transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .style("opacity", d3.select("#opacity_bar").property("value")/100);
        });

}
      
  
 