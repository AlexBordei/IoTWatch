/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    /**
     * Rotates element with a specific ID
     * @private
     * @param {string} elementID - ID of the element to be rotated
     * @param {number} angle - angle of rotation
     */
    function rotateElement(elementID, angle) {
        var element = document.querySelector("#" + elementID);

        element.style.transform = "rotate(" + angle + "deg)";
    }

    var client = new XMLHttpRequest();
    
    /**
     * Updates the hour/minute/second hands according to the current time
     * @private
     */

    function updateTime() {
    	tizen.humanactivitymonitor.start('HRM', onchangedCB);
  	    
        var datetime = tizen.time.getCurrentDateTime(),
            hour = datetime.getHours(),
            minute = datetime.getMinutes(),
            second = datetime.getSeconds();

        // Rotate the hour/minute/second hands
        rotateElement("hand-main-hour", (hour + (minute / 60) + (second / 3600)) * 30);
        rotateElement("hand-main-minute", (minute + second / 60) * 6);
        rotateElement("hand-main-second", second * 6);

	  
    }
    

	var steps = 0;
    function onchangedCB(hrmInfo) {

        if (hrmInfo.heartRate > 0) {
        	
        	 var params = '';
     	    params = 
     	    	'action=store' + 
     	    	'&heartrate=' + hrmInfo.heartRate + 
     	    	'&steps=' + steps;
     	    
     	    client.onerror = onerrorhandler;
     	    client.onload = onloadhandler;
     	    
     	    client.open('GET', 'http://iot.app.whiz.ro/wp-json/wp-iot/v1/watchpersons/37?' + params);
     	    client.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     	    
     	    client.send(params);
     	    
     	    function onerrorhandler(e) {
     	        console.log(e);
     	    }

     	    /* When the request is successfully terminated */
     	    function onloadhandler(e) {
     	    	console.log(e);
     	    }
        	
            /* Stop the sensor after detecting a few changes */
            tizen.humanactivitymonitor.stop('HRM');
        }
    }
    function onStepsError(){
    	
    }
    /**
     * Sets default event listeners.
     * @private
     */
    function bindEvents() {
        // Add an event listener to update the screen immediately when the device wakes up
        document.addEventListener("visibilitychange", function() {
            if (!document.hidden) {
                updateTime();
            }
        });

        // Add eventListener to update the screen when the time zone is changed
        tizen.time.setTimezoneChangeListener(function() {
            updateTime();
        });
    }
    
    var pedometer = null,
    pedometerData = {},

    CONTEXT_TYPE = 'PEDOMETER';

    /**
     * Initiates the application
     * @private
     */
    function init() {
        bindEvents();
        tizen.humanactivitymonitor.setAccumulativePedometerListener(pedoChanged);
        tizen.humanactivitymonitor.start("PEDOMETER", pedoChanged);
        // Update the watch hands every second
        setInterval(function() {
            updateTime();
        }, 10000);
    }
    
    pedometer = (tizen && tizen.humanactivitymonitor) || (window.webapis && window.webapis.motion) || null;
    
    pedometer.start(
            CONTEXT_TYPE,
            function onSuccess(pedometerInfo) {
               
                   steps = pedometerInfo.cumulativeTotalStepCount;
                   
            
                // TODO

            }
        );
            

    window.onload = init();
}());