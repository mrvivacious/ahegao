function toggleOnOff() {
  // Get the value from storage
  let onOffSpan = document.getElementById('onOffStatus');
  let onOffStatus = onOffSpan.innerText.toLowerCase();

  // alert(onOffStatus);

  // If on, do off process
  if (onOffStatus === "on") {
    onOffSpan.innerText = "Off";
    document.getElementById('onOffSwitch').style.background = "lightCoral";
  }

  // If off, do on process
  if (onOffStatus === "off") {
    onOffSpan.innerText = "On";
    document.getElementById('onOffSwitch').style.background = "lightGreen";
  }
}

// Function buttonOnClick
// When a category is clicked, we will set that value in storage
//  and then update the images on the page to reflect the changed category
function buttonOnClick() {
  set(this.id);
  document.getElementById("status").style.visibility = "";

  // set the right text for the extension page
  const category = this.id;
  let mode = document.getElementById('currentMode');
  if (mode) {
    mode.innerText = category;
  }
  // do the live reload by sending message to active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {category});
  });
}

// Function initPopup
// Add the event listeners to the buttons in the popup, enabling
//  desird functionality
function initPopup() {
  // onOffSwitch
  // Thank you, https://www.w3schools.com/js/js_htmldom_eventlistener.asp
  let onOffPara = document.getElementById("onOffSwitch");
  onOffPara.addEventListener("click", toggleOnOff);

  // Iterate over the buttons to add event listener
  let buttons = document.getElementsByTagName("button");

  for (let btn = 0; buttons[btn]; btn++) {
  buttons[btn].addEventListener("click", buttonOnClick);
  }
}

initPopup();
