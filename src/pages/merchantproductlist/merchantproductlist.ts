import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events} from 'ionic-angular';


import { MerchantproductdetailPage } from '../../pages/merchantproductdetail/merchantproductdetail';


import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the MerchantproductlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-merchantproductlist',
  templateUrl: 'merchantproductlist.html',
})
export class MerchantproductlistPage {

  loading: Loading;
  merchantId : any;
  productList : any;
  prodductListShow : boolean;


  movetoproductdetail(productId: any){
    if(localStorage.getItem("isOnline") == '1'){
      this.navCtrl.push(MerchantproductdetailPage, {
          productId: productId
        });
    }else{
      alert('please check network');
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController) {

     if((localStorage.getItem('merchantId') === "undefined" || localStorage.getItem('merchantId') === null ||  localStorage.getItem('merchantId') === '' ) ) {
             this.merchantId = 0;
          } else {
            this.merchantId = localStorage.getItem('merchantId');
       }

        if(localStorage.getItem("isOnline") == '1'){
           this.getProductList(this.merchantId);
        }


  }

     getProductList(id){

         if(id == 0){

	         let toast = this.toastCtrl.create({
			    message: 'Need to become a merchant',
			    duration: 3000,
			    position: 'top'
			  });
			  toast.present();


         }else{

		     this.loading = this.loadingCtrl.create({
		          content: '',
		      });

		      this.loading.present();


		     this.http.get('http://omoelle.com/getMerchantProduct.php?mid='+id)
		    .map(res => res.json())
		    .subscribe(
		    data => {

        if(data.status == 1){
		      this.productList = data.data;
          this.prodductListShow = true;
        }else{
          this.prodductListShow = false;
        }

		      this.loading.dismissAll();
		    }, err => {
		       alert(err);
		     }
		   );
	 }
  }

}
