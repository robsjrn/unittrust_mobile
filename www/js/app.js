// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'starter.controllers','ionic-material','ngMessages'])


.run(function($ionicPlatform,$ionicAnalytics) {

  $ionicAnalytics.register();
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
      window.localStorage.setItem('devicetoken', token.token);

    });
  });
})



.config(function($stateProvider, $urlRouterProvider,$httpProvider,USER_ROLES,$ionicConfigProvider) {
 
$ionicConfigProvider.views.maxCache(5);
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })




  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.login', {
    cache: false,
    url: '/login',
   views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
           controller: 'LoginCtrl'
        }
      }
  })



 .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })


 .state('app.thankyou', {
    url: '/thankyou/:accnumber',
    views: {
      'menuContent': {
        templateUrl: 'templates/ThankYou.html',
        controller:'thankyouCtrl'
      }
    }
  })

 .state('app.forgotpassword', {
    url: '/forgotpassword',
    views: {
      'menuContent': {
        templateUrl: 'templates/ForgotPassword.html',
        controller:'forgotpasswordCtrl'
      }
    }
  })


 .state('app.paymentoptions', {
    url: '/paymentoptions/:accnumber',
    views: {
      'menuContent': {
        templateUrl: 'templates/paymentoptions.html',
        controller:'paymentoptionsCtrl'
      }
    }
  })



  .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/Main.html',
           controller: 'AccountCtrl'
        }
      },
        data: {
          authorizedRoles: [USER_ROLES.admin]
        }
    })


 .state('app.account.profile', {
    url: '/account/profile',
    views: {
      'profile-tab': {
           templateUrl: 'templates/profile.html',
           controller: 'ProfileCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })
  .state('app.account.viewaccounts', {
    url: '/account/viewaccounts',
    views: {
      'accounts-tab': {
        templateUrl: 'templates/Accounts.html',
        controller: 'AccountsListCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })


  .state('app.account.transfer', {
     cache: false,
    url: '/account/transfer/:fromaccountnumber',
    views: {
      'transfer-tab': {
        templateUrl: 'templates/account-transfer.html',
        controller: 'TransferCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })

  .state('app.account.ministatement', {
    cache: false,
    url: '/account/ministatement/:accountnumber',
    views: {
      'ministatement-tab': {
        templateUrl: 'templates/account-ministatement.html',
        controller: 'MinistatementCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })
  
 .state('app.account.accountagent', {
    url: '/account/accountagent',
    views: {
      'accountagent-tab': {
        templateUrl: 'templates/account-accountagent.html',
        controller: 'AgentCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })


 .state('app.account.viewpdf', {
    url: '/account/viewpdf',
    views: {
      'viewpdf-tab': {
        templateUrl: 'templates/viewpdf.html',
        controller: 'viewpdfCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })


 .state('app.account.messages', {
    url: '/account/messages',
    views: {
      'messages-tab': {
        templateUrl: 'templates/account-messages.html',
        controller: 'MessageCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })



  .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html' ,
          controller: 'RegistrationCtrl'
        }
      }
    })
    .state('app.Navpricelist', {
      url: '/Navpricelist/:seccode/:name',
      views: {
        'menuContent': {
          templateUrl: 'templates/Navpricelist.html',
          controller: 'NavpricelistCtrl'
        }
      }
    })
    .state('app.interestpricelist', {
      url: '/interestpricelist/:seccode/:name',
      views: {
        'menuContent': {
          templateUrl: 'templates/interestpricelist.html',
          controller: 'InterestpricelistCtrl'
        }
      }
    })

  .state('app.products', {
    url: '/products',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'productCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
