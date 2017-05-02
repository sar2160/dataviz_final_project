//****** globals
var scatterDots = [];
var dataTable;


/// global canvas variables
var cnv;
var chartTitle = "";
var xLabel = "";


var canvasWidth = 800;
var canvasHeight = 500;



/// Gets the maximum value of a list of numeric data
function getMaxValue(variable_name){
  maxValue = 0;
  for ( var i = 0; i < dataTable.getRowCount(); i++){
    maxValue = max(maxValue, dataTable.getNum(i, variable_name));
  }
  return(maxValue);
}



function plotScatter(boro, waypoint_id){
  scatterDots = [];
  cnv.parent(waypoint_id);
  var max_poverty = getMaxValue('poverty_rate');
  var max_rent_premium = getMaxValue('premium_pct_median_rent');

  /// Title
  chartTitle = boro;
  ///xLabel = max_poverty;

  for (var i = 0; i < dataTable.getRowCount(); i++){
    var b   = dataTable.getString(i,'County ');

    if (b == boro){
      var prem = dataTable.getNum(i,'premium_pct_median_rent');
      var pov = dataTable.getNum(i, 'poverty_rate');
      scatterDots.push(new Dot(x = pov, y = prem, max_x = 1, max_y = max_rent_premium));

    }

  }
}

function getSum(total, num) {
    return total + num;
}



function preload(){
  dataTable = loadTable('../data/rent_data.csv', 'csv', 'header');
}



function setup(){
  cnv = createCanvas(canvasWidth, canvasHeight);
  var nBalls = dataTable.getRowCount();
  colorMode(HSB,100);

  print(dataTable.getRowCount() + ' rows loaded...');
  print(dataTable.getColumnCount() + ' columns loaded...');


  var waypoint1 = new Waypoint({
    element: document.getElementById('basic-waypoint'),
    handler: function() {
      plotScatter('Kings','basic-waypoint');
    }
  })

  var waypoint2 = new Waypoint({
    element: document.getElementById('basic-waypoint1'),
    handler: function() {
      plotScatter('Richmond', 'basic-waypoint1');
    }
  })

  //plotScatter('Richmond');


}

function draw(){
  //fill(0,100,100,0.1);
  background(365);

  //axis lines

  line(10,400,400,400);
  line(10,0,10,400);
  fill(0);
  text(chartTitle,10,10);
  text(xLabel,400,400);





  for (var i = 0; i < scatterDots.length; i++){
     scatterDots[i].display();
   }
}




function Dot(x, y, max_x, max_y){
  //console.log(this.r);

  this.color = 0;

  this.x_pos = map(x, 0,max_x, 0, 500);
  this.y_pos = map(y, 0, max_y ,0 , 500 );
  //this.brightness    = map(indicator, 0,max_value,0,100);
;
  this.current_position  = createVector(50 + this.x_pos, 0);
  this.target_position = createVector( 50 + this.x_pos   , 400 - this.y_pos   );
  this.velocity        = createVector(0,15);

  this.display = function(){
    noFill();
    //fill(this.color,  this.brightness ,100 );

    /// stop the dot motion if it reaches its target position
    this.current_position.add(this.velocity);

    if (this.current_position.y >= this.target_position.y){
      this.velocity.set(0,0);
      this.current_position.y = this.target_position.y;
    }
    ellipse(this.current_position.x , this.current_position.y , 5 );

  }




}
