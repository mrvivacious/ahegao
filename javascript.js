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
function set(category) {
  // Update the value in storage, then update the category var in our window, then run animeTime to replace the images
  chrome.storage.local.set({currentURLs:category}, function() {});
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
      set('ahegao');
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

function main() {
  // Wait for page to load for smoother repoint process
  window.onload = () => {
    // add message receiver for live reload
    chrome.runtime.onMessage.addListener(acceptExtensionMessage);

    chrome.storage.local.get("currentURLs", function(returnValue) {
      let category = returnValue.currentURLs;
      let mode = document.getElementById('currentMode');

      // Set our category and load the pics
      if (mode) {
        mode.innerText = category;
      }

      setCategory(category);
      animeTime();

      // Continually check
      setInterval(review, 1000);
    });
  }
}

// Zing //

let currentURLs;

// Used for sites that reload images
let dictURL = {};

main();
