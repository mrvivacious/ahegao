// Thank you, https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function extractHostname(url) {
  let hostname;

  // Find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    // Split into ['https:', '', 'hostnameBeforePath']
    // [2] grabs the 'hostnameBeforePath'
    hostname = url.split('/')[2];
  }
  else {
    // Otherwise, split the hostname and path and save the hostname
    hostname = url.split('/')[0];
  }

  // Find & remove port number
  hostname = hostname.split(':')[0];

  // Find & remove "?"
  hostname = hostname.split('?')[0];

  // Thank you, https://github.com/mrvivacious/PorNo-_public/blob/master/porNo.js#L194
  // If there is a www. header, remove it
  if (hostname.includes('www.')) {
    let idxOfPeriod = hostname.indexOf('.');
    hostname = hostname.substring(idxOfPeriod + 1, hostname.length);
  }

  return hostname;
}

// Function toggleOnOff
// Turn ahegao on or off for a particular website,
//  such as Google Images (LMAO)
function toggleOnOff() {
  // Get the status from the ahegao switch
  // The text inside the button
  onOffSwitch = document.getElementById("onOffSwitch");
  let onOffStatus = onOffSwitch.innerText.toLowerCase();

  // If on,
  // Toggle button to Off mode and save this site's
  //  hostname to storage
  if (onOffStatus.includes("on")) {
    // Save the hostname to storage to avoid repointing
    chrome.storage.sync.set({[hostname]:true}, function() {
      // Toggle button
      // alert('we switch off');
      onOffSwitch.innerText = "Off";
      document.getElementById('onOffSwitch').style.background = "lightCoral";

      currentMode.innerText = "Please refresh the page ~";
    });
  }
  // Else, if off,
  // Toggle button to On mode and remove this site's hostname
  //  from storage
  // Finally, run animeTime
  else if (onOffStatus.includes("off")) {
    // Remove
    // Note: you would want to use try-catch if you run a metric ton of
    //  operations, but we assume our users operate within reason, so we
    //  won't observe the try-catch practice here aka we are laaaazyyyyy
    chrome.storage.sync.remove(hostname, function() {});

    // Get the current category
    chrome.storage.sync.get("currentURLs", function(returnValue) {
      category = returnValue["currentURLs"];
      // alert(category);

      // ahegao
      // do the live reload by sending message to active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {category});
      });

      // Set the switch button coloring appropriately
      currentMode.innerText = categoryPrompt + category;

      onOffSwitch.innerText = "On";
      onOffSwitch.style.background = "lightGreen";
    });
  }
}

// Function buttonOnClick
// When a category is clicked, we will set that value in storage
//  and then update the images on the page to reflect the changed category
function buttonOnClick() {
  // If ahegao is off, do nothing
  // The text inside the ahegao switch
  onOffSwitch = document.getElementById("onOffSwitch");
  let onOffStatus = onOffSwitch.innerText.toLowerCase();

  // If off,
  // Do nothing
  if (onOffStatus.includes("off")) {
    return;
  }

  // Else,
  else {
    // alert(this.id);
    category = this.id;
    chrome.storage.sync.set({currentURLs:category}, function() {});

    // do the live reload by sending message to active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {category});
    });
  }
}

// Function initPopup
// Color the onOffSwitch based on on/off setting of current website
// Add the event listeners to the buttons in the popup, enabling
//  desired functionality
function initPopup() {
  // alert('popup opened');
  // Attach event listeners for click events
  // Thank you, https://www.w3schools.com/js/js_htmldom_eventlistener.asp
  onOffSwitch.addEventListener("click", toggleOnOff);

  for (let btn = 0; buttons[btn]; btn++) {
  buttons[btn].addEventListener("click", buttonOnClick);
  }

  // onOffSwitch recolor based on page status
  // Thank you, https://stackoverflow.com/questions/31696279/url-remains-undefined-in-chrome-tabs-query
  // We use this because calling window.location from within a popup
  //  returns the URL of the popup instead of the current website
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    let url = tabs[0].url;
    hostname = extractHostname(url);

    // If URL is in storage, color the toggleOnOff button in "Off" mode
    chrome.storage.sync.get(hostname, function(returnValue) {
      // alert(returnValue[hostname]);

      if (returnValue[hostname]) {
        // Recolor button
        onOffSwitch.innerText = "Off";
        onOffSwitch.style.background = "lightCoral";

        currentMode.innerText = "ahegao is off 🤔???";
      }
      // Else, the button is the "On" mode, so just set the category text
      else {
        chrome.storage.sync.get("currentURLs", function(returnValue) {
          category = returnValue["currentURLs"];

          currentMode.innerText = categoryPrompt + category;
        });
      }
    });
  });
}

let categoryPrompt = "Current mode: ";
let hostname;
let category;

// Get the on/off button
let onOffSwitch = document.getElementById("onOffSwitch");

// The category buttons
let buttons = document.getElementsByTagName("button");

// The paragraph under the switch button
let currentMode = document.getElementById("currentMode");

initPopup();
