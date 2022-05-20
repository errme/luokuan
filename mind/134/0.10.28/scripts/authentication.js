"use strict";

let nonce = document.querySelector('#nonce').content;
let host = document.querySelector('#host').content;

let createAccount = document.location.pathname == '/';

AppleID.auth.init({
  clientId    : 'com.mymind.mymind.access',
  scope       : 'email name',
  redirectURI : 'https://' + host + '/apple/signin',
  state       : nonce,
  nonce       : nonce,
  usePopup    : true
});

document.addEventListener('AppleIDSignInOnSuccess', async (data) => {
  let detail = data.detail;

  // authorization { code, id_token, state }
  // user { email, name }

  console.log('Apple Id Authorization Success', data);

  let formData = new FormData();

  formData.append('code', detail.authorization.code);
  formData.append('state', detail.authorization.state);
  formData.append('id_token', detail.authorization.id_token);

  // { "name": { "firstName": string, "lastName": string }, "email": string }

  if (detail.user && detail.user.name) {
    let userName = detail.user.name;
    let name = userName.firstName + ' ' + userName.lastName;

    formData.append('name', name);
  }  

  createAccount && formData.append('createAccount', 'true');

  let sourceEl = document.querySelector('#source');

  sourceEl && formData.append('source', sourceEl.content);

  let response = await fetch('/apple/signin', { 
    method  : 'POST',
    body    : formData,
    headers : {
      'Accept': 'application/json'
    }
  });

  let isAuthorize = document.location.pathname === '/authorize';

  let result = await response.json();

  if (!response.ok) {
     // account-closed
     // account-not-found 

     document.location.assign('/signin?error=account-not-found'); 

     return;
  }
  else {
    if (isAuthorize) {
      await createAuthorization(nonce);
    }
    else {
      document.location.assign('/cards');
    }
  }
});

document.addEventListener('AppleIDSignInOnFailure', error => {
  console.log('error', error);
});

let signupWithGoogleEl = document.querySelector('.signup-with-google');

signupWithGoogleEl && signupWithGoogleEl.addEventListener('click', e => {
  let formEl = e.target.closest('form');

  formEl.submit();
});