import { Component } from '@angular/core';
import { NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform, ViewController} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@IonicPage()

@Component({
  selector: 'page-accountinfo',
  templateUrl: 'account_info.html'
})
export class AccountinfoPage {

  public people: any;

  account = {FIRSTNAME : '',LASTNAME : '',HPHONE : '', USERNAME : '', GENDER: '', DOB : '', BILLTOADDR : '', SHIPTOADDR : '', country : '', STATE : '', regLocation : ''};

  loading: Loading;
  loginStatus: number;
  connected: Subscription;
  disconnected: Subscription;
  id: any;
  accountDetail : any;



 homemove(){
	 this.navCtrl.setRoot(HomePage);
 }


  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events, public viewCtrl : ViewController) {

             this.getAccountDetail();

  }

   public closeModal(){
          this.viewCtrl.dismiss();
    }


    getAccountDetail(){

      this.loading = this.loadingCtrl.create({
          content: '',
      });

      this.loading.present();

       // for local : -  /GetAccountDetail
      // for server : -  http://omoelle.com/getaccountdetail.php

         this.id = localStorage.getItem("userId");

	     this.http.get('http://omoelle.com/getaccountdetail.php?Id='+this.id)
	    .map(res => res.json())
	    .subscribe(
	    data => {
	      this.account = data.data;
	      this.loading.dismissAll();
	    }, err => {
	       alert(err);
	     }
	   );

   }

    accountFun() {

    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let body = new FormData();

    body.append('FIRSTNAME', this.account.FIRSTNAME);
    body.append('LASTNAME', this.account.LASTNAME);

    body.append('HPHONE', this.account.HPHONE);
    body.append('USERNAME', this.account.USERNAME);
    body.append('GENDER', this.account.GENDER);
    body.append('DOB', this.account.DOB);
    body.append('BILLTOADDR', this.account.BILLTOADDR);
    body.append('SHIPTOADDR', this.account.SHIPTOADDR);
    body.append('country', this.account.country);
    body.append('STATE', this.account.STATE);
    body.append('regLocation', this.account.regLocation);
    body.append('userid', localStorage.getItem("userId"));


    // for local : -  /UserUpdateAc
    // for server : -  http://omoelle.com/updateaccount.php
     
     this.http.post(" http://omoelle.com/updateaccount.php",body,headers)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();

       console.log(JSON.stringify(data));

       if(data.status == 1){

         this.events.publish('user:created', localStorage.getItem("userId"), Date.now());

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


}
