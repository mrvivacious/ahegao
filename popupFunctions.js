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
  // Get the value from storage
  let onOffSpan = document.getElementById('onOffStatus');
  let onOffStatus = onOffSpan.innerText.toLowerCase();

  // Thank you, https://stackoverflow.com/questions/31696279/url-remains-undefined-in-chrome-tabs-query
  // We use this because calling window.location from within a popup
  //  returns the URL of the popup instead of the current website
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    let url = tabs[0].url;
    let hostname = extractHostname(url);

    // If on,
    // Toggle button to Off mode and save this site's
    //  hostname to storage
    if (onOffStatus === "on") {
      // Save
      chrome.storage.sync.set({[hostname]:true}, function() {
        // Toggle button
        onOffSpan.innerText = "Off";
        document.getElementById('onOffSwitch').style.background = "lightCoral";
      });
    }
    // Else, if off,
    // Toggle button to On mode and remove this site's hostname
    //  from storage
    // Finally, run animeTime
    else if (onOffStatus === "off") {
      // Remove
      // Note: you would want to use try-catch if you run a metric ton of
      //  operations, but we assume our users operate within reason, so we
      //  won't observe the try-catch practice here aka we are laaaazyyyyy
      chrome.storage.sync.remove([hostname], function() {});

      onOffSpan.innerText = "On";
      document.getElementById('onOffSwitch').style.background = "lightGreen";
      alert('anime time');
      animeTime();
    }
  });
}

// Function buttonOnClick
// When a category is clicked, we will set that value in storage
//  and then update the images on the page to reflect the changed category
function buttonOnClick() {
  set(this.id);
  document.getElementById("status").style.visibility = "";

  // set the right text for the extension page
  let category = this.id;
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
