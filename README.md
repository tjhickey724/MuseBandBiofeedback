# MuseJS

This is the alpha version of a basic js library for interacting with osc data sent from muse-io.

#Requirements
-MuseIO running on port 3333 sending UDP (muse-io --osc osc.udp://localhost:3333 --dsp) (Instructions here: https://sites.google.com/a/interaxon.ca/muse-developer-site/sdk-setup)<br/>
-osc-web (Instructions here: https://github.com/automata/osc-web)<br/>
-jQuery

#How to use
-On the command line, navigate to the location of MuseIO and run it with "muse-io --osc osc.udp://localhost:3333 --dsp".<br/>
-On the command line, navigate to the location of web-osc and run it with "node bridge.js".<br/>
-Include jQuery and Muse.js on your web page. This will create a global object called Muse.<br/>
-In your javascript, connect to osc-web with "Muse.connect()". This will create a connection to the node server through websockets and begin receiving data.<br/>
-From there, look at the Muse data structure in muse.js to see the functions which can be overwritten. Note that these are in development and may change in future iterations.


#Example

The example provided shows a real-time line graph of all 5 brainwaves as well as a blink event. Videos below show similar examples, but not the exact one in this repo.

https://www.youtube.com/watch?v=cYULvalaUdI<br/>
https://www.youtube.com/watch?v=EK4kR-YLFgk
