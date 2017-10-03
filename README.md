
#visual audio biofeedback using EEG Sensor, JavaScript

#MuseJS
This is the alpha version of a basic js library for interacting with osc data sent from muse-io.

#Requirements

MuseIO running on port 3333 sending UDP
Please download the right version for your device from here and install:
http://developer.choosemuse.com/research-tools/museio

osc-web
Please follow the instruction to download and install:
https://github.com/automata/osc-web
Specifically, you can follow the “installation” part of the instruction

jQuery
Please download from here:
https://jquery.com/download/
It’s recommended that you download the uncompressed version

Biofeedback app.atml
Please download the Biofeedback.zip file

#How to use

Turn on your muse headband and pair up via bluetooth with your device
On the command line(terminal/shell), enter "muse-io --osc osc.udp://localhost:3333 --dsp" to run MuseIO on port 3333 sending UDP
On the command line, navigate to the location of osc-web by entering “cd osc-web” and then enter "node bridge.js" to run osc-web
Open app.html from Biofeedback.zip
Now you should be able to track your brainwave on the web page. The Muse.io window will allow you to view the percent of background noise, adjust your headband if the noise is too big. When all four coordinates of background noise are below 1%, you should see visualization of your brainwave steadily on the web page.
As you became more concentrated with the texts, you should be able to see change in visualization of the texts. And there will be a sound alert every minute for notification of time.
Please note that these are in development and may change in future iterations. Suggestions and opinions are highly welcomed.
#Example

The example provided shows a real-time line graph of all 5 brainwaves as well as a blink event. Videos below show similar examples, but not the exact one in this repo.
https://www.youtube.com/watch?v=cYULvalaUdI
https://www.youtube.com/watch?v=EK4kR-YLFgk
