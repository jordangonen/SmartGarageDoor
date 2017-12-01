

// This #include statement was automatically added by the Particle IDE.
#include "GarageHardware.h"
int state = 7; //state of FSM
boolean setupBool = false;
const int millisDelay = 100; //delta time delay
int remainingTime;
int passedTime;
const int redPin = A4;
const int greenPin = D0;
const int bluePin = D2;
Timer timer(5000, lightOff, true); //  garage light timer we used on board LED
boolean timerStarted = false; // for garage light auto off s
int lastRGB [6] = {0,0,0,41, 170, 270}; // return led state after error
boolean called = true;
boolean fullyOpen = false;
boolean fullyClosed  = true;
int millisButtonPress; // delta time
 boolean buttonState; // delta time
 int errorState; // for error throwing
boolean autoCloseOn = false;
unsigned int period = 0;
void remote(String event, String data) {
    if (state == 6) {
      webButton("errorPress");
    }
    else {
        webButton("press");
    }



}
  Timer autoClose(10, autoCloseTrigger, true);




void setup() {
  Serial.begin(9600); //set up serial connection
  Particle.publish("state", String(state), 60, PRIVATE);




 pinMode(D7, OUTPUT);

// RGB LED
pinMode( redPin, OUTPUT);
pinMode( greenPin, OUTPUT);
pinMode( bluePin, OUTPUT);
rgbSetter(255, 255, 255);

// cloud functions and variable defs
Particle.function("webButton", webButton);
Particle.function("autoCloseWeb", autoCloseWeb);
Particle.variable("varState", state);
Particle.variable("autoCloseOn", autoCloseOn);
Particle.subscribe("garagedoor/button", remote, MY_DEVICES);
    setupHardware(); // from API

}

void loop() {

    firstState();
    fault(); //check for fault
    atTop();// check if at top
     atBottom(); // check if at bottom
     deltaTimingStart(); // start delta timing
    deltaTimingTrigger(); // fire delta timing
    endFault(); // check for fault off


}










// OUR METHODS

// void timerOver(){

//     switch (state) {
//     case 0:
//     //down


//       break;
//     case 1:
//     //going down
//     Serial.println("down");
//     state = 0;
//       break;
//     case 2:
//     //going up

//     Serial.println("up");
//      state = 3;
//       break;
//     case 3:
//     //up

//       break;
//     case 4:
//      //stopped going down
//       break;
//     case 5:
//   //stopped going up
//         break;
//     case 6:
//     //error

//         break;

//   }
// }

void rgbSetter(int r, int g, int b) { // parameters are the 0-255 r,g,b values
    //this section sets the start of the array of two rgb
    //color numbers to the last color used so that, in
    //the case of a service error, color can be restored
    lastRGB[0] = lastRGB[3];
    lastRGB[1] = lastRGB[4];
    lastRGB[2] = lastRGB[5];
    //set 3,4,5 -> r,g,b
    lastRGB[3] = r;
    lastRGB[4] = g;
    lastRGB[5] = b;
    //write the new color to the LED
    analogWrite(redPin, r);
    analogWrite(greenPin, g);
    analogWrite(bluePin, b);

    //colors
    //up
    //255, 0, 16
    //going up
    //165, 24, 97
    //stopped going up
    //25, 22, 173
    //down
    //41, 170, 27
    //going down
    //255, 0, 255
    //stopped going down
    //255, 225, 0

}


void lightOff() {
    setLight(false);
    timerStarted = false;
}

void goUp() {
    state = 2; // increment state
    Particle.publish("state", String(state), 60, PRIVATE);
    timer.stop(); // stop active timer
    timerStarted = false;
    setLight(true); // change state of overhead light
    rgbSetter(165,24,97);
    startMotorOpening(); // call API
    fullyClosed = false; // simulate change in state of end stop sensor
    // timer.changePeriod(param);
    // timer.start();
    // passedTime = millis();
    Serial.println("going up");
}

void goDown() {

    state = 1; // increment state

    Particle.publish("state", String(state), 60, PRIVATE);
    startMotorClosing(); // call API
    fullyOpen = false; // simulate change in end state sensor
    timer.stop();
     timerStarted = false;
    setLight(true); // change overhead light state
    rgbSetter(255,0,255);
    // timer.changePeriod(param);
    // timer.start();
    // passedTime = millis();
    Serial.println("going down");
}

void goingUp(){
    state = 5; // increment state
   Particle.publish("state", String(state), 60, PRIVATE);
    stopMotor(); // call API
    // timer.stop();
    // remainingTime = millis() - passedTime;
    // timer.changePeriod(remainingTime);
    Serial.println("stopped going up, will go down on next press");
    rgbSetter(25, 22, 173); // change lED state
}

void goingDown(){

    state = 4; // increment state
    Particle.publish("state", String(state), 60, PRIVATE);
    stopMotor(); // call API
    // timer.stop();
    // remainingTime = millis() - passedTime;
    // timer.changePeriod(remainingTime);
    Serial.println("stopped going down, will go up on next press");
    rgbSetter(255, 225, 0); // change lED
}



//FSM diagram with key can be found at https://goo.gl/SGu56w
void fSM(int param) { // param is the state passed into the state machine
    switch (param) {
    case 0: //if the state is 0 (the door was down when the fsm was called) call goUp()
    goUp();


      break;
    case 1: // if the state is 1(going down) when the fsm was called, call goingDown()
    //going down
      goingDown();
      break;
    case 2: // if the state is 2(going up) when the fsm was called, call goingUp()
    goingUp();
      break;
    case 3: // if the state is 3(up) when the fsm was called, call goDown()
    //up
      goDown();
     break;
    case 4: // if the state is 4(stopped going down) when the fsm was called, call goUp()
     //stopped going down
     goUp();
      break;
    case 5: // if the state is 5(stopped going up) when the fsm was called, call goDown()
    goDown();
        break;
    case 6:
    state = errorState;
    webButton("errorPress");


    //error

        break;
    case 7:
    break;

  }
}

void fault() {
     if (isFaultActive() && state != 6) { // if the fault is triggered and we are not in the fault state
        if (state == 4 ) {
            errorState = 1;
        }
        if (state == 5 ) {
            errorState = 2;
        }
        if (state != 4 && state !=5 ) {
            errorState = state; // save the last state
        }

        state = 6; // state is now the error state
       Particle.publish("state", String(state), 60, PRIVATE);
        rgbSetter(0,0,0); // LED off
        Serial.println("error");
        delay(100);


    }
}

void atTop(){
    if (state == 2 && (isDoorFullyOpen() || fullyOpen)) { // if the state is going up and we hit an endstop
        state = 3; // state is up
        autoCloseCaller();
       Particle.publish("state", String(state), 60, PRIVATE);
       fullyClosed = false;
        fullyOpen = true;
        rgbSetter(255, 0, 16);
        Serial.println("up");

       timerStarted = true;
       timer.start(); //start overhead light
        // Serial.println("light timer started");


    }
}

void atBottom() {
    if (state == 1 && (isDoorFullyClosed() || fullyClosed)) { // if the state is going down and we hit an endstop
        state = 0;
        Particle.publish("state", String(state), 60, PRIVATE);
        fullyClosed = true;
        fullyOpen = false;
        rgbSetter(41, 170, 27);
        Serial.println("down");

       timerStarted = true;
       timer.start(); // start overhead light
    //   Serial.println("light timer started");

    }
}

void deltaTimingStart(){
    if (isButtonPressed() == true && buttonState == false){ // delta timing  start, if api call is true and the button wasnt already pressed
       buttonState = true;  // button is pressed
       millisButtonPress = millis(); // record time at time of button press
       called = false; // we have not called the trigger yet
   }
}

void deltaTimingTrigger() {
    if((millis() - millisButtonPress) > millisDelay  ) { // delta timing trigger, if current time - button pressed time > 100ms delay
       if (called == false) { // if we have not called the trigger yet
           fSM(state); // call to FSM
           setLight(true); // call to change light state
           called = true; // we have called trigger
       }
       if(buttonState != isButtonPressed()) { // if the button is no longer pressed, change state

            buttonState = false;
       }

   }
}

int webButton( String command ) {
    if (command == "press") {
        fSM(state); // call to FSM
   setLight(true); // call to change light state
   return 1;
    }
     if (command == "errorPress") { // when pressing out of an error
         if (state==6) { // confirm state is error
         Serial.println("out of error");
        rgbSetter(lastRGB[1],lastRGB[2],lastRGB[3]); // reset color
        state = errorState; //reset state
        Particle.publish("state", String(state), 60, PRIVATE);
        fSM(state);
        return 1;
            }
            Serial.println(command); // errorPress sent but not in error state
    return -1;
    }
    if (command == "info") { // if we ask for info
        Serial.println(state);
        return 2;
    }

    else {
        Serial.println(command); // nothing usable was sent in
        return -1;
    }



}

int autoCloseWeb( String command) {
  if (command == "0") {
    autoCloseOn = false;
      Serial.println("auto close timer turned off");
    return 1;
  }
  if (command.toInt() != 0) {
    autoCloseOn = true;
    period = abs(command.toInt());

    Serial.print("new period: ");
    Serial.println(period);
    return 1;
  }
  else {
    return 0;
  }

}

void autoCloseCaller() {
  if (autoCloseOn) {
    autoClose.changePeriod(period);
    autoClose.start();
    Serial.println("auto close timer started");
  }

}


void endFault() {
    if (isButtonPressed() == true && state == 6) { //come out of fault

        while(isButtonPressed() == true) {

        }
        Serial.println("out of error");
        rgbSetter(lastRGB[1],lastRGB[2],lastRGB[3]); // reset color
        state = errorState; //reset state



    }

}

void autoCloseTrigger() {
  if (state == 3) {
    Serial.println("timer finished");

    fSM(state);
}
}
void firstState() {
  if (setupBool == false) {

    if (isDoorFullyOpen()) {
      state = 3;
      autoCloseCaller();
     Particle.publish("state", String(state), 60, PRIVATE);
      fullyOpen = true;
      rgbSetter(255, 0, 16);
      Serial.println("initial state set to up");

     timerStarted = true;
     timer.start(); //start overhead light
      // Serial.println("light timer started");
      setupBool = true;
      Particle.publish("state", String(state), 60, PRIVATE);
    }
    if (isDoorFullyClosed()) {
      state = 0;
      Particle.publish("state", String(state), 60, PRIVATE);
      fullyClosed = true;
      rgbSetter(41, 170, 27);
      Serial.println("initial state set to down");

     timerStarted = true;
     timer.start(); // start overhead light
  //   Serial.println("light timer started");
      setupBool = true;
      Particle.publish("state", String(state), 60, PRIVATE);
    }
  }
}
