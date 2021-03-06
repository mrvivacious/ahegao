// Find a better way to gather random anime faces than just hardcode lol
// ideas
// Pinterest api, collect images from people who post anime pix
// Pixiv api, same as above
//
// o custom lists
// o enable multiple lists at a time
// o preview mode

// Function set
// Set the desired list as the parameter for currentURLs in storage
//  to maintain content persistence throughout web-browsing
// @param category The category to set, taken from the id of the button clicked
function saveToStorage(category) {
  // Update the value in storage, then update the category var in our window, then run animeTime to replace the images
  chrome.storage.sync.set({currentURLs:category}, function() {});
}

// Function getRandomAnimePic
// Grabs a random item from the currently selected array
function getRandomAnimePic() {
  // alert('get random anime pic')

  let numPics = currentURLs.length;
  let index = Math.floor(Math.random() * numPics);
  let pic = currentURLs[index];

  return pic;
}

// Function review
// Some webpages dynamically reload their images (re: cnn.com)
// As a result, we lose our repointed content
// To circumvent this, we regularly traverse each image on the page and
//  re-repoint it if the src doesn't match a URL from the currentURLs
function review() {
  // alert("we are reviewing:");

  let imgs = document.getElementsByTagName('img');
  let len = imgs.length

  // iterate thru all the images and check their urls
  for (let img = 0; img < len; img++) {
    // console.log(dictURL[imgs[img].src]);

    // if the image has changed, change it
    if (!dictURL[imgs[img].src]) {
      // console.log('$$ GOTCHA $$')
      imgs[img].src = getRandomAnimePic();
    }
  }
}

function setCategory(category) {
  // Thank you, https://www.w3schools.com/js/js_switch.asp
  switch(category) {
    case 'girls':
      currentURLs = animeGirlURLs;
      break;
    case 'boys':
      currentURLs = animeBoyURLs;
      break;
    case 'romance':
      currentURLs = romanceURLs;
      break;
    case 'bmb':
      currentURLs = boyMeetsBoyURLs;
      break;
    case 'gmg':
      currentURLs = girlMeetsGirlURLs;
      break;
    case 'traps':
      currentURLs = trapURLs;
      break;
    case 'random':
      currentURLs = allURLs;
      break;
    default:
      currentURLs = ahegaoURLs;
      saveToStorage('ahegao');
  }
}

// Function animeTime
// It's time to a-a-a-a, a-a-a-a-a-animeeeee
function animeTime() {
  // Grab all the images
  let imgs = document.getElementsByTagName('img');
  let len = imgs.length;

  // alert(len);

  // iterate thru all the images and change their src
  for (let img = 0; img < len; img++) {
    let url = getRandomAnimePic();
    imgs[img].src = url;
    dictURL[url] = true;
  }
}

// Function acceptExtensionMessage
// This will be registered as a callback and triggered everytime a message is sent
// from the extension to the content script. This is usually called for live reload
function acceptExtensionMessage(request, sender, sendResponse) {
  setCategory(request.category);
  animeTime();
}

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

function main() {
  // Wait for page to load for smoother repoint process
  window.onload = () => {
    // add message receiver for live reload
    chrome.runtime.onMessage.addListener(acceptExtensionMessage);

    // Is our current website off-listed?
    // Get the URL, and then get the hostname
    let url = window.location.hostname;
    let hostname = extractHostname(url);

    // alert('hostname = ' + hostname);

    // If URL is in storage, do not proceed
    chrome.storage.sync.get(hostname, function(returnValue) {
      // Found
      if (returnValue[hostname]) {
        // alert('Is off listed');
        return;
      }
      // Proceed with animeTime
      else {
        // alert('is not off listed')

        chrome.storage.sync.get("currentURLs", function(returnValue) {
          // alert('urls gotten!')
          let category = returnValue["currentURLs"];
          let mode = document.getElementById('currentMode');

          // Set to ahegao by default
          if (category === undefined) {
            category = 'ahegao';
            saveToStorage(category);
          }
          // Set our category and load the pics
          if (mode) {
            mode.innerText = category;
          }

          setCategory(category);
          animeTime();

          // Continually check
          setInterval(review, 1000);
        }); // chrome.storage.sync.get currentURLs
      } // else
    }); // chrome.storage.sync.get hostname
  } // window.onload
}

// Zing //

let currentURLs;

// Used for sites that reload images
let dictURL = {};

main();
