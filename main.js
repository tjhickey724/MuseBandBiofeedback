$(function(){

    var points = {
            alpha : [],
            beta : [],
            delta : [],
            gamma : [],
            theta : [],
		mellow: [],
		concentration:[]

        },
        types = ['alpha', 'beta', 'delta', 'gamma', 'theta','mellow','concentration'];


    Muse.connect({
      host: 'http://127.0.0.1',
      port: 8081,
      socket: {
        host: '127.0.0.1',
        ports: {
          client: 3334,
          server: 3333
        }
      }
    });


    /* Muse overrides */
   lastx = [0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0];
   x= [];
   var window_size=600;
   var window_list = [];
   for(var i =0; i<window_size; i++){
     window_list.push(1);
   }
   window_sum=window_size+0.0;
   var counter=0;

    Muse.relative.brainwave = function(band, obj){
      var value = average(obj);
      obj.shift();
      x = x.concat(obj);
      if (band=="theta") {
	  //console.log(lastx+" "+x);
	var d = calcDist(x,lastx);// console.log(d);
  	var k = nearestCluster(x); console.log("cluster="+k);
	var kval=0;
  reading_focus=0
	switch(k){
	case 4:
	case 5:
	case 8:
	case 9:
	case 10: console.log("MATH");kval=0.1;break;

	case 2:
	case 6:
	case 12: console.log("READ");kval=0.3;reading_focus = 1; break;

	case 1:
	case 3: console.log("Closed eyes"); kval=0.45; break;

	case 7:
	case 11: console.log("Open eyes"); kval=0.5;break;
	}
  window_sum = window_sum + reading_focus - window_list.pop();
  window_list = [reading_focus].concat(window_list);
  if (window_sum<0.2*window_size && counter > window_size){ // also make sure last interruping was long ago...
    audio.play();
    counter = 0;
  }
  counter = counter + 1;

  console.log('(k,window_sum)='+k+","+window_sum/window_size*100+"%");
  console.log(window_list);

        if (d>0.3) {
          // do something ...
        }
        lastx = x;
        x=[]
      }

       if (band=="theta"){
         points[band].push(window_sum/window_size);
       } else {
         points[band].push(value);
       }

        if (points[band].length > 23) {
            points[band].shift();
        }

        updateGraphData();
        graph.update();

		var theBand = $("#wave").val();
		if(band==theBand){
			var c =
			Math.min(255,
				Math.max(0,
					Math.round((1.2-value*2)*255)));
			$("#reading").css("color","rgb("+c+","+(255-c)+","+(255-c)+")");
			$("#theVal").html("value = "+value);
		}

        //updatePolarData();
        //polar.update();
    };

    Muse.experimental.brainwave = function(band, obj){
       var value = average(obj);
           points[band].push(value/2.0);

        if (points[band].length > 23) {
            points[band].shift();
        }

        updateGraphData();
        graph.update();

        //updatePolarData();
        //polar.update();
    };

    Muse.muscle.blink = function(obj){

        if (obj[1] === 1){
            $('.eyes img').toggle();

            setTimeout(function(){

                $('.eyes img').toggle();
            }, 200);
        }

    }


    /* Helpers */
    var average = function(arr){
        var length = arr.length,
            result = 0,
            num = 0,
            i;

        for (i = 1; i < length; i++){
            result += arr[i];
            num++;
        }

        return result/num;
    };


    var updateGraphData = function(){

        var length, i, j;

        for (i=0; i < 7; i++) {

            length = graph.datasets[i].points.length

            for (j = 0 ; j < length; j++ ){
                graph.datasets[i].points[j].value = points[types[i]][j] || 0.5;
            }
        }
    };

    /* All chart.js logic is below here */

    var $canvas = $('#line'),
        ctx = $canvas.get(0).getContext('2d'),
        //$polarCanvas = $('#polar'),
        //pctx = $polarCanvas.get(0).getContext('2d'),
        startingData = {
            labels: ['','','','','','','','','','','','','','','','','','','','','','',''],
            datasets: [
              {
                  label: 'Alpha',
                  fillColor: "transparent",
                  strokeColor: "#52b9e9",
                  pointColor: "#80CFF4",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
              },
              {
                  label: 'Beta',
                  fillColor: "transparent",
                  strokeColor: "#25b9a4",
                  pointColor: "#57E0CD",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]              },
              {
                  label: 'Delta',
                  fillColor: "transparent",
                  strokeColor: "#ffdf7c",
                  pointColor: "#ffdf7c",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]              },
              {
                  label: 'Gamma',
                  fillColor: "transparent",
                  strokeColor: "#7c73b4",
                  pointColor: "#7c73b4",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
              },
              {
                  label: 'Theta',
                  fillColor: "transparent",
                  strokeColor: "#d22630",
                  pointColor: "#d22630",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
              },
              {
                  label: 'mellow',
                  fillColor: "transparent",
                  strokeColor: "#000000",
                  pointColor: "#000000",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
              },
              {
                  label: 'concentration',
                  fillColor: "transparent",
                  strokeColor: "#999999",
                  pointColor: "#999999",
                  pointStrokeColor: "#fff",
                  data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
              }
              ]
        };

    var polarData = [{
            value: 0.5,
            color: '#52b9e9',
            label: 'Alpha'
        },{
            value: 0.5,
            color: '#25b9a4',
            label: 'Beta'
        },{
            value: 0.5,
            color: '#ffdf7c',
            label: 'Delta'
        },{
            value: 0.5,
            color: '#7c73b4',
            label: 'Gamma'
        },{
            value: 0.5,
            color: '#d22630',
            label: 'Theta'
        },
		{
		            value: 0.5,
		            color: '#000000',
		            label: 'mellow'
		        },
				{
				            value: 0.5,
				            color: '#999999',
				            label: 'concentration'
				        }
        ]

    var graph = new Chart(ctx).Line(startingData, {
            animationSteps: 1,
            label: "",
            animation: true,
            responsive: true,
            maintainAspectRatio: false,
		scaleOverride: true,
		scaleSteps:20,
		scaleStepWidth:0.025,
		scaleStartValue:0.0
        });

    $canvas.after($(graph.generateLegend()));


   /* var polar = new Chart(pctx).PolarArea(polarData, {
        scaleOverride: true,
        scaleSteps : 0.5,
        scaleStepWidth: 1,
        scaleStartValue: 0
    });

    $polarCanvas.after($(polar.generateLegend()));*/

    function calcDist(x,y){
      d=0;
      for(var i=0; i<20;i++){
        d += (x[i]-y[i])**2
      }
      return Math.sqrt(d)
    }

    function nearestCluster(x) {
	// calculate the distance between x and each of the 12 clusters, keep track of the closest.
	min=1000;
	minindex = 1;
	for(var i=0;i<12;i++){
	    d = calcDist(x,clusters[i]);
	    if (d < min) {
		min = d;
		minindex = i;
	    }
	}
	return minindex;
    }


    var updatePolarData = function(){
        var i;

        for ( i=0; i<7; i++){
            polar.valueOf().segments[i].value = points[types[i]][points[types[i]].length - 1];
        }
    };


});
