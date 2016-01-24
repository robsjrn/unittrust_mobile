angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state, AuthService, AUTH_EVENTS,$ionicPopup,$ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
    var deploy = new Ionic.Deploy();
  
  // Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    deploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
       var alertPopup = $ionicPopup.alert({
      title: 'Update',
      template: 'The App has been successfully updated '
    });
    });
  };

  // Check Ionic Deploy for new code
  $scope.checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    deploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      $scope.hasUpdate = hasUpdate;
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
  };

  $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.<p>Login to Proceed </p>'
    });
     $state.go('app.login');
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
 
    AuthService.logout();
    $state.go('app.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Not Authenticated',
      template: 'Sorry, You have to login to Proceed'
    });
  });



  $scope.$on(AUTH_EVENTS.tokenExpired, function(event) {
 
    AuthService.logout();
    $state.go('app.login');
    var alertPopup = $ionicPopup.alert({
      title: ' Session Expired ',
      template: 'Sorry, You have to login to Proceed'
    });
  });

 
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };



 $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };







})

.controller('productCtrl', function($scope,customerFactory,$state,$ionicLoading,$ionicHistory) {
  
 $scope.GoBack = function() {
    $ionicHistory.goBack();
  };
  
  $ionicLoading.show({
      template: 'Loading...'
    });
     customerFactory.getProductList()
      .success(function(data) {
              $scope.productlist=data;
              console.log($scope.productlist);
             $ionicLoading.hide();
                                                                     
               }) 
             .error(function(data) {
                          
                           $ionicLoading.hide();
                  
                         if (data.length==0){     
                          var alertPopup = $ionicPopup.alert({
                                  title: '  Error ',
                                  template: 'Ooops, An Error Occurred Trying to List The Products Kindly Retry Later'
                                });   }    
              
               });

             $scope.listProductPrice=function(securitycode,fundtype,descript){
                       if (fundtype=='Rate Fee'){
                        
                         $state.go('app.interestpricelist',{seccode:securitycode,name:descript});
                       }
                        else if (fundtype=='Admin Fee'){
                         $state.go('app.Navpricelist',{seccode:securitycode,name:descript});
                        };
             };

})


.controller('NavpricelistCtrl', function($scope,$stateParams,customerFactory,$ionicPopup, $state,$ionicLoading,$ionicHistory) {
   $scope.GoBack = function() {
    $ionicHistory.goBack();
  };
   $ionicLoading.show({
      template: 'Loading...'
    });
   $scope.productname= $stateParams.name;
   customerFactory.getPricelistNav($stateParams.seccode)
      .success(function(data) {
              $scope.navs=data;
              $ionicLoading.hide();
               if (data.length==0){ 
                  var alertPopup = $ionicPopup.alert({
                           title: 'Unavailable ',
                           template: 'Sorry ,The Pricelist is Unavailable '
                         });

                         alertPopup.then(function(res) {
                            $state.go('app.products');
                         });
                       };
                                                                     
               }) 
             .error(function(data) {
                          
                          
                  $ionicLoading.hide();
                          
                          var alertPopup = $ionicPopup.alert({
                                  title: '  Error ',
                                  template: 'Ooops, An Error Occurred Trying to List The Products Kindly Retry Later'
                                });    
              
               });

 
})
.controller('InterestpricelistCtrl', function($scope,$stateParams,customerFactory,$ionicPopup, $state,$ionicLoading,$ionicHistory) {
    $scope.productname= $stateParams.name;

     $scope.GoBack = function() {
    $ionicHistory.goBack();
  };

     $ionicLoading.show({
      template: 'Loading...'
    });

    customerFactory.getPricelistInterestRate($stateParams.seccode)
      .success(function(data) {
              $scope.interestrates=data;
             // console.log($scope.interestrates);
             $ionicLoading.hide();
                if (data.length==0){ 
                  var alertPopup = $ionicPopup.alert({
                           title: 'Unavailable ',
                           template: 'Sorry ,The Pricelist is Unavailable '
                         });

                         alertPopup.then(function(res) {
                            $state.go('app.products');
                         });
                       };
              
                                                                     
               }) 
             .error(function(data) {
                          
                       $ionicLoading.hide();   
                  
                            
                          var alertPopup = $ionicPopup.alert({
                                  title: '  Error ',
                                  template: 'Ooops, An Error Occurred Trying to List The Products Kindly Retry Later'
                                });   
              
               });
})



.controller('AgentCtrl', function($scope,customerFactory,$ionicPopup,$ionicLoading ) {

     $ionicLoading.show({
      template: 'Loading...'
    });


    customerFactory.getCustomerAgents()
             .success(function(data) {
              $scope.agents=data;
              $ionicLoading.hide();

                         if (data.length==0){     
                          var alertPopup = $ionicPopup.alert({
                                  title: 'No Agents ',
                                  template: 'Sorry But You have no Agents Listed'
                                });   }
                         // console.log(data);
                                                                     
               }) 
             .error(function(data) {
              $ionicLoading.hide();
              $scope.agents=[];  
               });


 $scope.sendemail= function(addrs) {
        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
              //  console.log("Response -> " + result);
            }, 
            "Hello Agent ", // Subject
            "",                      // Body
            [addrs],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
    }
})


.controller('ProfileCtrl', function($scope,customerFactory,$ionicPopup,$ionicLoading) {
 
     // $scope.profile=CustomerDetails.get();
   //  $scope.bankdetails=customerFactory.getCustomerBankDetails();

 


 $ionicLoading.show({
      template: 'Loading...'
    });




     customerFactory.getCustomerDetails()
    .success(function(data) {
      $scope.profile=data;

       customerFactory.getCustomerBankDetails() 
                 .success(function(bankdetdata) {
                   $ionicLoading.hide();
                $scope.bankdetails=bankdetdata[0];
                          //  console.log(bankdetdata);     
                            }) 
              .error(function(data) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: 'Error Retreiving Your Details ,Kindly Retry Later'
                });
                });
          }) 
    .error(function(data) {
      $ionicLoading.hide();
      });




   $scope.doRefresh=function(){
   customerFactory.getCustomerDetails()
    .success(function(data) {
      $scope.profile=data;
     
       customerFactory.getCustomerBankDetails() 
                 .success(function(bankdetdata) {
                   $scope.bankdetails=bankdetdata[0];
                $scope.$broadcast('scroll.refreshComplete');      
                            }) 
              .error(function(data) {
              $scope.$broadcast('scroll.refreshComplete');  
                });
          }) 
    .error(function(data) {
      $scope.$broadcast('scroll.refreshComplete');  
      });

};
    

})
.controller('AccountsListCtrl', function($scope,$ionicLoading,$ionicActionSheet,customerFactory,$ionicPopup, ionicMaterialMotion, ionicMaterialInk, $state,$location) {
 
       $ionicLoading.show({
      template: 'Loading...'
    });
         customerFactory.getCustomerAccounts()
             .success(function(data) {
              $scope.memberaccounts=data;
               // console.log($scope.memberaccounts);
               $ionicLoading.hide();
                         if (data.length==0){     
                          var alertPopup = $ionicPopup.alert({
                                  title: 'No Account ',
                                  template: 'Sorry But You have no Account(s)'
                                });   }
                         // console.log(data);
                                                                     
               }) 
             .error(function(data) {
              $ionicLoading.hide();
              $scope.accounts=[];  
               });

    $scope.doRefresh=function(){
      customerFactory.getCustomerAccounts()
             .success(function(data) {
              $scope.memberaccounts=data;
               $scope.$broadcast('scroll.refreshComplete');  
                                                                     
               }) 
             .error(function(data) {
              $scope.$broadcast('scroll.refreshComplete');  
              $scope.accounts=[];  
               });

};   


$scope.onDoubleTap=function(account){
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'View Balance' },
       { text: 'Mini statement' },
       { text: 'Sell' },
       { text: 'Transfer' }
     ],
     titleText: account.ACCOUNT_NO,
     cancelText: 'Cancel',
     cancel: function() {
          hideSheet();
        },
     buttonClicked: function(index) {
           if (index==0){
                hideSheet();
                showBal(account);
            }
            if (index==1){
                hideSheet();
                $scope.showMinistatement(account.ACCOUNT_NO);
            }
            if (index==2){
                hideSheet();
                $scope.sell(account);
            }
            if (index==3){
                hideSheet();
                $scope.TransferTransaction(account.ACCOUNT_NO);
            }
      
       return true;
     }
   });


 };   


  function showBal (account){
    $ionicLoading.show({
      template: 'Loading...'
    });
  var action;
      if (account.FUNDTYPE=='Rate Fee'){action='GetNavAccountBalance';}
      else if (account.FUNDTYPE=='Admin Fee'){action='GetInterestAccountBalance';}  

    
         customerFactory.getAccountbalance(action,account.ACCOUNT_NO,account.SECURITY_CODE)
              .success(function(data) {
                 $ionicLoading.hide();

                  if (data.response_code=='0'){
                      var temp=   "Kes " + data.response_message.balance;

                            var alertPopup = $ionicPopup.alert({
                           title: data.response_message.accNo,
                           template: temp 
                         });
                      }
                   else {
                         var alertPopup = $ionicPopup.alert({
                                  title: 'Unknown Error  ',
                                  template: data.response_message
                                }); 

                   }   
                                
               }) 
             .error(function(data) {
               $ionicLoading.hide();
              console.log(data);
                 var alertPopup = $ionicPopup.alert({
                                  title: 'Error  ',
                                  template: 'Ooops an Error Occured ,Kindly Retry Later'
                                }); 
               });
   };

  
    $scope.statementDownload=function(accountnum,securitycode){
          $state.go('app.account.viewpdf');
   };


      $scope.showMinistatement=function(account){
         //  $state.go('app.account.viewpdf');
             $state.go('app.account.ministatement',{accountnumber:account},{reload: true});
      };

       $scope.TransferTransaction=function(account){
   
             $state.go('app.account.transfer',{fromaccountnumber:account},{reload: true});
      };
      $scope.sell=function(account){
   
               $scope.data = {};
               $scope.data.account=account.ACCOUNT_NO; 

                  // An elaborate, custom popup
                  var myPopup = $ionicPopup.show({
                    template: '<input type="number" ng-model="data.amount">',
                    title: 'Enter Amount to Sell',
                    subTitle: 'From Account Number ' + account.ACCOUNT_NO,
                    scope: $scope,
                    buttons: [
                      { text: 'X' },
                      {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                          if (!$scope.data.amount) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                          } else {
                            return $scope.data;
                          }
                        }
                      }
                    ]
                  });

                  myPopup.then(function(res) {
                 

                      if(res.hasOwnProperty('amount')){
                             var confirmPopup = $ionicPopup.confirm({
                                 title: 'Sell Amount ' + $scope.data.amount + ' From Account '+$scope.data.account,
                                 template: 'Kindly Confirm the Sell ?'
                               });

                               confirmPopup.then(function(res) {
                                 if(res) {
                                   performsale($scope.data);
                                 } else {
                                  // console.log('You are not sure');
                                 }
                               });
                         }
                  });

                 
               };
      
        function performsale(data){

            customerFactory.postSellTransaction(data.account,data.amount)
             .success(function(data) {
                        
                          var alertPopup = $ionicPopup.alert({
                                  title: 'Transaction Completed ',
                                  template: 'Sell Done Pending Confirmation '
                                });   
                         
                                                                     
               }) 
             .error(function(data) {
                         var alertPopup = $ionicPopup.alert({
                                  title: 'Transaction Error ',
                                  template: 'Ooops Something Went Wrong Kindly Retry Later '
                                });   
               });

         };

})




.controller('AccountCtrl', function($scope, $stateParams,$ionicPopup,AuthService,$state,customerFactory,$ionicPopover) {
   $scope.username = AuthService.username();
   //console.log("Username is " + $scope.username);
 
  $scope.logout = function() {
    $scope.popover.hide();
    AuthService.logout();
    $state.go('app.login', {reload: true});


  };

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

 


})


.controller('viewpdfCtrl', function($scope, $stateParams,pdfDelegate,$state,customerFactory) {
   $scope.pdfUrl='https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';
})



.controller('MessageCtrl', function($scope,customerFactory, $timeout, ionicMaterialMotion, ionicMaterialInk,$ionicModal,$ionicPopup) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);


$scope.doRefresh=function(){
  customerFactory.getFeedbacks()
    .success(function(data) {
      $scope.feedbacks=data; 
       $scope.$broadcast('scroll.refreshComplete');                   
                  }) 
    .error(function(data) {
         $scope.$broadcast('scroll.refreshComplete');
      });

};

    customerFactory.getFeedbacks()
    .success(function(data) {
      $scope.feedbacks=data;
   
                       
                  }) 
    .error(function(data) {
      $scope.feedbacks=[];  
      });

    $scope.viewResponse=function(response){
       var tmpl = '<p>Respose Message : <b>'+response.responce+'</b></p>' +
                  '<p>Responded By "<b>'+response.respondedBy+'</b></p>'  
       var alertPopup = $ionicPopup.alert({
                                  title: 'Response ',
                                  template: tmpl
                                });

    };


     $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $ionicModal.fromTemplateUrl('templates/ComposeMessage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.composemodal = modal;
  });

   $scope.composemessage=function(){
    $scope.feedback="";
      $scope.composemodal.show();
    };

    $scope.closeComposeModal=function(){
       $scope.feedback="";
      $scope.composemodal.hide();

    }

$scope.SubmitFeedback=function(feedback){

      $scope.modal.hide();
        customerFactory.postFeedback(feedback)
                .success(function(data) {
              if (data.status !==2){                 
                                  var alertPopup = $ionicPopup.alert({
                                  title: 'Feedback ',
                                  template: 'Feedback Posted '
                                });  
                                 $scope.feedback="";
                                  }
                                  else {
                                    //  alert(data.Exception);
                                   var alertPopup = $ionicPopup.alert({
                                  title: 'Feedback ',
                                  template: '<p>An Error Occurred Posting Your Feedback</p><p>Kindly Retry later</p> '
                                });  
                                $scope.feedback="";

                                  }
                  }) 
    .error(function(data) {
             //  alert(data)  ;
                            var alertPopup = $ionicPopup.alert({
                                  title: 'Feedback ',
                                  template: '<p>An Error Occurred Posting Your Feedback</p><p>Kindly Retry later</p> '
                                });  
      });
    }


  



  $ionicModal.fromTemplateUrl('templates/outbox.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.outboxmodal = modal;
  });

  
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.showoutbox=function(){
      $scope.outboxmodal.show();
    }

    $scope.closeModal=function(){
   
          $scope.outboxmodal.hide();

    }


     


   
})
.controller('fabmessagectrl', function($scope,$ionicModal,$ionicPopup,customerFactory) {
  

})


.controller('TransferCtrl', function($scope,$ionicLoading, $stateParams,$ionicHistory,$ionicPopup,AuthService,$state,customerFactory) {
$scope.data={};
  $scope.data.fromaccount=$stateParams.fromaccountnumber;
console.log($stateParams.fromaccountnumber);


   customerFactory.getCustomerAccounts()
             .success(function(data) {
              $scope.memberaccounts=data;

               }) 
             .error(function(data) {
                 $scope.memberaccounts=[];
               });

      $scope.GoBack = function() {
    $ionicHistory.goBack();
  };       

  $scope.transfertransaction = function(data) {
      //   console.log(data.toaccount.ACCOUNT_NO);
        //   console.log(data.fromaccount);

          if (data.fromaccount != data.toaccount.ACCOUNT_NO){

             if(data.hasOwnProperty('amount') && data.hasOwnProperty('toaccount') ){
                             var confirmPopup = $ionicPopup.confirm({
                                 title: 'Transfer Amount ' + $scope.data.amount + ' From Account '+$scope.data.fromaccount + ' To Account '+ data.toaccount.ACCOUNT_NO ,
                                 template: 'Kindly Confirm the Transfer Transaction ?'
                               });

                               confirmPopup.then(function(res) {
                                 if(res) {
                                   performTransfer($scope.data);
                                 } else {
                                 //  console.log('You are not sure');
                                 }
                               });
                         }
                   else {
                       var alertPopup = $ionicPopup.alert({
                           title: 'Missing Values',
                           template: 'Kindly Supply To Account or Amount Values '
                         });

                         alertPopup.then(function(res) {
                          // console.log('Thank you for not eating my delicious ice cream cone');
                         });
                       };

                   }  

                else {

                       var alertPopup = $ionicPopup.alert({
                           title: 'Transfer To Same Account ',
                           template: 'You Cannot Transfer to the Same Account'
                         });

                         alertPopup.then(function(res) {
                          // console.log('Thank you for not eating my delicious ice cream cone');
                         });
                       };

                }       

            function performTransfer(data){
                   $ionicLoading.show({
                      template: 'Loading...'
                    });
              customerFactory.postTransferTransaction(data.fromaccount,data.toaccount ,data.amount)
             .success(function(data) {
               $ionicLoading.hide();
                        
                          var alertPopup = $ionicPopup.alert({
                                  title: 'Transaction Completed ',
                                  template: 'Transfer Done Pending Confirmation '
                                }); 
                                 alertPopup.then(function(res) {
                                      $state.go('app.account.viewaccounts');
                                     });  
                         
                                                                     
               }) 
             .error(function(data) {
               $ionicLoading.hide();
                         var alertPopup = $ionicPopup.alert({
                                  title: 'Transaction Error ',
                                  template: 'Ooops Something Went Wrong Kindly Retry Later '
                                });   
               });


            };


})

.controller('MinistatementCtrl', function($scope, $ionicHistory, $stateParams,$ionicPopup,AuthService,$state,customerFactory,$ionicLoading) {

  $ionicLoading.show({
      template: 'Loading...'
    });
       customerFactory.getministatement($stateParams.accountnumber)
             .success(function(data) {
              $scope.ministatement=data;

                         if (data.length==0){     
                          var alertPopup = $ionicPopup.alert({
                                  title: 'No Transaction ',
                                  template: 'Sorry But You have no Transactions Available'
                                });   }
                          //console.log(data);
                          $ionicLoading.hide();
                                                                     
               }) 
             .error(function(data) {
              $scope.ministatement=[]; 
              $ionicLoading.hide(); 
               });

  
   $scope.GoBack = function() {
    $ionicHistory.goBack();
  };

})
.controller('thankyouCtrl', function($scope, $stateParams,$ionicPopup,AuthService,$state,customerFactory,$ionicLoading) {
  $scope.virtualAccNumber=$stateParams.accnumber;

        $scope.paymentoption=function(){
            $state.go('app.paymentoptions',{accnumber:$scope.virtualAccNumber});
        }
  })
.controller('paymentoptionsCtrl', function($scope, $stateParams,$ionicPopup,AuthService,$state,customerFactory,$ionicLoading) {
  $scope.AccNumber=$stateParams.accnumber;
  })


.controller('RegistrationCtrl', function($scope, $stateParams,$ionicPopup,AuthService,$state,customerFactory,$ionicLoading) {

  $scope.registerCustomer=function(regdetails){
$ionicLoading.show({
      template: 'Loading...'
    });
 customerFactory.RegisterUser(regdetails)
             .success(function(data) {
              console.log(data);
              $ionicLoading.hide();
               if (data.response_code=="0"){
                    $state.go('app.thankyou',{accnumber:data.Virtual_account});
               }
               else if (data.response_code=="2"){

                 var alertPopup = $ionicPopup.alert({
                                  title: 'Registration Error',
                                  template: data.response_message
                                });
               }

               else {
                     var alertPopup = $ionicPopup.alert({
                                  title: 'Registration Error',
                                  template: data.response_message
                                });
               }
                      
                                                                     
               }) 
             .error(function(data) {
              $ionicLoading.hide();
                   var alertPopup = $ionicPopup.alert({
                                  title: 'Registration Error',
                                  template: 'Error Occurred During Registration ,Kindly Retry Later '
                                });
             
               });
  

  }
})




.controller('forgotpasswordCtrl', function($scope,$ionicLoading, $ionicPopup) {

  })

.controller('LoginCtrl', function($scope,$ionicLoading, $state, $ionicPopup, AuthService) {
  $scope.data = {};
  $scope.user={};
  $scope.showloading=false;
/*  
  $scope.login = function(data) {
  $state.go('app.account', {}, {reload: true});
     };
   */  
 
  $scope.login = function(data) {

   $scope.showloading=true;

    AuthService.login(data).then(function(authenticated) {
      
      $state.go('app.account', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
        $scope.showloading=false;
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: err
      });
    });
  };
  
});
