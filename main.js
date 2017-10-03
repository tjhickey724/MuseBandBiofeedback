$(function(){
    /*
    The points array keeps track of the last N samples from the museband
    This is used for plotting the graphs of the bands ..
    More detail later ...
    */
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

    // connect with the Museband through the Muse object ...
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


    // keeping track of the most recent 20-dim samples
    // lastx is the previous one
    // x is the current one, possibly only partly complete
    // as we get alpha, beta, delta, gamma, and theta ij 5 separate steps
   lastx = [0,0,0,0, 0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0];
   x= [];



   /*
     Here we initialize the data stuctures needed to calculate the percentage
     of reading samples in the last window_size samples, initially 600 = 1 min
     window_list is the list 0s and 1s
         where 1 is a reading sample and 0 a non-reading sample
     We initialize it to be 100% reading (optimistically)
     window_sum is the sum of the numbers is window_list (initially window_size)
   */
   var window_size=600;
   var window_list = [];
   for(var i =0; i<window_size; i++){
     window_list.push(1);
   }
   window_sum=window_size+0.0;
   var counter=0; // total number of samples processed




    // this will be called once for each relative band power sample (10Hz)
    // the obj is a vector for 4 doubles, corresponding to the four electrodes
    // the band is string and is one of alpha, beta, gamma, delta, theta,
    // and possibly others ...
    Muse.relative.brainwave = function(band, obj){

      console.log('in brainwave: '+JSON.stringify(obj))


      obj.shift();  // shift off the name of the band from the obj
      x = x.concat(obj); // push 4 electrode values for current band onto vector x
      var value = average(obj);
      points[band].push(value);  // add another point on the right of the graph
      if (points[band].length > 23) {
        points[band].shift();  // shift the graph to the left
      }

      if (band=="theta") {
        // process the complete 20 dim vector
	       console.log('after reading theta: '+JSON.stringify(x));

         // find the nearest cluster and its type
  	      var k = nearestCluster(x);
          console.log("cluster="+k);
          lastx = x;
          x=[]; // reset x to empty to start reading in the next sample

          // find the activity from the cluster number
          // and use to update the reading_focus parameter
	        switch(k){
	            case 4:
	            case 5:
	            case 8:
	            case 9:
	            case 10: console.log("MATH"); reading_focus=0;break;

	            case 2:
	            case 6:
	            case 12: console.log("READ"); reading_focus = 1; break;

	            case 1:
	            case 3: console.log("Closed eyes");reading_focus=0; break;

	            case 7:
	            case 11: console.log("Open eyes"); reading_focus=0;break;
	           }


          // AUDITORY CUES
          // Here we calculate the percentage of samples which were in the reading cluster
          // averaged over the past window_size samples (currently 600 = 1 minute)
          // I'll use 600 for that number in this explanation:
          // window_list is the list of the past 600 samples
          // window_sum is the number of reading samples in window_list
          //

          // pop off the oldest sample, reduce the window_sum accordingly
          // and add the newest sample (reading_focus) which is 0 or 1
          window_sum = window_sum + reading_focus - window_list.pop();
          window_list = [reading_focus].concat(window_list);

          // Here we test to see if the "reading focus" has falled too far
          // That is, if fewer that 20% of their samples have been reading samples
          // and we've seen at least window_size samples, then we'll warn them
          // it might be better to use a 5 minute window, or maybe a 30 second window..

          if (window_sum<0.2*window_size){ // also make sure last interruping was long ago...
            audio.play();
            counter = 0;
          }
          counter = counter + 1;

          console.log('(k,window_sum)='+k+","+window_sum/window_size*100+"%");
          console.log(window_list);


          //GRAPHING THE FIVES BANDS AVERAGED OVER 4 ELECTRODES



          updateGraphData(); // copies points info into form needed by chart.js
          graph.update();  // call chart.js function to redraw the graph

      } // close if (band == "theta")


    // VISUAL CUES
    // this is where we change the darkness of the text
    // based on the average value of one of the bands over 4 electrodes
    // if the value is > 0.6 then c=0 and the text is rgb(0,255,255)
    // if the value is under < 0.1, then c=255 & text=rgb(255,0,0)
    // for values between 0.1 and 0.6 it is linearly interpolated
    // at 0.35 we have c=0.5 and the text color is gray: rgb(128,128,128)
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

/*
    Muse.experimental.brainwave = function(band, obj){
      return;
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
    */

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


    var graph =
      new Chart(ctx).Line(
         startingData,
         {
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


  /*
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
  */

    /* var polar = new Chart(pctx).PolarArea(polarData, {
         scaleOverride: true,
         scaleSteps : 0.5,
         scaleStepWidth: 1,
         scaleStartValue: 0
     });

     $polarCanvas.after($(polar.generateLegend()));*/


     /*
    var updatePolarData = function(){
        var i;

        for ( i=0; i<7; i++){
            polar.valueOf().segments[i].value = points[types[i]][points[types[i]].length - 1];
        }
    };
    */


});
