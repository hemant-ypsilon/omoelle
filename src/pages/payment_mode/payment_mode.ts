import { Component } from '@angular/core';
import { NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform} from 'ionic-angular';

import { LoginPage } from '../../pages/login/login';
import { OrderDetailPage } from '../../pages/order-detail/order-detail';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';
import { InAppBrowser} from '@ionic-native/in-app-browser';
 
declare var navigator: any;
declare var Connection: any;

@Component({
  selector: 'page-payment_mode',
  templateUrl: 'payment_mode.html'
})
export class Payment_modePage {

paymentdata = {HPHONE : '', EMAIL : '', GENDER: '', DOB : '', BILLTOADDR : '', SHIPTOADDR : '', country : '', STATE : '', regLocation : '', totalprice : '', paymentType : ''};

totalAmount : any;
user : any;
currentPrice : any;
inAppBrowserRef : any;
name : any;
nameInterval : any;
orderId : any;
loading: Loading;
username : any;
 
  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events, private iab: InAppBrowser, private alertCtrl: AlertController) {

             this.username = localStorage.getItem("userName")


             if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
		             this.user = '';
		          } else {
		             this.user = localStorage.getItem("userId");
		          }

             this.totalAmount = 0;
             this.cartList();

  }

   isReadonly() {
     return false;   //return true/false 
  }


   openurl(){

       const browser = this.inAppBrowserRef = this.iab.create('http://omoelle.com/processpaymentApp.php?amount='+this.paymentdata.totalprice+'&payerName='+this.username+'&payerEmail='+this.paymentdata.EMAIL+'&payerPhone='+this.paymentdata.HPHONE+'&paymenttype='+this.paymentdata.paymentType, '_blank', 'location=yes');

       // on start
       this.inAppBrowserRef.show();
       this.inAppBrowserRef.on("loadstart")
       .subscribe(
          event => {

              console.log("url " + event.url);

              console.log("index of starts" + event.url.split('?')[0] );

              if(event.url.split('?')[0]  == 'http://omoelle.com/sample-receipt-page-app.php'){

                      setTimeout(function() {
                          browser.close();
                     }, 5000);

              }

              this.orderId = this.GetParameterValues('orderID', event.url);

             //  this.inAppBrowserRef.close();
            
          },
          err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
       });

       //on url load stop
        this.inAppBrowserRef.on("loadstop")
       .subscribe(
           event => {

              console.log("url " + event.url);

              console.log("index of stop" + event.url.split('?')[0] );


              if( event.url.split('?')[0]  == 'http://omoelle.com/sample-receipt-page-app.php' ){

                setTimeout(function() {
                          browser.close();
                }, 5000);


              }
              
              this.orderId = this.GetParameterValues('orderID', event.url);


           },
       err => {
          console.log("InAppBrowser loadstop Event Error: " + err);
       });


         //on closing the browser
         this.inAppBrowserRef.on("exit")
        .subscribe( 
            event => { 

              console.log('user exist from  payment');
              
              if(this.orderId != 'undefined' && this.orderId != null){

                  this.orderId = this.orderId.replace(/[_\W]+/g, "-");


                  this.navCtrl.setRoot(OrderDetailPage, {
                    orderId: this.orderId
                  });

              }else{

                   this.navCtrl.setRoot(OrderDetailPage);

              }

            

        },
        err => {
              console.log("InAppBrowser loadstart Event Error: " + err);
        });

        console.log('error');
   }



   GetParameterValues(param, url1) {    
            var url = url1.slice(url1.indexOf('?') + 1).split('&');  
            for (var i = 0; i < url.length; i++) {  
                var urlparam = url[i].split('=');  
                if (urlparam[0] == param) {  
                    return urlparam[1];  
                }  
            }  
    }   




    

     paynow(){

        if(localStorage.getItem("isOnline") == '0'){

          alert('Please check internet connection');
          
        }else{
          
          if(this.user != ''){

            this.inAppBrowserRef = window.open( "http://omoelle.com/processpaymentApp.php", "_blank", "location=yes" );

          }else{

            let alert = this.alertCtrl.create({
              title: 'Confirm Login',
              message: 'You should login for further processing, Do you want to login?',
              buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    this.navCtrl.push(LoginPage);
                  }
                }
              ]
            });
            alert.present();

          }

        }
    }



  cartList(){
     this.http.get('http://omoelle.com/cartdata.php?userId='+this.user)
    .map(res => res.json())
    .subscribe(
    data => {
     if(data.status == 1){
        for(let result of data.data) {

          if(result.Price != 0){
            this.currentPrice = parseInt(result.Price.replace(/\,(\d\d)$/, ".$1").replace(',',''));
            this.totalAmount = parseInt(this.totalAmount) + ( parseInt(this.currentPrice) * parseInt(result.quantity_s) + parseInt(result.shipTotal) * parseInt(result.quantity_s) );
           }

        }
        this.getUserData();
      }else{
        console.log(data.message);
      }
    }, err => {
       alert(err);
     }
   );

  }


   getUserData() {

    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
    
      this.http.get("http://omoelle.com/getaccountdetail.php?Id="+this.user)
   
      .map(res => res.json())

      .subscribe(data => {

       if(data.status == 1){
           
           this.paymentdata = data.data;    
           this.paymentdata.totalprice = this.totalAmount;  

           console.log(JSON.stringify(this.paymentdata) );

        }else{

            console.log(data.message);

           }

           }, error => {

           console.log(error);
           
    });


   }

  }


}
