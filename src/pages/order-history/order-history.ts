import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events, ViewController} from 'ionic-angular';


import { OrderHistoryDetailsPage } from '../../pages/order_history_details/order_history_details';



import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';


/**
 * Generated class for the OrderHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  loading: Loading;
  orderList : any;
  user_email : any;


  getHistoryDetail(orderId: any){
    if(localStorage.getItem("isOnline") == '1'){
      this.navCtrl.push(OrderHistoryDetailsPage, {
          orderId: orderId
        });
    }else{
      alert('please check network');
    }
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController, public viewCtrl : ViewController) {

     if(localStorage.getItem("isOnline") == '1'){
     	   this.user_email = localStorage.getItem("email");
           this.getOrderList(this.user_email);
      }
  }

        public closeModal(){
          this.viewCtrl.dismiss();
        }

  
       getOrderList(id){

		     this.loading = this.loadingCtrl.create({
		          content: '',
		      });

		      this.loading.present();

		     this.http.get('http://omoelle.com/getOrderList.php?uid	='+id)
		    .map(res => res.json())
		    .subscribe(
		    data => {
		      this.orderList = data.data;
		      this.loading.dismissAll();
		    }, err => {
		       alert(err);
		     }
		 );
	 
  }

 

}
