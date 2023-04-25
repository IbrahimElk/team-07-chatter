// // ZIE @JOHN
// // REST API :

// const authUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/authorize?state=anystate&response_type=code&client_id=OA_UADCKXHLP&redirect_uri=https://zeveraar.westeurope.cloudapp.azure.com/home/home.html&scope=ZC_EP_UURROOSTER_OAUTH_SRV_0001%20ZC_EP_OPO_INFO_SRV_0001`;
// const redirectUri = 'https://zeveraar.westeurope.cloudapp.azure.com/home/home.html';
// const clientSecret = 'r5FBejh54V7gj8PC';
// const clientID = 'OA_UADCKXHLP';
// const auth = btoa(`${clientID}:${clientSecret}`);
// window.addEventListener('load', function () {
//   const button = document.getElementById('loginbutton')
//   button.addEventListener('click', function () {
//     window.location.href = authUrl;
//   });
// });

// window.addEventListener('load', function () {
//   console.log('hello');
//   console.log(window.location.href);
//   if (window.location.href.startsWith(redirectUri) && this.window.location.href.includes('code')) {
//     console.log('in the redirect uri');
//     const queryParams = new URLSearchParams(window.location.search);
//     const authorizationCode = queryParams.get('code');
//     console.log(authorizationCode);
//     if (authorizationCode !== null) {
//       const button = document.getElementById('loginbutton')
//       button.classList.add('hidden');
//       const tokenUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/token?grant_type=authorization_code&code=${authorizationCode}&redirect_uri=https://zeveraar.westeurope.cloudapp.azure.com/home/home.html`;

//       fetch(tokenUrl, {
//         method: 'POST',
//         headers: {
//           Authorization: `Basic ${auth}, Basic T0FfVUFEQ0tYSExQOndhY2h0d29vcmQ=`,
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log(data);
//         })
//         .catch((error) => {
//           console.error('error: ', error);
//         });
//     }
//   }
// });
