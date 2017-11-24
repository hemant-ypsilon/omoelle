import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events} from 'ionic-angular';

import {MycartPage} from '../../pages/my_cart/my_cart';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-product_detail',
  templateUrl: 'product_detail.html'
})
export class ProductdetailPage {

   productId: any;
   productDetail: any; 
   loading: Loading;
   loginStatus : number;
   userId : any; 
   user : any; 
   userName : any; 
   totalItm : any;
   guestUserId : any;

  movetosuMycart(){

       if(localStorage.getItem("isOnline") == '1'){
          this.navCtrl.push(MycartPage);
        }else{
          alert('please check network');
        }

  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController) {

     if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
            this.loginStatus = 0;
            this.guestUserId = localStorage.getItem('isGuestUser');
          } else {
           this.loginStatus = 1;
           this.guestUserId = 0;
           this.userId = localStorage.getItem("userId");
      }


      this.events.subscribe('itemAdded', (numberOfitm) => {
          this.totalItm = numberOfitm;
      });

      if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
             this.totalItm = 0;
          } else {
            this.totalItm = localStorage.getItem('ItemInCart');
       }



  	  this.productId = this.navParams.data.productId;
      this.getProductDetail(this.productId);
  }

     getProductDetail(id){

      this.loading = this.loadingCtrl.create({
          content: '',
      });

      this.loading.present();

      // for local : -  /GetProductDetail
     // for server : -  http://omoelle.com/detailsphp.php

	     this.http.get('http://omoelle.com/detailsphp.php?Id='+id)
	    .map(res => res.json())
	    .subscribe(
	    data => {
	      this.productDetail = data;
	      this.loading.dismissAll();
	    }, err => {
	       alert(err);
	     }
	   );

   }

//addItemInCart.php

   addToCart(Id,BestSeller,productId,productName,product_code,productDetails,productShortdesc,productImage,sellerId,Date,stock,isReturnable,catId,brandId,subCatId,price,weight){

     if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
             this.user = 0;
             this.userName = "Guset"
             this.guestUserId = localStorage.getItem('isGuestUser');
          } else {
             this.user = localStorage.getItem("userId");
             this.userName = localStorage.getItem("email");
             this.guestUserId = 0;
      }


    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();
    
    let data = JSON.stringify({ product_id:Id, custid : this.user, userId : this.user, USERNAME : this.userName, addBasket : '10', quantity_s : '1', TotalPrice : price, shipTotal : price, GrandTotal: price, Rate : price, productName : productName, productDetails : productDetails, sellerid : sellerId, Price : price, productImage : productImage, isGuestUserId : this.guestUserId, weight : weight});

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers })


    // for local : -  /AddToCart
    // for server : -  http://omoelle.com/addItemInCart.php
     
     this.http.post(" http://omoelle.com/addItemInCart.php",data,options)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();


       if(data.status == 1){

         this.events.publish('itemAdded', data.data.item); 

         localStorage.setItem("ItemInCart", data.data.item);

         // local storage item

         localStorage.setItem("isGuestUser", data.data.guestUserId);

          let toast = this.toastCtrl.create({
            message: data.message,
            duration: 2000,
             position: 'top'
          });

         toast.present();
         this.loginStatus = 1;

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
