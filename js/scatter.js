//****** globals
var scatterDots = [];
var ListingData;
var TractData;


/// global canvas variables
var cnv;
var chartTitle = "";
var xLabel = "";
var yLabel = "";
var x_tick_half = "";
var y_tick_half = "";



var canvasWidth = 500;
var canvasHeight = 515;



/// Gets the maximum value of a list of numeric data
function getMaxValue(dataTable, variable_name){
  maxValue = -10000;
  for ( var i = 0; i < dataTable.getRowCount(); i++){
    maxValue = max(maxValue, dataTable.getNum(i, variable_name));
  }
  return(maxValue);
}

function getMinValue(dataTable, variable_name){
  minValue = 1000000;
  for ( var i = 0; i < dataTable.getRowCount(); i++){
    minValue = min(minValue, dataTable.getNum(i, variable_name));
  }
  return(minValue);
}

function getSum(total, num) {
    return total + num;
}




// Dot object for map
function Dot(x, y, min_x, max_x, min_y, max_y, fill_color = 0){
  //console.log(this.r);

  this.color = fill_color;

  this.x_pos = map(x, min_x,max_x, 0, 490);
  this.y_pos = map(y, min_y, max_y ,0 , 490 );
  //this.brightness    = map(indicator, 0,max_value,0,100);
;
  this.current_position  = createVector( 50 + this.x_pos, 0);
  this.target_position = createVector( 50 + this.x_pos   , 500 - this.y_pos   );
  this.velocity        = createVector(0,15);

  this.display = function(){

    /// stop the dot motion if it reaches its target position
    this.current_position.add(this.velocity);

    if (this.current_position.y >= this.target_position.y){
      this.velocity.set(0,0);
      this.current_position.y = this.target_position.y;
    }
    stroke(0,  this.color , this.color );
    point(this.current_position.x , this.current_position.y  );

  }
}

// Ellipse object for scatter plot
function Ellipse(x, y, min_x, max_x, min_y, max_y, fill_color = 0){
  //console.log(this.r);

  this.color = fill_color;

  this.x_pos = map(x, min_x ,max_x, 25,  490);
  this.y_pos = map(y, min_y, max_y , 25, 490 );
  //this.brightness    = map(indicator, 0,max_value,0,100);
;
  this.current_position  = createVector( 10 + this.x_pos, 0);  // need an extra 10 pixels so the dots dont end up on the axis
  this.target_position =   createVector( 10 + this.x_pos   , 490 - this.y_pos   );
  this.velocity        =   createVector(0,15);

  this.display = function(){
    noFill();
    //fill(this.color,  this.brightness ,100 );

    /// stop the dot motion if it reaches its target position
    this.current_position.add(this.velocity);

    if (this.current_position.y >= this.target_position.y){
      this.velocity.set(0,0);
      this.current_position.y = this.target_position.y;
    }
    ellipse(this.current_position.x , this.current_position.y, 5  );

  }
}


/// The scatter plot
function plotScatter(dataTable, boro, waypoint_id){
  scatterDots = [];
  cnv.parent(waypoint_id);
  var max_poverty = getMaxValue(dataTable, 'poverty_rate');
  var max_rent_premium = getMaxValue(dataTable, 'premium_pct_median_rent');
  console.log(max_rent_premium);
  /// Title
  chartTitle = boro;
  xLabel = 'Poverty Rate';
  yLabel = 'AirBnB Premium';

  x_tick_half = '50%';
  y_tick_half = (max_rent_premium / 2)   .toFixed(0) + 'x' ;
  ///xLabel = max_poverty;

  for (var i = 0; i < dataTable.getRowCount(); i++){
    var b   = dataTable.getString(i,'County ');

    if (b == boro){
      var prem = dataTable.getNum(i,'premium_pct_median_rent');
      var pov = dataTable.getNum(i, 'poverty_rate');
      scatterDots.push(new Ellipse(x = pov, y = prem, min_x = 0, max_x = 1, min_y = 0, max_y = max_rent_premium));

    }

  }
}


/// The listings map
function plotMap(dataTable, waypoint_id, color_illegal){
  scatterDots = [];
  cnv.parent(waypoint_id);

  var minLat = getMinValue(dataTable, 'latitude');
  var minLong = getMinValue(dataTable, 'longitude');

  var maxLat = getMaxValue(dataTable, 'latitude');
  var maxLong = getMaxValue(dataTable, 'longitude');

  chartTitle = 'New York City';
  xLabel = 'East';
  yLabel = 'North';
  x_tick_half = "";
  y_tick_half =  "";

  for (var i = 0; i < dataTable.getRowCount(); i++){

    if (color_illegal == true){
      var lat = dataTable.getNum(i,'latitude');
      var long = dataTable.getNum(i, 'longitude');
        if (dataTable.getString(i, 'possible_illegal') == 'True'){
          scatterDots.push(new Dot(x = long, y = lat, min_x = minLong, max_x = maxLong , min_y = minLat, max_y = maxLat, fill_color = 100));
      } else {
           scatterDots.push(new Dot(x = long, y = lat, min_x = minLong, max_x = maxLong , min_y = minLat, max_y = maxLat, fill_color = 0));
      }} else {
        var lat = dataTable.getNum(i,'latitude');
        var long = dataTable.getNum(i, 'longitude');
        scatterDots.push(new Dot(x = long, y = lat, min_x = minLong, max_x = maxLong , min_y = minLat, max_y = maxLat, fill_color = 0));
      }

    }
}



function preload(){
  TractData = loadTable('../data/rent_data.csv', 'csv', 'header');
  ListingData = loadTable('../data/listings_latlong.csv', 'csv', 'header');

}


function setup(){
  cnv = createCanvas(canvasWidth, canvasHeight);
  colorMode(HSB,100);


/// Each waypoint puts a plot on the webpage.

  var waypoint = new Waypoint({
    element: document.getElementById('Listings_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotMap(ListingData, 'Listings_Element', color_illegal = false);
      }
    }
  })

  var waypoint = new Waypoint({
    element: document.getElementById('Illegal_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotMap(ListingData, 'Illegal_Element', color_illegal = true);
      }
    }
  })

  var waypoint1 = new Waypoint({
    element: document.getElementById('BX_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotScatter(TractData, 'Bronx','BX_Element');
      }
    }
  })


  var waypoint1 = new Waypoint({
    element: document.getElementById('BK_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotScatter(TractData, 'Kings','BK_Element');
      }
    }
  })


  var waypoint2 = new Waypoint({
    element: document.getElementById('QN_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotScatter(TractData, 'Queens', 'QN_Element');
      }
    }
  })

  var waypoint3 = new Waypoint({
    element: document.getElementById('MN_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotScatter(TractData, 'Manhattan', 'MN_Element');
      }
    }
  })

  var waypoint4 = new Waypoint({
    element: document.getElementById('SI_waypoint'),
    handler: function(direction) {
      if (direction == 'down'){
      plotScatter(TractData, 'Richmond', 'SI_Element');
      }
    }
  })


}

function draw(){
  background(365);


  //axis lines
  stroke(0);
  fill(0);

  // axis lines
  line(25,490,490,490);
  line(25,25,25,490);
  textSize(12);
  textFont("Verdana");

  // axis marks
  text(xLabel, 425, 510);
  text(yLabel, 25, 10);
  text(x_tick_half, 245, 510);
  text(y_tick_half, 0, 245);
  for (var i = 0; i < scatterDots.length; i++){
     scatterDots[i].display();
   }
}
