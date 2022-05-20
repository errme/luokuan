"use strict";

if (window.mymind === undefined) {
  window.mymind = { };
}
if (mymind.controllers === undefined) {
  mymind.controllers = { };
}

class AuthenticationController {
  constructor() {
    // Component initialization

    try {
      this.orb = new Orb();
    
      this.orb.initialize();
    }
    catch (err) {
      console.log(err.name);
    }
    
    reveal();
  }
}

mymind.controllers.authentication = new AuthenticationController();

async function reveal() {
  if (!mobile) {
    canvasObjects.forEach(config => {
      anime({
        targets: config,
        realRadius: config.radius,
        easing: 'easeOutQuad',
        round: 1,
        duration: 1500
      });
    });

    // await delay(1500);
    await delay(1700);


    anime({
      targets: document.querySelector('.guts'),
      opacity: [ 0, 1 ],
      // translateX: [ 50, 0 ],
      translateX: [ 100, 0 ],

      easing: 'easeOutQuad',
      // duration: 600
      duration: 700

    }).finished;
  }
  else {
    anime({
      targets: '.intro-overlay.basic',
      opacity: [ 0, 1 ],
      translateY: [ 50, 0 ],
      easing: 'easeOutQuad',
      duration: 1500
    });

    anime({
      targets: document.querySelector('.guts'),
      opacity: [ 0, 1 ],
      translateY: [ 50, 0 ],
      easing: 'easeOutQuad',
      duration: 600
    }).finished;

    circlesPosition.y = -950; 
    circlesPosition.rotation = -2;  
    circlesPosition.ease = false; 
  }
}

let skipWaitListControlEl = document.querySelector('.skip-wait-list-control');

if (skipWaitListControlEl) {

  let ctaEl = skipWaitListControlEl.querySelector('.cta');
  let formEl = skipWaitListControlEl.querySelector('form');
  let formButtonEl = formEl.querySelector('button');
  let formInputEl = formEl.querySelector('input');

  ctaEl.addEventListener('click', e=> {

    ctaEl.remove();
    formEl.style.display = 'block';

    formInputEl.focus();
  });

  let form = new Carbon.Form(formEl);

  formInputEl.addEventListener('input', e => {
    formButtonEl.disabled = formInputEl.value.length === 0;
  });

  form.on('sent', e => {
    document.location.assign('/onboard');    
  })
}