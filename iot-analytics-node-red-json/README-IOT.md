## Introduction
IoT's role in this project will take the users from the Blockchain network and list them as devices on the Watson IoT Platform everytime there's a new user created.

Besides that IoT will simulate a demo device and/or a real device can be chosen to display their data on the platform's dashboard. All these devices in this project will one Device Type.


![](https://raw.github.ibm.com/oohanne/code-share-images-and-notes/master/Screen%20Shot%202018-03-14%20at%2012.01.15%20AM.png?token=AAALGCcopkEHCeZ0dG51DXQYPoHfg7oTks5aw96iwA%3D%3D)


That's with the Watson IoT Platform, but within Node-Red our IoT app will run analytics to display the total steps and total fitcoins of all users. 

The app will also use a graph in real-time to show the Blockchain transactions coming to the IoT whether for new user creation, user validation or for generated values of steps and fitcoins.


![](https://raw.github.ibm.com/oohanne/code-share-images-and-notes/master/Screen%20Shot%202018-03-14%20at%2012.00.18%20AM.png?token=AAALGKIXG66ddW3tAq6pGNg-Eq1uASd2ks5aw97JwA%3D%3D)


## Steps of use
Copy all the contents in the json file inside the iot-analytics-node-red-json folder and paste them in the import part of your created Node-Red instance.

Blockchain Network will pass the blocks where all the information will be taken and be saved to be used for analytics and display the values on the Node-Red dashboard as seen in the above image. 

* Make sure to have Cloudant database service available and binded to your Bluemix/IBM Cloud app instance. Create in the Cloudant a database with the name of `secretmap`.

* Make sure also to have a Watson IoT Platform created and binded as a service too.

* Dashboard needs to be created in the Node-Red if it's not taken care of by the code import.


