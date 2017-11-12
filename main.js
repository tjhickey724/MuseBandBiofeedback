/*
This version gets data from the user and uses that to train itself.

It starts recording and stores the data in a big array of dimension 20.
When the user enters a category, it adds an category object to its log array:
{label:L,start:s, end:e}

where s and e are the start and finish indices of the interaction.
It will also use the current k-means classifier to make a prediction of
the current label, then it will reiterate the classifier after including the
current set of labelled points. This will probably have to be done in a webworker
thread since it will take a while and Javascript is single threaded...
https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

For now, we will pause the recording of data until the computation is done
and wait for the user to resume the calculation....

*/
function playSound(){
  audio.play();
}

function pushCategoryInfo(){
  var cat = category.value;
  var catEntry = {cat:cat,start:lastIndex,end:count}
  lastIndex = count
  log.push(catEntry);
  console.log(JSON.stringify(log));
  // call kmeans predict on the entries from lastIndex to count
  // then include current entries in a new kmean classifier ....
}

lastIndex=0
count=0;
log = []
brainwaves = []

$(function(){
  /*
   this records user data into a big array,
   records user category info,
   performs kmeans,
   monitor signal quality

  */

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



    x= [];


     var windowSize=100;
     var touches1 = new Array(windowSize);
     touches1.fill(1);
     var touches2 = new Array(windowSize);
     touches2.fill(1);
     var touches3 = new Array(windowSize);
     touches3.fill(1);
     var touches4 = new Array(windowSize);
     touches4.fill(1);
     var touch_sum1 = windowSize+0.0;
     var touch_sum2 = windowSize+0.0;
     var touch_sum3 = windowSize+0.0;
     var touch_sum4 = windowSize+0.0;
     var count1 = 0;
     var count2 = 0;
     var count3 = 0;
     var count4 = 0;
     //initiation: all good signal data: arrays filled with 1s
     //and sum = 1*windowSize indicating all good signal

       Muse.signal_quality.horseshoe= function(obj){
         //1 = good 2 = OK >=3 = bad
         console.log("horseshoe: "+JSON.stringify(obj));

         touches1 = touches1.slice(1).concat(obj[1]);
         touch_sum1 = touch_sum1 + obj[1] - touches1[0];
         count1++;
         //deletes the first and adds the last
         if (touch_sum1 > 2*windowSize && count1>=windowSize){
           audio1.play();
           count1 = 0;
         }
         // this audio cue will play when bad samples appear
         // also resetting, so that in each windowSize, there will only be one cue
         // if the user adjust the band in time, there won't be too many cues going on

         // similar things for all four touching points below:
         touches2 = touches2.slice(1).concat(obj[2]);
         touch_sum2 = touch_sum2 + obj[2] - touches2[0];
         count2++;
         if (touch_sum2 > 2*windowSize && count2>=windowSize){
           audio2.play();
           count2 = 0;
         }

         touches3 = touches3.slice(1).concat(obj[3]);
         touch_sum3 = touch_sum3 + obj[3] - touches3[0];
         count3++;
         if (touch_sum3 > 2*windowSize && count3>=windowSize){
           audio3.play();
           count3 = 0;
         }

         touches4 = touches4.slice(1).concat(obj[4]);
         touch_sum4 = touch_sum4 + obj[4] - touches4[0];
         count4++;
         if (touch_sum4 > 2*windowSize && count4>=windowSize){
           audio4.play();
           count4 = 0;
         }

       };



    // this will be called once for each relative band power sample (10Hz)
    // the obj is a vector for 4 doubles, corresponding to the four electrodes
    // the band is string and is one of alpha, beta, gamma, delta, theta,
    // and possibly others ...
    Muse.relative.brainwave = function(band, obj){

      //console.log('in brainwave: '+JSON.stringify(obj))


      obj.shift();  // shift off the name of the band from the obj
      x = x.concat(obj); // push 4 electrode values for current band onto vector x


      if (band=="theta") {
        brainwaves.push(x);
        count++;
        // process the complete 20 dim vector
	       console.log(JSON.stringify(x));
         x=[];




      } // close if (band == "theta")



    };



});
