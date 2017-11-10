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
