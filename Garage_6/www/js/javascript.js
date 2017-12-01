//users
var user1; //user object for the session
var currentView; //current display
var newUser = false; //has a new user been created?
var timer;
var deviceId = '240035001347343438323536';

var autoTime;
document.getElementById("card").style.display == "none";
document.getElementById("notLoaded").innerHTML = "Please connect photon";
console.log("waiting");

var fsmCalled = false;



//assignment 5

var particle = new Particle();
var productId = "6153";
var clientId = "washu-garage-door-5162";
var clientToken = "882ec3178524a02ad8bdb1473fd6aaa143f5a38c";

var deviceOneId = "240035001347343438323536";

// pass to login
document.getElementById("login-btn").addEventListener("click", function() {
        var username = document.getElementById('email').value;
        var pass = document.getElementById('pw').value;
        console.log("clicked");
        particle.login({
                username: username,
                password: pass
        }).then(logSuccess, logFail)
});
var token;
// if login is successful
function logSuccess(data) {
        token = data.body.access_token;
        // get the currentStateDoor from varState as soon as it gets connected
        particle.getVariable({
                deviceId: deviceId,
                name: "varState",
                auth: token
        }).then(function(data) {
                // console.log('Device variable retrieved successfully:', data);
                stateMover(data);
                displayElement("login-page", "main-page");
                document.getElementById("card").style.display = "block";
                document.getElementById("log-out").style.display = "block";
                document.getElementById("notLoaded").innerHTML = "";
                console.log("received data");
                // stateMover(currentStateDoor);
                console.log(currentStateDoor);
                // if an error occurs
        }, function(err) {
          //errors
                // console.log('An error occurred while getting attrs:', err);
        });
        // reloads page to login
        document.getElementById("log-out").addEventListener("click", function() {
                location.reload();
        });

        particle.getVariable({
                deviceId: deviceId,
                name: "autoCloseOn",
                auth: token
        }).then(function(data) {
                // console.log('Device variable retrieved successfully:', data);
                autoTime = data.body.result;
                if (!autoTime) {
                        document.getElementById("enable_auto").addEventListener("click", function() {
                                //  displayElement(enable_auto,settings_module);
                                document.getElementById("autoState").innerHTML = "Auto-Close is Off";
                                document.getElementById("settings_module").style.display = "block";
                                document.getElementById("enable_auto").style.display = "none";
                        });

                }
                if (autoTime) {
                        document.getElementById("settings_module").style.display = "block";
                        document.getElementById("enable_auto").style.display = "none";
                        document.getElementById("autoState").innerHTML = "Auto-Close is On";
                }
                console.log(autoTime);
        }, function(err) {
        });

        particle.getEventStream({
                deviceId: deviceOneId,
                auth: token,
                name: 'state'
        }).then(function(stream) {
                console.log("justin hates this");
                stream.on('state', stateMover)
        }, function(err) {
                console.log("error setting")
        });

}
// if login fail
function logFail(data) {
        alert("Wrong Username/Password, Please Try Again");
        console.log("fail");
}

var name;
var currentStateDoor;
// statemover function that is called when eventStream is received
function stateMover(data) {
        console.log("in");
        // if we've already called the door , just use data.data
        if (fsmCalled == true) {
                currentStateDoor = data.data;
                console.log("truething");
                console.log("this is the " + currentStateDoor);
        }
        // if we have not already called the door (meaning this is the first time) , use data.body.result and convert it to a string
        if (fsmCalled == false) {
                // set state of FSM = true
                console.log("falsething")
                fsmCalled = true;
                currentStateDoor = data.body.result;
                // convert to a string
                currentStateDoor = currentStateDoor.toString();
                console.log(currentStateDoor);
        }

        // console.log(data.data);

        // green rgb(65, 159, 49)
        // red rgb(247, 47, 47)
        // waiting 'rgb(247, 231, 12)'

        //finite state machine with our current state of door
        switch (currentStateDoor) {
                // down state
                case "0":
                        console.log("Down");
                        // html updates
                        document.getElementById('card-title').innerHTML = "Door is Down";
                        document.getElementById('close-btn').innerHTML = "Open";
                        document.getElementById('open').style.backgroundColor = 'rgb(65, 159, 49)';
                        break;
                        //going down state
                case "1":
                        console.log("Going Down");

                        // html updates
                        document.getElementById('card-title').innerHTML = "Door is Going Down";
                        document.getElementById('close-btn').innerHTML = "Stop";
                        document.getElementById('open').style.backgroundColor = 'rgb(247, 231, 12)';
                        // clearTimeout(timer);
                        // document.getElementById('close-btn').innerHTML = "Close";
                        break;
                        // going up state
                case "2":
                        console.log("Going Up");
                        // html updates
                        document.getElementById('card-title').innerHTML = "Door is Going Up";
                        document.getElementById('close-btn').innerHTML = "Stop";
                        document.getElementById('open').style.backgroundColor = 'rgb(247, 231, 12)';
                        break;
                        // up state
                case "3":
                        console.log("Up");
                        //html/css updates
                        document.getElementById('card-title').innerHTML = "Door is Up";
                        document.getElementById('close-btn').innerHTML = "Close";
                        document.getElementById('open').style.backgroundColor = 'rgb(247, 47, 47)';
                        // if up, you can have the timer called
                        // if (autoTimer == true) {
                        //        timer = setTimeout(autoClose, timeValue*1000);
                        // }

                        break;

                        // stopped down state
                case "4":
                        console.log("Stopped Down");
                        //html/css updates
                        document.getElementById('card-title').innerHTML = "Door is Stopped Going Down";
                        document.getElementById('close-btn').innerHTML = "Resume";
                        document.getElementById('open').style.backgroundColor = 'rgb(247, 231, 12)';
                        break;
                        // stopped up state
                case "5":
                        console.log("Stopped Up");
                        //html/css updates
                        document.getElementById('card-title').innerHTML = "Door is Stopped Going Up";
                        document.getElementById('close-btn').innerHTML = "Resume";
                        document.getElementById('open').style.backgroundColor = 'rgb(247, 231, 12)';
                        break;
                        //error state
                case "6":
                        console.log("Error");
                        //html/css updates
                        document.getElementById('card-title').innerHTML = "ERROR";
                        document.getElementById('close-btn').innerHTML = "PRESS TO FIX";
                        document.getElementById('open').style.backgroundColor = 'rgb(70,130,180)';
                        // clearTimeout(timer);
                        break;
                        // default:


                case "7":
                        console.log("choose state");
                        //html/css updates
                        document.getElementById('card-title').innerHTML = "Waiting for End Stop Hit";
                        document.getElementById('close-btn').innerHTML = "hit end stop";
                        document.getElementById('open').style.backgroundColor = 'rgb(70,130,180)';
                        break;
        }
}

var argument;
// if error button is getting pressed
document.getElementById("close-btn").addEventListener("click", function() {
        if (currentStateDoor == 6) {
                // set equal to error press to pass through the call function
                argument = "errorPress";
        } else {
                // leave as just press
                argument = "press";
        }
        // callFunction WebButton (in C) when we have a press (if error, use Error press then)
        console.log("1 " + token);
        var moveState = particle.callFunction({
                deviceId: deviceId,
                name: 'webButton',
                argument: argument,
                auth: token
        });
        console.log("2 " + token);
        moveState.then(
                function(data) {
                        console.log('Function called succesfully:', data);
                },
                function(err) {
                        console.log('An error occurred:', err);
                });
});


var secs = 2;
// enable auto close
document.getElementById("enable_auto").addEventListener("click", function() {
        secs = document.getElementById("example-number-input").value;
        secs = secs.toString() + "000";

        var autoTimer = particle.callFunction({
                deviceId: deviceId,
                name: 'autoCloseWeb',
                argument: secs,
                auth: token
        });
        autoTimer.then(
                function(data) {
                        console.log('Function called succesfully:', data);
                },
                function(err) {
                        console.log('An error occurred:', err);
                });
});

document.getElementById("save_setting").addEventListener("click", function() {
        secs = document.getElementById("example-number-input").value;
        secs = secs.toString() + "000";

        var autoTimer = particle.callFunction({
                deviceId: deviceId,
                name: 'autoCloseWeb',
                argument: secs,
                auth: token
        });
        autoTimer.then(
                function(data) {
                        console.log('Function called succesfully:', data);
                },
                function(err) {
                        console.log('An error occurred:', err);
                });
});
document.getElementById("turn_off").addEventListener("click", function() {
        secs = 0;
        secs = secs.toString();

        var autoTimer = particle.callFunction({
                deviceId: deviceId,
                name: 'autoCloseWeb',
                argument: secs,
                auth: token
        });
        autoTimer.then(
                function(data) {
                        console.log('Function called succesfully:', data);
                },
                function(err) {
                        console.log('An error occurred:', err);
                });
});



var timeValue;

// moves the javascript for settings to show the autocloser

// turns off the auto closer
document.getElementById("turn_off").addEventListener("click", function() {
        //  displayElement(enable_auto,settings_module);

        // html updates
        document.getElementById("settings_module").style.display = "none";
        document.getElementById("enable_auto").style.display = "block";
        document.getElementById("autoState").innerHTML = "AutoClose is Off";
        document.getElementById("offButton").style.display = "none";


});
// saves / updates the autocloser
document.getElementById("save_setting").addEventListener("click", function() {
        //  displayElement(enable_auto,settings_module);

        //pulls the value
        timeValue = document.getElementById("example-number-input").value;
        // html updates
        document.getElementById("autoState").innerHTML = "AutoClose is On";
        document.getElementById("offButton").style.display = "block";
        document.getElementById("save_setting").innerHTML = "Update";


});


// runs the autoClose function
// function autoClose() {
//         argument = "press";
//         // calls the web button function on pres
//         var moveState = particle.callFunction({ deviceId: deviceId, name: 'webButton', argument:argument, auth: token });
//         moveState.then(
//         function(data) {
//           console.log('Function called succesfully:', data);
//         }, function(err) {
//           console.log('An error occurred:', err);
//         });
// }


//  console.log("open: ", data);});


//array of user account objects
var users = [

        user1 = {
                door: {
                        state: 3, // 0 for down, 1 for coming down, 2 for going up, 3 for up
                        temp: "72f",
                        hum: "34%",
                        motion: true, // boolean

                },
                email: "test@test.com",
                password: "test",
                phone: "5555555555",
                id: 1234563,
                settings: {
                        name: "Home",
                        temp: true,
                        hum: true,
                        motion: true,
                        autoClose: 14,
                        autoOpen: 200,
                        mobile: {
                                open: true,
                                close: true,
                                openFor: 11,
                        }

                }
        },
        user2 = {
                door: {
                        state: 0, // 0 for down, 1 for coming down, 2 for going up, 3 for up
                        temp: "72f",
                        hum: "34%",
                        motion: true, // boolean

                },
                email: "dotard@down.us",
                password: "maga",
                phone: "5555555566",
                id: 9876123,
                settings: {
                        name: "Home",
                        temp: true,
                        hum: true,
                        motion: true,
                        autoClose: 14,
                        autoOpen: 200,
                        mobile: {
                                open: true,
                                close: true,
                                openFor: 11,
                        }

                }
        }

];




//main page initilization function

function mainSetter() {
        titleSetter();
        settingsSetter();

        if (user1.door.state == 0) {
                document.getElementById('open').style.backgroundColor = 'rgb(65, 159, 49)';
        }
        if (user1.door.state == 3) {
                document.getElementById('open').style.backgroundColor = 'rgb(247, 47, 47)';
        }

}


function settingsSetter() { //initilies the settings states
        document.getElementById('garage-name').value = user1.settings.name;
        document.getElementById('garage-id').value = user1.id;
        document.getElementById('temp-check').checked = user1.settings.temp;
        document.getElementById('hum-check').checked = user1.settings.hum;
        document.getElementById('motion-check').checked = user1.settings.motion
        document.getElementById('example-number-input').value = user1.settings.autoClose;
        document.getElementById('yard-input').value = user1.settings.autoOpen;
        document.getElementById('door-opens-check').checked = user1.settings.mobile.open;
        document.getElementById('door-closes-check').checked = user1.settings.mobile.close;
        document.getElementById('door-open-check').checked = user1.settings.mobile.openFor;
}

function sensorDisplay() {
        var tempState = document.getElementById('temp-check').checked;
        console.log(document.getElementById('temp-check').checked);
        var humState = document.getElementById('hum-check').checked;
        var motionState = document.getElementById('motion-check').checked;

        if (tempState == true) {
                document.getElementById('temp-display').innerHTML = user1.door.temp;
        }
        if (tempState == false) {
                document.getElementById('temp-display').innerHTML = "";
        }
        if (humState == true) {
                document.getElementById('hum-display').innerHTML = user1.door.hum;
        }
        if (humState == false) {
                document.getElementById('hum-display').innerHTML = "";
        }
        if (motionState == true) {
                document.getElementById('motion-display').innerHTML = user1.door.motion;
        }
        if (motionState == false) {
                document.getElementById('motion-display').innerHTML = "";
        }
}


// Display Element swapping function
function displayElement(hide, show) {
        document.getElementById(hide).style.display = 'none';
        document.getElementById(show).style.display = 'block';
        currentView = show;
}
// sets single display

function singleDisplay(x) {
        document.getElementById(x).style.display = 'block';
}

// save button does
document.getElementById("save-btn").addEventListener("click", function() {
        sensorDisplay();
        displayElement("edit-page", "main-page");
});

document.getElementById("close-btn").addEventListener("click", function() {
        // stateChange();
});


function passWrite() {
        var requestUser;
        if (document.getElementById('request-email').value == user1.email) {
                requestUser = user1;

        }
        if (document.getElementById('request-email').value == user2.email) {
                requestUser = user2;
        }
        if (newUser == true) {
                if (document.getElementById('request-email').value == user3.email) {
                        requestUser = user3;

                }
        }

        console.log(requestUser);
        alert('Your password is ' + requestUser.password);


}

function passScrape() {

}
