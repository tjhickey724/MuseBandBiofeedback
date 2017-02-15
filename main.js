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

    Muse.relative.brainwave = function(band, obj){
       var value = average(obj);
           points[band].push(value);

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

    var updatePolarData = function(){
        var i;

        for ( i=0; i<7; i++){
            polar.valueOf().segments[i].value = points[types[i]][points[types[i]].length - 1];
        }
    };


});
