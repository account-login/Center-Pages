//
//

function sendMsg(msg, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
      if (chrome.runtime.lastError) {   // This check will suppress the "Unchecked lastError value ..." msg.
        // console.error('Center-Pages:', chrome.runtime.lastError);
        return;
      }
      if (cb) {
        cb(response);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var presetButton = document.getElementById('btn-preset');
  var increaseButton = document.getElementById('centerPagesIncrease');
  var decreaseButton = document.getElementById('centerPagesDecrease');
  var radioBoxes = document.querySelectorAll("input[name='centerPagesAlign']");
  var lineHeightBox = document.getElementById('lineHeight');
  var fontSizeBox = document.getElementById('fontSize');
  // TODO: configurable
  var preset = { padding: 425, align: 'left', lineHeight: 1.4 };

  // default values
  lineHeightBox.value = 1.2;
  fontSizeBox.value = 1;

  // query current settings
  sendMsg({ query: true }, function (response) {
    // check radio box
    for (var i = 0; i < radioBoxes.length; ++i) {
      if (radioBoxes[i].value === response.align) {
        radioBoxes[i].checked = true;
        break;
      }
    }
    // show current line height and font size
    lineHeightBox.value = parseFloat(response.lineHeight) || lineHeightBox.value;
    fontSizeBox.value = parseFloat(response.fontSize) || fontSizeBox.value;
  });

  // preset button
  presetButton.addEventListener('click', function () {
    sendMsg({ query: true }, function (response) {
      sendMsg({
          padding: preset.padding - response.padding,
          align: preset.align,
          lineHeight: preset.lineHeight,
      }, null);
    }, null);
  }, false);

  // increase/decrease button event
  increaseButton.addEventListener('click', function () {
    sendMsg({ padding: +25 }, null);
  }, false);
  decreaseButton.addEventListener('click', function () {
    sendMsg({ padding: -25 }, null);
  }, false);

  // radio box click event
  for (var i = 0; i < radioBoxes.length; ++i) {
    radioBoxes[i].addEventListener('change', function (event) {
      sendMsg({ align: event.target.value }, null);
    }, false);
  }

  // line height and font size value click event
  lineHeightBox.addEventListener('change', function (event) {
    sendMsg({ lineHeight: event.target.value }, null);
  }, false);
  fontSizeBox.addEventListener('change', function (event) {
    sendMsg({ fontSize: event.target.value }, null);
  }, false);

}, false);
