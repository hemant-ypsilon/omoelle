import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SubcategoryPage } from '../pages/subcategory/subcategory';
import { ForgotpassPage } from '../pages/forgotpass/forgotpass';
import { ProductlistPage } from '../pages/productlist/productlist';
import { MycartPage } from '../pages/my_cart/my_cart';
import { SignupPage } from '../pages/signup/signup';
import { ApiPage } from '../pages/api/api';
import { ProductdetailPage } from '../pages/product_detail/product_detail';
import { HelpsupportPage } from '../pages/helpsupport/helpsupport';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { AccountinfoPage} from '../pages/account_info/account_info';
import { ToastController } from 'ionic-angular';
import { UsersPage } from '../pages/users/users';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { WizardPage } from '../pages/wizard/wizard';
import { AddproductPage } from '../pages/addproduct/addproduct';
import { MerchantproductlistPage } from '../pages/merchantproductlist/merchantproductlist';
import { MerchantproductdetailPage } from '../pages/merchantproductdetail/merchantproductdetail';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { OrderHistoryDetailsPage } from '../pages/order_history_details/order_history_details';
import { OrderstatusPage } from '../pages/orderstatus/orderstatus';
import { TermsAndConditionPage } from '../pages/terms-and-condition/terms-and-condition';

// my account
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription} from 'rxjs/Subscription';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'


declare var navigator: any;
declare var Connection: any;

@Component({
  templateUrl: 'app.html',
  providers: [Keyboard]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  loginStatus: number;
  connected: Subscription;
  disconnected: Subscription;
  totalItm : any;
  userId : any; 
  guestUserId : any;
  HaveMerchant : number;
  showedAlert : boolean;
  confirmAlert : any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public toastCtrl: ToastController, private network: Network, public events: Events, public http: Http, private alertCtrl: AlertController, private locationAccuracy: LocationAccuracy) {

     localStorage.setItem("ItemInCart", '0');
     localStorage.setItem('isGuestUser', '0');

      if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
       
        this.userId = 0;
        this.guestUserId = localStorage.getItem('isGuestUser');

      } else {
         this.guestUserId = 0;
         this.userId = localStorage.getItem("userId");
         this.getAccountDetail(this.userId);
      }

      if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
             this.totalItm = 0;
             this.events.publish('item', 0);
          } else {
            this.totalItm = localStorage.getItem('ItemInCart');
            this.events.publish('item', localStorage.getItem('ItemInCart'));
       }


      if((localStorage.getItem('isUserHaveMerchant') == '1') ) {
             this.HaveMerchant = 1;
          } else {
             this.HaveMerchant = 0;
      }

      this.events.subscribe('isMerchant', (val) => {
        this.HaveMerchant = val;
      });


      this.events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        this.loginStatus = 1;
        this.getcartItem(this.userId, this.guestUserId);
        console.log('Welcome 2', user, 'at', time);
      });


    this.initializeApp();
    this.ionViewDidEnter();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {

    this.platform.ready().then(() => {


    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }

    });


      
      if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
        this.rootPage = LoginPage;
        this.loginStatus = 0;
        this.userId = 0
        this.guestUserId = localStorage.getItem('isGuestUser');
      } else {
         this.rootPage = HomePage;
         this.loginStatus = 1;
         this.userId = localStorage.getItem("userId");
         this.guestUserId = 0;
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();

        this.showedAlert = false;
         // Confirm exit
        this.platform.registerBackButtonAction(() => {
            if (this.nav.length() == 1) {
                if (!this.showedAlert) {
                    this.confirmExitApp();
                } else {
                    this.showedAlert = false;
                    this.confirmAlert.dismiss();
                }
            }

            this.nav.pop();
        });


    });
  }


  confirmExitApp() {
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
        title: "Exit",
        message: "Are you sure want to exit app",
        buttons: [
            {
                text: 'Cancel',
                handler: () => {
                    this.showedAlert = false;
                    return;
                }
            },
            {
                text: 'Accept',
                handler: () => {
                    this.platform.exitApp();
                }
            }
        ]
    });
    this.confirmAlert.present();
}


  getcartItem(id, isGuestUser){
     // for local : //CountCartItm
     // for server : -  http://omoelle.com/getcartitem.php
     this.http.get('http://omoelle.com/getcartitem.php?userid='+id+'&isGuestUser='+isGuestUser)
    .map(res => res.json())
    .subscribe(
    data => {
      if(data.status == 1){
         console.log("on component " + data.data.item);
         localStorage.setItem("ItemInCart", data.data.item);
       }else{
         localStorage.setItem("ItemInCart", '0');
       }
    }, err => {
       alert(err);
     }
   );
  }


  getAccountDetail(id){
       this.http.get('http://omoelle.com/getaccountdetail.php?Id='+id)
      .map(res => res.json())
      .subscribe(
      data => {

        if(data.status == 1){

          if(data.data.IsUserHaveMerchant == 1)
          {
            localStorage.setItem("isUserHaveMerchant", '1')
            this.events.publish('isMerchant', 1);
            this.HaveMerchant = 1;
            localStorage.setItem("merchantId", data.data.merchant_id);
          }
        }

      }, err => {
         alert(err);
       }
     );

   }


  displayNetworkUpdate(connectionState: string){
    console.log('enter 1');
    let networkType = this.network.type
    this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }


  ionViewDidEnter() {
      this.connected = this.network.onConnect().subscribe(data => {
       console.log('enter 2');
        localStorage.setItem("isOnline",'1');
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));
     
      this.disconnected = this.network.onDisconnect().subscribe(data => {
       console.log('enter 3');
         localStorage.setItem("isOnline",'0');
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));

  }



  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }



 logout(){
     this.loginStatus = 0;
     this.HaveMerchant = 0;
    // localStorage.clear();
    localStorage.removeItem('userId');
    localStorage.removeItem('ItemInCart');
    localStorage.removeItem('isUserHaveMerchant');
     this.nav.setRoot(LoginPage);
     let toast = this.toastCtrl.create({
            message: 'Logout successfully completed!',
            duration: 2000,
             position: 'top'
          });

    toast.present();

   }

  signuppage(){
    this.nav.push(SignupPage);
  }

  loginpage(){
    this.nav.setRoot(LoginPage);
  }

  setHomePage(){
    this.nav.push(HomePage);
  }
  setaboutusPage(){
    this.nav.push(AboutusPage);
  }
   setHelpsupportPage(){
    this.nav.push(HelpsupportPage);
  }

  setUserPage(){
    this.nav.push(UsersPage);
  }

   myCart(){
    this.nav.push(MycartPage);
  }

  wizard(){
    this.nav.push(WizardPage);
  }

  add_product(){
    this.nav.push(AddproductPage);
  }

  order_history(){
    this.nav.push(OrderHistoryPage);
  }

  orderStatus(){
    this.nav.push(OrderstatusPage);
  }

  termsCondition(){
    this.nav.push(TermsAndConditionPage);
  }


  product_list(){
    this.nav.push(MerchantproductlistPage);
  }

  

  accountinfo(){
    if(localStorage.getItem("isOnline") == '1'){
       this.nav.push(AccountinfoPage);
     }else{
       let alert = this.alertCtrl.create({
          title: 'Internet Connection',
          subTitle: 'Please check your internet connection',
          buttons: ['Dismiss']
        });
        alert.present();
     }
  }

  myaccount(){
    if(localStorage.getItem("isOnline") == '1'){
       this.nav.push(MyaccountPage);
     }else{
       let alert = this.alertCtrl.create({
          title: 'Internet Connection',
          subTitle: 'Please check your internet connection',
          buttons: ['Dismiss']
        });
        alert.present();
     }
  }


  changepass(){
   if(localStorage.getItem("isOnline") == '1'){
     this.nav.push(ChangepasswordPage);
    }else{
       let alert = this.alertCtrl.create({
          title: 'Internet Connection',
          subTitle: 'Please check your internet connection',
          buttons: ['Dismiss']
        });
        alert.present();
     }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
