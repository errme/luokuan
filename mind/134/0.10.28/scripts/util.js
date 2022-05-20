"use strict";

if (window._ === undefined) {
  window._ = { };
}

_.getAuthenticityToken = function() {
  if (mymind?.authenticityToken) {
    return mymind.authenticityToken;
  }
  else {
    return document.getElementById('authenticityToken').content;
  }
}

_.getScrollBarWidth = function() {
  let outerEl = document.createElement('div');
  outerEl.style.visibility = 'hidden';
  outerEl.style.overflow = 'scroll';
  document.body.appendChild(outerEl);

  const innerEl = document.createElement('div');
  outerEl.appendChild(innerEl);

  const scrollbarWidth = (outerEl.offsetWidth - innerEl.offsetWidth);

  outerEl.remove();

  return scrollbarWidth;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};

_.replaceCommandText = function(el) {
  if (isWindows && el) {
    el.textContent = el.textContent.replace('⌘', 'CTRL');
    el.classList.add('is-windows');
  }
}

_.isOverflowing = function(element) {  
  return element.scrollHeight > element.clientHeight;
}

_.patchJSON = async function(url, obj) {
  var response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-authenticity-token': _.getAuthenticityToken()
    },
    body: JSON.stringify(obj)
  });

  var result = await response.json();

  if (!response.ok && result.detail) {
    throw new Error(result.detail);
  }

  return result;
}

_.postJSON = async function(url, obj) {
  var response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-authenticity-token': _.getAuthenticityToken()
    },
    body: JSON.stringify(obj)
  });

  return response.json();
}

_.putJSON = async function(url, obj) {
  var response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-authenticity-token': _.getAuthenticityToken()
    },
    body: JSON.stringify(obj)
  });

  var result = await response.json();

  if (!response.ok && result.detail) {
    throw new Error(result.detail);
  }

  return result;
}


_.getText = async function(url) {
  var response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-authenticity-token': _.getAuthenticityToken()
    }
  });

  var newAuthenticityToken = response.headers.get('x-authenticity-token');

  if (newAuthenticityToken) {
    mymind.authenticityToken = newAuthenticityToken;
  }

  var result = await response.text();

  if (response.headers.get('Content-Type') === 'application/problem+json') {
    console.log('[Problem]', result);

    // alert('PROBLEM!!!!');
  }

  return result;
}

_.getJSON = async function(url) {
  var response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-authenticity-token':  _.getAuthenticityToken()
    }
  });

  var newAuthenticityToken = response.headers.get('x-authenticity-token');

  if (newAuthenticityToken) {
    mymind.authenticityToken = newAuthenticityToken;
  }

  var result = await response.json();

  if (response.headers.get('Content-Type') === 'application/problem+json') {
    mymind.logger.error('Problem fetching JSON', result);
    
    throw new Error(result.detail ?? result.type);
  }
  
  return result;
}

_.writeToClipboard = async function(text) {
  if (nativeApp && !window.webkit) {
    sendNativeMessage({ type: 'writeToClipboard', text: text });
  }
  else {
    await navigator.clipboard.writeText(text);
  }
}

_.delete = async function(url) {
  var response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'x-authenticity-token': _.getAuthenticityToken()
    }
  });

  return response.json();
}

_.removeFromArray = function(array, pred) {
  let changed = false;
  let j = 0;

  for (var elt of array) {
    if (pred(elt)) { 
      changed = true;
    }
    else {
      array[j++] = elt;
    }
  }

  array.length = j;

  return changed;
}

async function getPartialHTML(url) {
  let supportsWebP = document.body.classList.contains('supports-webp');

  var accept = supportsWebP ? 'text/html,image/webp' : 'text/html';

  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': accept,
      'x-viewport-width': window.screen.width,
      'x-partial': '1'
    }
  });

  if (!response.ok) {
    throw new Error(`${url} fetch was not successful. status = ${response.status}`);
  }

  return await response.text(); 
}

_.union = function(setA, setB) {
  let result = new Set(setA);

  for (let elem of setB) {
    result.add(elem);
  }
  return result
}

_.intersection = function(setA, setB) {
  let result = new Set();

  for (let elem of setB) {
    if (setA.has(elem)) {
      result.add(elem);
    }
  }

  return result;
}

function isMobile() {
  if(/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    return true;
  }
  else {
    return false;
  }
}

function getWords(el) {
  var result = [ ];
  
  _getWords(el, result);

  return result;
}

function getProseWords(el) {
  var result = [ ];
  
  _getProseWords(el, result);

  return result;
}

const ignoreChars = [ '/', '|', '&', '+', '.', '\\', '=', '-', '→', '#', '>', '–', '{', '}', ',', ':', '—', '?' ];

function _getProseWords(prose, words) {
 
  if (prose.text) { // text
    for (var word of prose.text.split(' ')) {
      word = word.trim();
      
      if (word.endsWith('.') || word.endsWith('?')) {
        word = word.substring(0, word.length - 1);
      }
      
      if (word.length == 1 && ignoreChars.includes(word)) {
        continue;
      }

      if (word.length > 0) {
        words.push(word);
      }
    }
  } 

  if (prose.content) {
    for (var childNode of prose.content) {
      _getProseWords(childNode, words);
    }
  }
}

function _getWords(node, words) {
  if (node.nodeType === 1) { // element

    for (var childNode of node.childNodes) {
      _getWords(childNode, words);
    }
  }
  else if (node.nodeType === 3) { // text
    for (var word of node.textContent.split(' ')) {
      word = word.trim();
      
      if (word.length == 1) {
        if (ignoreChars.includes(word)) {
          continue;
        }
      }

      if (word.length > 0) {
        words.push(word);
      }
    }
  } 
}


_.loadMedia = function(el) {
  let { src, srcset } = el.dataset;
  
  if (!src) {
    throw new Error('[Lazy] Missing data-src');
  }

  if (!el.classList.contains('lazy')) {
    return;
  }


  if (el.tagName == 'IMG') {
    let img = el;
    
    el.classList.add('loading');
    
    img.onload = () => { 
      el.classList.remove('loading');
      el.classList.add('loaded');
    }

    img.src = src;
  
    if (srcset) { 
      el.srcset = srcset;
    }  
  }
  
  el.src = src;

  if (el.tagName == 'VIDEO' && el.hasAttribute('autoplay')) {
    el.play();

    // TODO: Pause once out of viewport
  }

  el.classList.remove('lazy');
}