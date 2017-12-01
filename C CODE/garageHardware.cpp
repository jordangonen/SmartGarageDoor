#if 1
#include"GarageHardware.h"
#include "Arduino.h"





// TODO: Define any variables or constants here



const int faultPin = D5;
const int endStopUpPin = D3;
const int endStopDownPin = D4;
const int controlButtonPin = D1;


/**
 * Setup the door hardware (all I/O should be configured here)
 *
 * This routine should be called only once from setup()
 */

void setupHardware() {
  // Button
    pinMode(controlButtonPin, INPUT_PULLUP);

      pinMode(endStopUpPin, INPUT_PULLUP);
       pinMode(endStopDownPin, INPUT_PULLUP);


  // TODO: Your code to setup your "simulated" hardware


// while (state == -1) {
//   if (endStopUpPin == 0) {
//     state = 3;
//   }
//   if (endStopDownPin == 0) {
//     state = 0;
//   }
// }

Serial.print("Welcome"); // if i time it perfectly i see this
}


/**
 * Return true if the door open/close button is pressed
 *
 * Note: this is directly based on hardware.  No debouncing or
 *       other processing is performed.
 *
 * return  true if buttons is currently pressed, false otherwise
 */
bool isButtonPressed() {
  int upDown;
    //check if the button is currently pressed by digital read
    if(digitalRead(controlButtonPin)==0) {
        return true;
    } else {
        return false;
    }
}



/**
 * Return true if the door is fully closed
 *
 * Note: This is directly based on hardware.  No debouncing or
 *       other processing is performed.
 *
 * return  true if the door is completely closed, false otherwise
 */
bool isDoorFullyClosed() {
  // TODO: Your code to simulate the closed switch
  //       Use a button, switch, or wired (connected to 3V or GND)
 //end stop sensor simulated with a bool

 if ( digitalRead(endStopDownPin) == 0) {

     return true;
 }


  else {
      return false;
  }
}

/**
 * Return true if the door has experienced a fault
 *
 * Note: This is directly based on hardware.  No debouncing or
 *       other processing is performed.
 *
 * return  true if the door is has experienced a fault
 */
bool isFaultActive() {
  // TODO: Your code to simulate the fault
  //       Use a button, switch, or wired (connected to 3V or GND)
  if (digitalRead(faultPin) == 0) {
      return true;
  }
  else {
      return false;
  }

}

/**
 * Return true if the door is fully open
 *
 * Note: This is directly based on hardware.  No debouncing or
 *       other processing is performed.
 *
 * return  true if the door is completely open, false otherwise
 */
bool isDoorFullyOpen() {
  // TODO: Your code to simulate the opened switch
  //       Use a button, switch, or wired (connected to 3V or GND)

 if ( digitalRead(endStopUpPin) ==0) {

     return true;
 }


  else {
      return false;
  }
}

/**
 * This function will start the motor moving in a direction that opens the door.
 *
 * Note: This is a non-blocking function.  It will return immediately
 *       and the motor will continue to opperate until stopped or reversed.
 *
 * return void
 */
void startMotorOpening() {
  // TODO: Your code to simulate the motor opening
  //       Use an individual LED
   rgbSetter(165, 24, 97); //set LED

}

/**
 * This function will start the motor moving in a direction closes the door.
 *
 * Note: This is a non-blocking function.  It will return immediately
 *       and the motor will continue to opperate until stopped or reversed.
 *
 * return void
 */
void startMotorClosing() {
  // TODO: Your code to simulate the motor closing
  //       Use an individual LED
   rgbSetter(255, 0, 255); // set LED



}

/**
 * This function will stop all motor movement.
 *
 * Note: This is a non-blocking function.  It will return immediately.
 *
 * return void
 */
void stopMotor() {
  // TODO: Your code to simulate the motor being stopped
  //       Should impact the opening/closing LEDs
}

/**
 * This function will control the state of the light on the opener.
 *
 * Parameter: on: true indicates the light should enter the "on" state;
 *                false indicates the light should enter the "off" state
 *
 * Note: This is a non-blocking function.  It will return immediately.
 *
 * return void
 */
void setLight(boolean on) {
  // TODO: Your code to simulate the light
  //       Use an individual LED

   if (on == true) {
    digitalWrite(D7, HIGH);
    //  Serial.println("light on");
    }
    if (on == false) {
        digitalWrite(D7, LOW);

    }
}


/**
 * This function will control the state of the light on the opener.
 * (OPTIONAL:  This is only needed for the extra credit part of assignment 3)
 *
 * Parameter: cycle (0-100).  0 indicates completely Off, 100 indicates completely on.
 *            intermediate values are the duty cycle (as a percent)
 *
 * Note: This is a non-blocking function.  It will return immediately.
 *
 * return void
 */
void setLightPWM(int cyclePct) {
  // TODO: Your code to simulate the light
  //       Use an individual LED
}
#endif
