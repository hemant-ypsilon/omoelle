import { Component } from '@angular/core';
import { NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {ForgotpassPage} from '../../pages/forgotpass/forgotpass';
import {SignupPage} from '../../pages/signup/signup';
import { MycartPage } from '../../pages/my_cart/my_cart';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public people: any;

  login = {uname:'', password:'', isApi: "1" };

  loading: Loading;
  loginStatus: number;
  connected: Subscription;
  disconnected: Subscription;
  userId : any; 
  user : any; 
  userName : any; 
  totalItm : any;
  guestUserId : any;
  HaveMerchant : number;

  homemove(){
    this.navCtrl.setRoot(HomePage);
  }


  signuppage(){
    this.navCtrl.push(SignupPage);
  }


  forgotpasslnk(){
    this.navCtrl.push(ForgotpassPage)
  }

  movetosuMycart(){
    this.navCtrl.push(MycartPage);
  }


  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events) {

             if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
                   this.totalItm = 0;
                } else {
                  this.totalItm = localStorage.getItem('ItemInCart');
             }
       

  }

  loginFun() {

    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{


      if((localStorage.getItem('isGuestUser') === "undefined" || localStorage.getItem('isGuestUser') === null) ) {
             this.guestUserId = 0;
          } else {
             this.guestUserId = localStorage.getItem('isGuestUser');
      }

   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let body = new FormData();
    body.append('uname', this.login.uname);
    body.append('password', this.login.password);
    body.append('isApi', this.login.isApi);
    body.append('isGuestUser', this.guestUserId);


    // for local : -  /UserLogin
    // for server : -  http://omoelle.com/processed.php
     
     this.http.post(" http://omoelle.com/processed.php",body,headers)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();

       if(data.status == 1){

         localStorage.setItem("ItemInCart", data.results.noOfItem);
         this.events.publish('item', data.results.noOfItem);
         this.guestUserId = 0;
         localStorage.setItem("isGuestUser", '0');
         this.getcartItem(data.results.Id, this.guestUserId);

         localStorage.setItem("userId",data.results.Id);
         localStorage.setItem("userName", data.results.FIRSTNAME + ' ' + data.results.LASTNAME);
         localStorage.setItem("email",data.results.EMAIL);
         this.events.publish('user:created', data.results.Id, Date.now());

         localStorage.setItem("merchantId", data.results.merchant_id);

         console.log('afet login ' + data.results.IsUserHaveMerchant);

         if(data.results.IsUserHaveMerchant == 1){

            localStorage.setItem("isUserHaveMerchant", '1')
            this.events.publish('isMerchant', 1);
            this.HaveMerchant = 1;

          }else{

            localStorage.setItem("isUserHaveMerchant", '0')
            this.events.publish('isMerchant', 0);
            this.HaveMerchant = 0;


          }


          let toast = this.toastCtrl.create({
            message: data.message,
            duration: 2000,
             position: 'top'
          });

         toast.present();
         this.loginStatus = 1;
         this.navCtrl.setRoot(HomePage);

        }else{

              localStorage.setItem("ItemInCart", '0');
              this.events.publish('item', 0);

              let toast = this.toastCtrl.create({
                message: data.message,
                duration: 2000,
                 position: 'top'
              });

             toast.present();

           }

           }, error => {

           console.log(error);
           
    });


   }

  }


  getcartItem(userid, isGuestUser){
     // for local : //CountCartItm
     // for server : -  http://omoelle.com/getcartitem.php
     this.http.get('http://omoelle.com/getcartitem.php?userid='+userid+'&isGuestUser='+isGuestUser)
    .map(res => res.json())
    .subscribe(
    data => {
      if(data.status == 1){
        localStorage.setItem("ItemInCart", data.data.item);
        this.events.publish('item', data.data.item);
       }else{
         localStorage.setItem("ItemInCart", '0');
         this.events.publish('item', 0);
       }
    }, err => {
       alert(err);
     }
   );
  }


  doRefresh(refresher) {

      this.connected = this.network.onConnect().subscribe(
       data => {
           localStorage.setItem("isOnline",'1');
        }, error => console.error(error)
      );

      this.disconnected = this.network.onDisconnect().subscribe(   data => {
         localStorage.setItem("isOnline",'0');
       }, error => console.error(error)
      );

      setTimeout(() => {
        refresher.complete();
      }, 2000);


    }


}
 
