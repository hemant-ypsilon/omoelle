import { Component } from '@angular/core';
import { NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {AccountinfoPage} from '../../pages/account_info/account_info';
import {LoginPage} from '../../pages/login/login';
import { MycartPage } from '../../pages/my_cart/my_cart';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})


export class SignupPage {

  public people: any;

  signup = {FIRSTNAME : '', LASTNAME : '', PASSWORD: '', cpassword : '', USERNAME : ''};

  loading: Loading;
  loginStatus: number;
  connected: Subscription;
  disconnected: Subscription;
  userId : any; 
  user : any; 
  userName : any; 
  totalItm : any;
  guestUserId : any;



 loginpage(){
  this.navCtrl.setRoot(LoginPage);
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

  signupFun() {

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

    body.append('FIRSTNAME', this.signup.FIRSTNAME);
    body.append('LASTNAME', this.signup.LASTNAME);
    body.append('PASSWORD', this.signup.PASSWORD);
    body.append('USERNAME', this.signup.USERNAME);
    body.append('cpassword', this.signup.cpassword);
    body.append('isGuestUser', this.guestUserId);


    // for local : -  /UserSignup
    // for server : -  http://omoelle.com/appregister.php
     
     this.http.post(" http://omoelle.com/appregister.php",body,headers)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();

       console.log(JSON.stringify(data));

       if(data.status == 1){


         localStorage.setItem("ItemInCart", data.data.noOfItem);
         this.events.publish('item', data.data.noOfItem);
         this.guestUserId = 0;
         localStorage.setItem("isGuestUser", '0');
         this.getcartItem(data.data.userid, this.guestUserId);


         localStorage.setItem("userId",data.data.userid);
         localStorage.setItem("userName", data.data.fname + ' ' + data.data.lname);
         localStorage.setItem("email",data.data.username);

         this.events.publish('user:created', data.data.userid, Date.now());

          let toast = this.toastCtrl.create({
            message: data.message,
            duration: 2000,
             position: 'top'
          });

         toast.present();
         this.loginStatus = 1;

         this.navCtrl.setRoot(HomePage);

        }else{

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
  

}