
function update(params) {
  // padding and align
  var newPadding = (params.padding || 0) + (parseInt(localStorage.getItem('centerPagesPadding')) || 0);
  if (newPadding < 0) {
    newPadding = 0;
  }
  var newAlign = params.align || localStorage.getItem('centerPagesAlign') || 'center';

  var left = 0;
  var right = 0;
  if (newAlign === 'left') {
    right = newPadding * 2;
  } else if (newAlign === 'right') {
    left = newPadding * 2;
  } else {
    left = newPadding;
    right = newPadding;
  }
  var contentCont = document.documentElement;
  contentCont.style.borderLeft = left.toFixed() + 'px solid transparent';
  contentCont.style.borderRight = right.toFixed() + 'px solid transparent';

  // line height and font size
  var lineHeight = parseFloat(params.lineHeight)
    || parseFloat(localStorage.getItem('centerPagesLineHeight'))
    || 0;
  if (lineHeight) {
    contentCont.style.lineHeight = lineHeight;
  }
  var fontSize = parseFloat(params.fontSize)
    || parseFloat(localStorage.getItem('centerPagesFontSize'))
    || 0;
  if (fontSize) {
    contentCont.style.fontSize = fontSize + 'em';
  }

  // This is needed because of a bug with Chrome not re-rendering css immediately.
  document.getElementsByTagName('body')[0].focus();

  // save settings
  localStorage.setItem('centerPagesPadding', newPadding);
  localStorage.setItem('centerPagesAlign', newAlign);
  localStorage.setItem('centerPagesLineHeight', lineHeight);
  localStorage.setItem('centerPagesFontSize', fontSize);
}

function query() {
  return {
    padding: localStorage.getItem('centerPagesPadding'),
    align: localStorage.getItem('centerPagesAlign'),
    lineHeight: localStorage.getItem('centerPagesLineHeight'),
    fontSize: localStorage.getItem('centerPagesFontSize'),
  }
}

if (localStorage.getItem('centerPagesPadding')) {
  update({});
}

chrome.runtime.onMessage.addListener(
  /*
    Listen to extension menu actions.
   */
  function (request, sender, sendResponse) {
    if (request.query) {
      sendResponse(query());
    } else {
      update(request);
    }
  });
