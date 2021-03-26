
function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}

function strokePieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.stroke();  

}

var Piechart = function(options) {
  this.options = options;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");

  if (this.options.colors) {
    this.colors = options.colors;
  } else {
    var colors = [];
    while (colors.length < 100) {
      do {
        var color = Math.floor((Math.random() * 1000000) + 1);
      } while (colors.indexOf(color) >= 0);
      colors.push("#" + ("000000" + color.toString(16)).slice(-6));
    }
    this.colors = colors;
  }

  this.draw = function() {
    var total_value = 0;
    var color_index = 0;
    for (var categ in this.options.data) {
      var val = this.options.data[categ];
      total_value += val;
    }

    var start_angle = 0;
    for (categ in this.options.data) {
      val = this.options.data[categ];
      var slice_angle = 2 * Math.PI * val / total_value;

      drawPieSlice (
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.min(this.canvas.width / 2, this.canvas.height / 2),
        start_angle,
        start_angle + slice_angle,
        this.colors[color_index % this.colors.length]
      );
      if (this.options.strokePieSlice) {
          strokePieSlice (
            this.ctx,
            this.canvas.width / 2,
            this.canvas.height / 2,
            Math.min(this.canvas.width / 2, this.canvas.height / 2),
            start_angle,
            start_angle + slice_angle,
            this.colors[color_index % this.colors.length]
          );
	  }
      start_angle += slice_angle;
      color_index++;
    }

    if (this.options.doughnutHoleSize) {
      var dholeColor = "#FFF";
      if (this.options.doughnutHoleColor) {
        dholeColor = this.options.doughnutHoleColor;
      }

      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.options.doughnutHoleSize * Math.min(this.canvas.width / 2, this.canvas.height / 2),
        0,
        2 * Math.PI,
        dholeColor
      );
    }

    if (this.options.showPercent | this.options.showCategory) {
      start_angle = 0;
      for (categ in this.options.data) {
        val = this.options.data[categ];
        slice_angle = 2 * Math.PI * val / total_value;
        var pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        var labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
        var labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);

        if (this.options.doughnutHoleSize) {
          var offset = (pieRadius * this.options.doughnutHoleSize) / 2;
          labelX = this.canvas.width / 2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
          labelY = this.canvas.height / 2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);
        }

        var labelPct = Math.round(100 * val / total_value);
        
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 0.8em arial";

        this.ctx.shadowColor="black";
        this.ctx.lineWidth=1;
        this.ctx.shadowBlur=5;
        if (this.options.showPercent) {
        	this.ctx.fillText(labelPct + "%", labelX, labelY);
        }
        if (this.options.showCategory) {
        	this.ctx.fillText(categ, labelX-(categ.length-4)*3.5, labelY+15);
        }
        this.ctx.shadowBlur=0;
        this.ctx.fillStyle="#FFF";        

		if (this.options.showPercent) {
			this.ctx.fillText(labelPct + "%", labelX, labelY);
        }
        if (this.options.showCategory) {
        	this.ctx.fillText(categ, labelX-(categ.length-4)*3.5, labelY+15);
        }
        
        start_angle += slice_angle;
      }
    }
    
    if (this.options.legend) {
      color_index = 0;
      var legendHTML = "";
      for (categ in this.options.data) {
        legendHTML += "<div><span style='display:inline-block;width:20px;background-color:" + this.colors[color_index++] + ";'>&nbsp;</span> " + categ + "</div>";
      }
      this.options.legend.innerHTML = legendHTML;
    }
  }
}


    /*
     ///example usage ///

    var myCanvas = document.getElementById("myCanvas");
    var myCanvaz = document.getElementById("myCanvaz");
    myCanvas.width = 300;
    myCanvas.height = 300;
    myCanvaz.width = 300;
    myCanvaz.height = 300;

    var myDataPoints = {
      "Spring": 25,
      "Summer": 35,
      "Fall": 22.5,
      "Indian Summer": 5,
      "Winter": 12.5
    };

    var myPiechart = new Piechart({
      canvas: myCanvas,
      data: myDataPoints,
      colors: ["purple", "#fde23e", "#f16e23", "#57d900", "#937e00", "#937eFF", "blue", "red"],
      doughnutHoleSize: 0.1,
      doughnutHoleColor: "transparent",
      legend: myLegend,
      showPercent: true,
      showCategory: true
    });
    myPiechart.draw();


    var myDoughnutchart = new Piechart({
      canvas: myCanvaz,
      data: myDataPoints,
      //colors: ["purple", "#fde23e", "#f16e23", "#57d9ff", "#937e88"],
      doughnutHoleSize: 0.6,
      //doughnutHoleColor: "#00F"
      legend: myLegendz,
      showPercent: true,
      strokePieSlice: true
    });
    myDoughnutchart.draw();

    */
