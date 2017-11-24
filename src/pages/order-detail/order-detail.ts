import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events} from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


/**
 * Generated class for the OrderDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  loading: Loading;
  orderId : any;
  paymentDetail = [];
  dateTime: String = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController) {

  	 this.orderId = this.navParams.data.orderId;

  	 console.log( "order id " +  this.orderId);

     if(localStorage.getItem("isOnline") == '1'){
        if(this.orderId == 'undefined' || this.orderId == '' || this.orderId == null){
            console.log('id invalid');
            this.getPaymentDetail(0);
          //  this.paymentDetail = JSON.parse("{"amount":'',"RRR":'',"orderId":'',"message":"User Aborted Transaction","transactiontime": this.dateTime,"status":"012"}");
        }else{
             console.log('id valid');
           //  this.emptycart(localStorage.getItem("userId"));
	       	   this.getPaymentDetail(this.orderId);
             localStorage.removeItem('ItemInCart');
       	 }
     }else{

      this.getPaymentDetail(-1);
     	  console.log('id invalid net connection');
      //  this.paymentDetail = {"amount":'',"RRR":'',"orderId":'',"message":"Please check net connection","transactiontime": this.dateTime,"status":"012"};

     }

        console.log( "in controller " +  JSON.stringify(this.paymentDetail) );

  }


     getPaymentDetail(order){
          this.loading = this.loadingCtrl.create({
                content: '',
            });

            this.loading.present();

           this.http.get('http://omoelle.com/getResponseUsingOrderId.php?orderId='+order)
          .map(res => res.json())
          .subscribe(
          data => {
            this.paymentDetail = JSON.parse(data.data);

            console.log( "payment detail in fun  " +  JSON.stringify(this.paymentDetail) );
            this.loading.dismissAll();
          }, err => {
             alert(err);
           }
         );

   }

  emptycart(userId){

      this.http.get('http://omoelle.com/emptycart.php?userId='+userId)
          .map(res => res.json())
          .subscribe(
          data => {
            if(data.status){
              this.presentToast('Cart is empty now');
             }else{
              this.presentToast('Item have still in cart!');
             }
          }, err => {
             alert(err);
           }
         );


   }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
