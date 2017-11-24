import { Component } from '@angular/core';
import {  NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform} from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

import {HomePage} from '../../pages/home/home';


declare var navigator: any;
declare var Connection: any;
 

@Component({
  selector: 'page-helpsupport',
  templateUrl: 'helpsupport.html'
})
export class HelpsupportPage {

 helpdata = { message : '', email : '', name : '' };
 user : any;
 loading: Loading;
 
  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events, fb: FormBuilder) {

              if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
		             this.user = '';
		          } else {
		             this.user = localStorage.getItem("email");
		      }

   
  }


  sendMail(){
      
    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();

    let data = JSON.stringify({ message : this.helpdata.message, useremail : this.helpdata.email, name : this.helpdata.name});

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers });


     this.http.post(" http://omoelle.com/sendmail.php",data,options)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();


       if(data.status == 1){

           let toast = this.toastCtrl.create({
                message: data.message,
                duration: 2000,
                 position: 'top'
              });

             toast.present();
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
