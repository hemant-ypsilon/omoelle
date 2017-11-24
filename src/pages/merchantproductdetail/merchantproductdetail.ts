import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the MerchantproductdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-merchantproductdetail',
  templateUrl: 'merchantproductdetail.html',
})
export class MerchantproductdetailPage {

  loading: Loading;
  productId: any;
  productDetail: any; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController) {

        if(localStorage.getItem("isOnline") == '1'){
          this.productId = this.navParams.data.productId;
          this.getProductDetail(this.productId);
        }

  }

   getProductDetail(id){

      this.loading = this.loadingCtrl.create({
          content: '',
      });

      this.loading.present();

  	  this.http.get('http://omoelle.com/merchantProductDetail.php?Id='+id)
  	    .map(res => res.json())
  	    .subscribe(
  	    data => {
  	      this.productDetail = data.data;
  	      this.loading.dismissAll();
  	    }, err => {
  	       alert(err);
  	     }
  	   );

   }

}
