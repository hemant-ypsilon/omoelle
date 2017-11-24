import { Component } from '@angular/core';
import {  NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform, ViewController} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

import {HomePage} from '../../pages/home/home';

declare var navigator: any;
declare var Connection: any;


/**
 * Generated class for the ChangepasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  form: FormGroup;
  
  changepass = {old_password : '', new_password : '', new_cpassword : ''};

  loading: Loading;
  loginStatus: number;
  connected: Subscription;
  disconnected: Subscription;
  id: any;

  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events, fb: FormBuilder, public viewCtrl : ViewController) {

		     this.form = fb.group({
		    // define your control in you form
		      new_password: ['123'],
		      new_cpassword: ['123']
		    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }


  changePassFun() {

    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let body = new FormData();

    body.append('old_password', this.changepass.old_password);
    body.append('new_password', this.changepass.new_password);
    body.append('new_cpassword', this.changepass.new_cpassword);
    body.append('userid', localStorage.getItem("userId"));
  


    // for local : -  /ChangePassword
    // for server : -  http://omoelle.com/changepassword.php
     
     this.http.post(" http://omoelle.com/changepassword.php",body,headers)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();


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
