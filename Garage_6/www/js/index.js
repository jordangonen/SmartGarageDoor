

document.addEventListener('deviceready', onDeviceReady, false);
var mainTopic = "cse222light/";
var privateTopic = "          // TODO: Fill in the string ID for your light
                               // (Should match the value used to program the Photon)

var particle;    // The Particle Object
var token;       // The user's token.  Retrieved after login
var state;     // The Photon's private state   (A JSON Object, like:  { inGroup:true/false, color:"rgb(x,y,z)"})
var groupState;  // The Group's state

// Variables for the elements we need to repeatedly access on the main page
var redSlider;
var greenSlider;
var blueSlider;
var groupCheckbox;
var privateColorDisplay;
var groupColorDisplay;

var loginPage;
var controlsPage;

function updateState(newState)  {
  // Update the state and all on-screen views
  state = newState;

  groupCheckbox.checked = state.inGroup;

  if(groupCheckbox.checked) {
    // Update range selectors
    redSlider.value = state.groupR*255/100;
    greenSlider.value = state.groupG*255/100;
    blueSlider.value = state.groupB*255/100;
  } else {
    // Update range selectors
    redSlider.value = state.myR*255/100;
    greenSlider.value = state.myG*255/100;
    blueSlider.value = state.myB*255/100;
  }
  privateColorDisplay.style.backgroundColor = "rgb(" + state.myR + "," + state.myG + "," + state.myB + ")";
  groupColorDisplay.style.backgroundColor = "rgb(" + state.groupR + "," + state.groupG + "," + state.groupB + ")";
}

function newLightEvent(e) {
  console.log("New Light Event");
//  console.dir(e)

  // If it's a private event, update the controls as needed
  if(e.name == mainTopic + privateTopic + "state") {
    console.log("New Private State")
    // If the "controls" are hidden (like just after a login), unhide them
    controlsPage.style.display = "block";
    console.log("Page shown")
    // Store a copy of the state (after parsing it to an object)
    var newState = JSON.parse(e.data);
    updateState(newState);
  } else {
    console.log("New Other.")
  }
}


function login() {
  console.log("Login started")
  particle = new Particle();
  // Get the username/password and start the login process
  var user = document.getElementById('username').value;
  var pass = document.getElementById('password').value;

  particle.login({username:user, password:pass}).then(
    function(data) {
      // If the login is successful, save the token, subscribe to event streams, and hide the login
      console.log("Login Success")
      token = data.body.access_token;
      // Subscribe to the entire event stream
      particle.getEventStream({ name: mainTopic, auth: token}).then(
          function(stream) {stream.on('event', newLightEvent); });

      // TODO: Hide login screen
      loginPage.style.display = "none";

      // TODO: Get the device state and, when it's available, unhide the control and set their values.
      particle.publishEvent({ name: (mainTopic + privateTopic + "getstate"), data:"", auth: token });
    },
    function (err) {
      // TODO: Show error message and stay on login screen
      alert("Login Failure. Try again.")
      console.log('Login Failure', err);
      console.dir(err);
    }
  );
}

function updateColorFromSlider() {
  // This is called if either the check box is changed or if the sliders move

  // Get the current color from the sliders
  var r = parseInt(redSlider.value*255/100);
  var g = parseInt(greenSlider.value*255/100);
  var b = parseInt(blueSlider.value*255/100);
  // Build a string suitable to be sent to Photons
  var color = r+","+g+","+b;
  var colorRGB = "rgb(" + color +")"

  // TODO: Publish the color when sliders change! (to your Photon/private color dependingo on checkbox)
  if(groupCheckbox.checked) {
    particle.publishEvent({ name: mainTopic+'group/setcolor', data:color, auth: token });
  } else {
    particle.publishEvent({ name: mainTopic + privateTopic + 'setcolor', data:color, auth: token });
  }
}

function updateGroup() {
  if(groupCheckbox.checked) {
    val = "yes";
  } else {
    val = "no";
  }
  particle.publishEvent({ name: mainTopic + privateTopic + 'ingroup', data:val, auth: token });
}


// Defer all major setup until everything is loaded and ready
function onDeviceReady() {
  console.log("Ready!")

  // Now that the page is loaded, setup variables to access common elements
  redSlider = document.getElementById('redSlider')
  greenSlider = document.getElementById('greenSlider')
  blueSlider = document.getElementById('blueSlider')
  groupCheckbox = document.getElementById('groupCheckbox')
  privateColorDisplay = document.getElementById('privateColorDisplay')
  groupColorDisplay = document.getElementById('groupColorDisplay')


  loginPage = document.getElementById('login')
  controlsPage = document.getElementById('controls')
  controlsPage.style.display = 'none'

  // Setup callbacks for events
  document.getElementById('loginButton').addEventListener('click',login)

  redSlider.addEventListener('change', updateColorFromSlider)
  greenSlider.addEventListener('change', updateColorFromSlider)
  blueSlider.addEventListener('change', updateColorFromSlider)
  groupCheckbox.addEventListener('change', updateGroup)
}
