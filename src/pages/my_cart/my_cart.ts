import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events, AlertController} from 'ionic-angular';
//import {SubcategoryPage} from '../../pages/subcategory/subcategory';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {ProductdetailPage} from '../../pages/product_detail/product_detail';
import { Payment_modePage } from '../../pages/payment_mode/payment_mode';
import { LoginPage } from '../../pages/login/login';

import { Network } from '@ionic-native/network';
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'page-my_cart',
  templateUrl: 'my_cart.html'
})

export class MycartPage {

   loading: Loading;
   loginStatus : number;
   connected: Subscription;
   disconnected: Subscription;
   user : any;
   productList : any;
   dataShow : boolean;
   totalItm : any;
   quantity_s : any;
   updateQua : any;
   totalAmount : any;
   currentPrice : any;
   getLength : any;
   guestUserId : any;
   shippingPrice : any;

   movetoproductdetail(productId: any){
    if(localStorage.getItem("isOnline") == '1'){
      this.navCtrl.push(ProductdetailPage, {
          productId: productId
        });
    }else{
         let alert = this.alertCtrl.create({
          title: 'Internet Connection',
          subTitle: 'Please check your internet connection',
          buttons: ['Dismiss']
        });
        alert.present();
    }
  }

  paymentprocess(){
     if(localStorage.getItem("isOnline") == '1'){

        if(this.user != 0){
            this.navCtrl.push(Payment_modePage);
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

      }else{
        alert('please check network');
      }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController, private network: Network, private alertCtrl: AlertController) {

       this.totalAmount = 0;
       this.getLength = 0;
      
       if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
             this.user = 0;
             this.guestUserId = localStorage.getItem('isGuestUser');
          } else {
             this.user = localStorage.getItem("userId");
             this.guestUserId = 0;
       }

       this.network.onConnect().subscribe(data => { 
       	       localStorage.setItem("isOnline",'1');  
       })

       if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
             this.totalItm = 0;
          } else {
             this.totalItm = localStorage.getItem('ItemInCart');
       }

      // this.cartList(this.user, this.guestUserId);

     //  if(localStorage.getItem("isOnline") == '1' && this.user != ''){
     //     this.cartList(this.user);
     //   }

        this.events.subscribe('itemAdded', (numberOfitm) => {
            this.totalItm = numberOfitm;
        });
  	 
      this.quantity_s = 1;

  }

    ionViewWillEnter() {
       this.cartList(this.user, this.guestUserId);
    }



    cartList(id, isGuestUser){

      this.totalAmount = 0;

      this.loading = this.loadingCtrl.create({
          content: '',
      });

      this.loading.present();

     // for local : -  /getCartList
     // for server : -  http://omoelle.com/cartdata.php


     this.http.get('http://omoelle.com/cartdata.php?userId='+id+'&isGuestUser='+isGuestUser)
    .map(res => res.json())
    .subscribe(
    data => {
     if(data.status == 1){

        this.productList = data.data;

        if(Object.keys(this.productList).length > 0){
          this.getLength = Object.keys(this.productList).length;
        }

        for(let data of this.productList) {

          if(data.Price != 0){
              this.currentPrice = parseInt(data.Price.replace(/\,(\d\d)$/, ".$1").replace(',',''));

              if(data.shipTotal != 0)
                this.shippingPrice = parseInt(data.shipTotal.replace(/\,(\d\d)$/, ".$1").replace(',',''));
              else
                this.shippingPrice =0;

              this.totalAmount = parseInt(this.totalAmount) + ( parseInt(this.currentPrice) * parseInt(data.quantity_s) ) + ( parseInt(this.shippingPrice) * parseInt(data.quantity_s ) );
            }
        }

        console.log("car id" + this.productList[0].quantity_s);
        this.loading.dismissAll();
        this.dataShow = true;
      }else{
        this.totalAmount = '00';
        this.totalItm = 0;
        localStorage.removeItem('ItemInCart');
        this.productList = data.data;
        this.loading.dismissAll();
        this.dataShow = false;
      }
    }, err => {
       alert(err);
     }
   );

  }


 removeFromcart(id, pos) {

  console.log("Pro" + id);
  console.log("Ind" + pos);

   let alert = this.alertCtrl.create({
    title: 'Cart Item',
    message: 'Do you want to remove this item from cart',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Remove',
        handler: () => {

             this.loading = this.loadingCtrl.create({
		          content: '',
		      });

		      this.loading.present();

		     // for local : -  /removeItemFromCart
		     // for server : -  http://omoelle.com/cartdata.php
         // this.guestUserId

		     this.http.get('http://omoelle.com/removeItemFromCart.php?proId='+id+'&userId='+this.user+'&isGuestUser='+this.guestUserId)
		    .map(res => res.json())
		    .subscribe(
		    data => {
		     if(data.status == 1){

		        this.events.publish('itemAdded', data.data.item); 
            localStorage.setItem("ItemInCart", data.data.item);

		        this.loading.dismissAll();

            console.log(" curent price  " + this.productList[pos].Price);

            if(this.productList[pos].Price != 0){

              this.updateQua =  this.productList[pos].quantity_s;
              this.currentPrice = this.productList[pos].Price;
              this.currentPrice = parseInt(this.currentPrice.replace(/\,(\d\d)$/, ".$1").replace(',',''));


              this.shippingPrice = parseInt(this.productList[pos].shipTotal.replace(/\,(\d\d)$/, ".$1").replace(',',''));
            

              this.totalAmount = parseInt(this.totalAmount) - ( parseInt(this.updateQua) * parseInt(this.currentPrice) + ( parseInt(this.updateQua) * parseInt(this.shippingPrice) ) );

              }

              (this.productList).splice(pos, 1);

              if(this.productList.length == 0){
                this.getLength = 0;
              }

            

		        let toast = this.toastCtrl.create({
		            message: data.message,
		            duration: 2000,
		            position: 'top'
		          });

		        toast.present();

		      }else{
		        this.loading.dismissAll();
		        let toast = this.toastCtrl.create({
		            message: data.message,
		            duration: 2000,
		             position: 'top'
		          });

		        toast.present();  
		      }
		    }, err => {
		       console.log(err);
		     }
		   );
          console.log('Buy clicked');
        }
      }
    ]
  });
  
  alert.present();

 }


   // increment product quantity_s
  incrementQty(proId, index: number) {

    if(localStorage.getItem("isOnline") == '1'){

      if(this.productList[index].Price == 0){

        let alert = this.alertCtrl.create({
        title: "Price increment issue",
        subTitle: "Can't inrement, Product price is 0",
        buttons: ['Dismiss']
      });
      alert.present();

      }else{

         this.updateQua = ++this.productList[index].quantity_s;

         this.currentPrice = this.productList[index].Price;

         this.currentPrice = parseInt(this.currentPrice.replace(/\,(\d\d)$/, ".$1").replace(',',''));

         this.shippingPrice = parseInt(this.productList[index].shipTotal.replace(/\,(\d\d)$/, ".$1").replace(',',''));
         
         this.totalAmount = parseInt(this.totalAmount) +  parseInt(this.currentPrice) +  parseInt(this.shippingPrice)  ;

         this.updateCart(proId, this.updateQua);
      }

    }else{
      let alert = this.alertCtrl.create({
        title: 'Internet Connection',
        subTitle: 'Please check your internet connection',
        buttons: ['Dismiss']
      });
      alert.present();
     }
  }

  // decrement product quantity_s
  decrementQty(proId, index: number) {
   if(localStorage.getItem("isOnline") == '1'){
      if(  parseInt( this.productList[index].quantity_s ) - 1  < 1 ){
        this.updateQua = this.productList[index].quantity_s = 1
        console.log('1->'+this.quantity_s);
      }else{
        this.updateQua = --this.productList[index].quantity_s;

        this.currentPrice = this.productList[index].Price;

        this.currentPrice = parseInt(this.currentPrice.replace(/\,(\d\d)$/, ".$1").replace(',',''));

        this.shippingPrice = parseInt(this.productList[index].shipTotal.replace(/\,(\d\d)$/, ".$1").replace(',',''));
       
        this.totalAmount = parseInt(this.totalAmount) - ( parseInt(this.currentPrice ) + parseInt(this.shippingPrice ) );

        console.log('2->'+this.quantity_s);
        this.updateCart(proId, this.updateQua);
      }
    }else{
      let alert = this.alertCtrl.create({
        title: 'Internet Connection',
        subTitle: 'Please check your internet connection',
        buttons: ['Dismiss']
      });
      alert.present();
     }
  }


  updateCart(proId, quantity){

    let data = JSON.stringify({ proId:proId, quantity : quantity });

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers })

    // for local : -  /updatecart
    // for server : -  http://omoelle.com/updatecart.php

     this.http.post(" http://omoelle.com/updatecart.php",data,options)
      .map(res => res.json())
      .subscribe(
      data => {
         console.log('quantity updated!');
      }, err => {
         alert(err);
       }
     );

  }
 
}