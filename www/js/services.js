
angular.module('starter')
 
.service('AuthService', function($q, $http, USER_ROLES,API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var category='';
  var isAuthenticated = false;
  var role = '';
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(data) {

    window.localStorage.setItem(LOCAL_TOKEN_KEY, data.token);
    window.localStorage.setItem('username', data.username);
    useCredentials(data);
  }
 
  function useCredentials(data) {
   

    username = data.username;
    category=data.category;
    isAuthenticated = true;
    authToken = data.token;
     
    if (category == 'customer') {
      role = USER_ROLES.admin
    }
    else{
       role = USER_ROLES.publics
    }
 
    // Set the token as header for your requests!

  //  config.headers.token=  data.token;
    $http.defaults.headers.common['token'] = data.token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(user) {
       user.devicetoken=window.localStorage.getItem('devicetoken');
      return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/Web/rest/authentication/login', user)
         .then(
          function(result) {
            console.log(result);
              if (result.data.success) {
                storeUserCredentials(result.data);
                resolve(result.data);
              } else {
                reject(result.data.msg);
              }
             },
              function (httpError) {
                     console.log(httpError);
                   
                      if (httpError.status==0){
                         var msg=" <p><b>Network Connection Error </b></p> <p> Kindly Check your <b>INTERNET</b> Connection </p> ";
                       }
                       else if (httpError.status==401){
                         var msg=" <p><b>Unauthorised </b></p> <p> Kindly Check the Login Credentials You Provided </p> ";
                       }
                    
                    reject(msg);
                       //alert("Http Error " + httpError.data + "  "+ httpError.status);
              });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        498: AUTH_EVENTS.tokenExpired
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.factory('customerFactory', ['$http','API_ENDPOINT',function($http,API_ENDPOINT) {
  
        
  var data = {   
            getCustomerDetails:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/memberdetails');
            },
          
             getCustomerAccounts:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/Accounts');
            },

             RegisterUser:function (user) {
         return $http.post(API_ENDPOINT.url +'/Web/rest/member/Registration',user);
            },
            getCustomerBeneficiaries:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/beneficiary/memberBeneficiary');
            },

            
            getAgentDetails:function (agentnumber) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/agent/CustomerAgentDetails?agentid='+agentnumber);
            },
            getCustomerAgents:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/agent/CustomerAgents');
            },
            getAccountTransaction:function (accountnumber,securitycode) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/transaction/account?accountnumber='+accountnumber +" &securitycode=" +securitycode);
            },
             getministatement:function (accountnumber) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/transaction/ministatement?accountnumber='+accountnumber );
            },
            
            getAccountPdf:function (accountnumber,securitycode) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/Generatepdf?accountnumber='+accountnumber +" &securitycode=" +securitycode);
            },
              getPdfStatement:function (file) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/Downloadpdf?file='+file );
            }, 
            postSellTransaction:function (accountnumber,amount) {
      
                   return $http.post(API_ENDPOINT.url +'/Web/rest/transaction/sell/'+accountnumber+'/'+amount);
               },

               postTransferTransaction:function (fromaccountnumber,toaccountnumber,amount) {
      
                   return $http.post(API_ENDPOINT.url +'/Web/rest/transaction/transfer/'+fromaccountnumber+'/'+toaccountnumber+'/'+amount);
               },

             getAccountbalance:function (action,account,seccode) {
              console.log(API_ENDPOINT.url +'/Web/rest/account/Balance?action='+action +'&accountnumber='+account+'&seccode='+seccode);
         return $http.get(API_ENDPOINT.url +'/Web/rest/account/Balance?action='+action +'&accountnumber='+account+'&seccode='+seccode);
            },   
            
            
           getCustomerBankDetails:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/Bankdetails',{ cache: true });
            },
            getProductList:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/GetProductlist',{ cache: true });
            },

             getPricelistInterestRate:function (seccode) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/GetPriceListInterestRate?seccode='+seccode,{ cache: true });
            },
             getPricelistNav:function (seccode) {
         return $http.get(API_ENDPOINT.url +'/Web/rest/member/GetPriceListNav?seccode='+seccode,{ cache: true });
            },
            getFeedbacks:function () {
         return $http.get(API_ENDPOINT.url +'/Web/rest/feedback/memberfeedback',{ cache: true });
            },
             postFeedback:function (feedback) {
               //  console.log(feedback);
         return $http.post(API_ENDPOINT.url +'/Web/rest/feedback/createFeedback',feedback);
               },
               changePwd:function (credentials) {
                 
         return $http.post(API_ENDPOINT.url +'/Web/rest/authentication/changepassword',credentials);
               },
          
  }
  return data;
}])


.service('CustomerDetails', function () {

    var data={} ;
    var properties=[] ;
    this.save = function (userDetails) {
       data=userDetails;

    }


    this.get = function () {  
         return data;
       }

       this.saveProperties = function (prop) {
       properties=prop;

    }


    this.getProperties = function () {  
         return properties;
       }
    
  
})

 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});