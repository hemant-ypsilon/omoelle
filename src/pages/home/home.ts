import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, Alert, Platform,  ToastController, AlertController, MenuController} from 'ionic-angular';
import {SubcategoryPage} from '../../pages/subcategory/subcategory';
import { MycartPage } from '../../pages/my_cart/my_cart';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Events } from 'ionic-angular';
import { InAppBrowser} from '@ionic-native/in-app-browser'
import { LoginPage } from '../../pages/login/login';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

 public categories: any;
 loading: Loading;
 loginStatus : number;
 connected: Subscription;
 disconnected: Subscription;
 totalItm : any;
 userId : any; 
 inAppBrowserRef : any;
 guestUserId : any;
 HaveMerchant : number;



   movetosuCate(categoryId: any){
    if(localStorage.getItem("isOnline") == '1'){
     	this.navCtrl.push(SubcategoryPage, {
          categoryId: categoryId
        });
    }else{
      alert('please check network');
    }

   }

    movetosuMycart(){
       if(localStorage.getItem("isOnline") == '1'){
        this.navCtrl.push(MycartPage);
       }else{
        alert('please check network');
      }
   }

  constructor(private toast: ToastController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController,  private network: Network, public  platform:  Platform, public events: Events, private iab: InAppBrowser, private alertCtrl: AlertController, private menu: MenuController, private locationAccuracy: LocationAccuracy) {

          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if(1) {
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => console.log('Request successful'),
                error => console.log('Error requesting location permissions', error)
              );
            }

          });


       this.menu.swipeEnable(false);

      if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
             this.userId = 0;
             this.guestUserId = localStorage.getItem('isGuestUser');
          } else {
             this.userId = localStorage.getItem("userId");
             this.guestUserId = 0;
             this.getAccountDetail(this.userId);
      }

      if((localStorage.getItem('isUserHaveMerchant') == '1') ) {
             this.HaveMerchant = 1;
          } else {
             this.HaveMerchant = 0;
      }

      console.log("have merchant " + this.HaveMerchant);


       if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
             this.totalItm = 0;
             this.events.publish('itemAdded', 0);
          } else {
            this.totalItm = localStorage.getItem('ItemInCart');
            this.events.publish('itemAdded', localStorage.getItem('ItemInCart'));
       }

       this.events.subscribe('itemAdded', (numberOfitm) => {
         localStorage.setItem("ItemInCart", numberOfitm);
          this.totalItm = numberOfitm;
       });


      this.events.subscribe('item', (count) => {
       this.totalItm = count;
       localStorage.setItem("ItemInCart", count);
      });




      this.events.subscribe('isMerchant', (val) => {
        this.HaveMerchant = 1;
      });


      this.events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        this.loginStatus = 1;
        console.log('Welcome', user, 'at', time);
      });



    this.network.onConnect().subscribe(data => { localStorage.setItem("isOnline",'1');  })

    this.platform.ready().then(() => {



         console.log("is user login" + localStorage.getItem("userId") );

         if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
                this.loginStatus = 0;
              } else {
                 this.loginStatus = 1;
          }

        if(localStorage.getItem("isOnline") == '1'){
           this.getCatData();
           this.getcartItem(this.userId, this.guestUserId);
           this.getAccountDetail(this.userId);
        }

    })
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


    doRefresh(refresher) {
      console.log('Begin async operation', refresher);

      this.connected = this.network.onConnect().subscribe(data => {
        console.log('is coonected');
        localStorage.setItem("isOnline",'1');
      }, error => console.error(error));

      this.disconnected = this.network.onDisconnect().subscribe(data => {
         console.log('is not coonected');
         localStorage.setItem("isOnline",'0');
      }, error => console.error(error));

      console.log("custome 2" + localStorage.getItem("isOnline"));

      if(localStorage.getItem("isOnline") == '1'){
         this.getCatData();
      }


      if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
             this.userId = 0;
             this.guestUserId = localStorage.getItem('isGuestUser');
          } else {
             this.userId = localStorage.getItem("userId");
             this.guestUserId = 0;
      }


      if(localStorage.getItem("isOnline") == '1' && this.userId  != ''){
         this.getcartItem(this.userId, this.guestUserId);
      }


      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    }



      getCatData() {

        this.loading = this.loadingCtrl.create({
        		content: '',
      	});

      	this.loading.present();

      // for local : -  /GetCategory
      // for server : -  http://omoelle.com/recordcat.php


    		this.http.get('http://omoelle.com/recordcat.php?limitVal=10&order=catName')
    		.map(res => res.json())
    		.subscribe(
      		data => {
      			this.categories = data;
      			this.loading.dismissAll();
      		}, err => {
      		       let alert = this.alertCtrl.create({
                  title: 'Internet Connection',
                  subTitle: 'Please check your internet connection',
                  buttons: ['Dismiss']
                });
                alert.present();
      		 }
    	 );
  }

    getcartItem(user, isGuestUser){
     // for local : //CountCartItm
     // for server : -  http://omoelle.com/getcartitem.php
     this.http.get('http://omoelle.com/getcartitem.php?userid='+user+'&isGuestUser='+isGuestUser)
    .map(res => res.json())
    .subscribe(
    data => {
      if(data.status == 1){
        console.log("home cart item " + data.data.item)
         this.totalItm = data.data.item;
        localStorage.setItem("ItemInCart", data.data.item);
       }else{
         localStorage.setItem("ItemInCart", '0');
       }
    }, err => {
       alert(err);
     }
   );
  }

    loginpage(){
        this.navCtrl.push(LoginPage);
    }

}
