"use strict";

class Stopwatch {
  constructor() {
    this._start = performance.now();
  }
  
  restart() {
    this._start = performance.now();
  }

  start() {
    this._start = performance.now();
  }

  stop() {
    this._end = performance.now();
  }

  get elapsed() {
    let end = (this._end ?? performance.now());

    var result = end - this._start; // ms

    return result.toFixed();
  }
}

class Debugger {
  constructor() {
    this.element = document.querySelector('#debugger');
    this.logEl = this.element.querySelector('.log');
    
    mymind.reactive.on('escape', this.close.bind(this));
  
    this.element.querySelector('.close').addEventListener('click', this.close.bind(this));
  }

  get active() {
    return this.element.classList.contains('show');
  }

  open() {
    this.element.classList.add('show');

    this.sync();
  }

  sync() {
    if (!this.active) return;

    var text = '';
    
    for (var item of mymind.logger.queue) {
      if (typeof item === 'string') {
        text += (item + '\n');
      }  
      else {
        text += (JSON.stringify(item, null, 2) + '\n');
      }
    }
    
    this.logEl.textContent = text;
  }

  close() {
    this.element.classList.remove('show');
  }
}

class Logger {
  constructor() {
    this.queue = [ ];
  }

  info(message) {
    console.log(message);

    if (this.queue.length > 100) {
      this.queue.pop();
    }

    this.queue.push(message); // unshift
   
    mymind.debugger && mymind.debugger.sync();
  }

  error (message, reason) {
    console.error(message, reason);

    if (reason instanceof Error) {
      reason = { 
        message: reason.message,
        fileName: reason.fileName,
        lineNumber: reason.lineNumber,
        columnNumber: reason.columnNumber,
        stack: reason.stack
      };
    }
    
    var data = message;

    if (reason) {
      data = {
        message: message,
        reason: reason
      }
    }

    this.queue.push(data);
  
    mymind.debugger && mymind.debugger.sync();
  }
}

mymind.logger = new Logger();

if (document.querySelector('#debugger')) {
  mymind.debugger = new Debugger();
}

(function() { 
  var postErrorTimeout = null;

  function errorHandler(message, url, line, column, error) {    
    mymind.logger.error({ message, url, line, error });

    let data = {
      url: url,
      line: line,
      message: message
    };

    if (column) {
      data.column = column;
    }

    if (error && error.stack) {
      data.stack = error.stack;
    }

    try {
      // rate limit to 1 every 2 seconds
      postErrorTimeout && clearTimeout(postErrorTimeout);

      postErrorTimeout = setTimeout(() => {
        fetch('/jserrors', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(data)
        });

        postErrorTimeout = null;
      }, 2000);

    }
    catch(e) { }

    return false;
  }

  window.onerror = errorHandler;

  window.addEventListener("unhandledrejection", promiseRejectionEvent => { 
    promiseRejectionEvent.reason && mymind.logger.error('[Unhandled Exception] ', promiseRejectionEvent.reason);
  });
})();