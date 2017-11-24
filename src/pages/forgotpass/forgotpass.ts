import { Component } from '@angular/core';
import {  NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform} from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {LoginPage} from '../../pages/login/login';
import {SignupPage} from '../../pages/signup/signup';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-forgotpass',
  templateUrl: 'forgotpass.html'
})
export class ForgotpassPage {

  forgotpassdata = { emailid : '' };

  user : any;
  loading: Loading;

	homemove(){
	  this.navCtrl.setRoot(HomePage);
	}

  signuppage(){
    this.navCtrl.push(SignupPage);
  }

  loginpage(){
    this.navCtrl.push(LoginPage);
  }

  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events) {

  }


  forgotPassFun(){
      
    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();

    let data = JSON.stringify({ emailid : this.forgotpassdata.emailid});

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers });


     this.http.post(" http://omoelle.com/forgotpass.php",data,options)
   
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
 
