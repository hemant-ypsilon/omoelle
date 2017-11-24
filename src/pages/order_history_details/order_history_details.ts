import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events} from 'ionic-angular';

import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import {ProductdetailPage} from '../../pages/product_detail/product_detail';


@Component({
  selector: 'page-order_history_details',
  templateUrl: 'order_history_details.html'
})
export class OrderHistoryDetailsPage {

  loading: Loading;
  orderDetail : any;
  getLength : any;
  currentPrice : any;
  totalAmount : any;
  orderId : any;

  sOrderId : any;
  date : any;
  time: any;

 movetoproductdetail(productId: any){
    if(localStorage.getItem("isOnline") == '1'){
      this.navCtrl.push(ProductdetailPage, {
          productId: productId
        });
    }else{
      alert('please check network');
    }
  }



    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController) {

     this.getLength = 0;
     this.totalAmount = 0;

     if(localStorage.getItem("isOnline") == '1'){
           this.orderId = this.navParams.data.orderId;
           this.orderdetail(this.orderId);
      }
  }


       orderdetail(id){

         this.loading = this.loadingCtrl.create({
              content: '',
          });

          this.loading.present();

         this.http.get('http://omoelle.com/order_history_detail.php?oid='+id)
        .map(res => res.json())
        .subscribe(
        data => {
          this.orderDetail = data.data;
          this.sOrderId = data.order_id;
          this.date = data.date;
          this.time = data.time;

          if(Object.keys(this.orderDetail).length > 0){
            this.getLength = Object.keys(this.orderDetail).length;
          }

          for(let data of this.orderDetail) {

              this.currentPrice = parseInt(data.ProPrice.replace(/\,(\d\d)$/, ".$1").replace(',',''));

              this.totalAmount = parseInt(this.totalAmount) + ( parseInt(this.currentPrice) * parseInt(data.quantity_s) );
          }


          this.loading.dismissAll();
        }, err => {
           alert(err);
         }
     );
   
  }




}
