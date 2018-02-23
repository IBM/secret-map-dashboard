## Application Setup

* Install **maven** and **mongodb** on system.
* Verify the **executionURL**, **resultURL** urls from **ExecutionApp.java** and **ResultGenerator.java**.
* Make your are connecting to correct **mongodb** instance.
* Open terminal and run the following commands to setup the project
```bash
mvn compile
```
* Now run the execution cli app
```bash
mvn exec:java -Dexec.mainClass="secretApp.testApp.ExecutionApp"
```
* In a new terminal, run the test result loader Application
```bash
mvn exec:java -Dexec.mainClass="secretApp.testApp.ResultGenerator"
```
>Note: To view the results you can download robomongo/ Robo 3T
