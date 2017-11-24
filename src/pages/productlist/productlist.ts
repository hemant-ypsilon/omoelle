import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events , ModalController} from 'ionic-angular';
import {MycartPage} from '../../pages/my_cart/my_cart';
import {ProductdetailPage} from '../../pages/product_detail/product_detail';
import { Http, Headers, RequestOptions} from '@angular/http';
import {  PeopleService } from '../../providers/random-user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-productlist',
  templateUrl: 'productlist.html'
})
export class ProductlistPage {

   subcateId: any;
   // productList: any; 
   public productList:any = [];
   private start:number=0;
   loading: Loading;
   loginStatus : number;
   userId : any; 
   user : any; 
   userName : any; 
   totalItm : any;
   guestUserId : any;
   prodductListShow : boolean;

  movetosuMycart(){
     if(localStorage.getItem("isOnline") == '1'){
        this.navCtrl.push(MycartPage);
      }else{
        alert('please check network');
      }
  }

  movetoproductdetail(productId: any){
    if(localStorage.getItem("isOnline") == '1'){
      this.navCtrl.push(ProductdetailPage, {
          productId: productId
        });
    }else{
      alert('please check network');
    }
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController, public modalCtrl : ModalController,public peopleService:PeopleService) {

     if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
            this.loginStatus = 0;
          } else {
             this.loginStatus = 1;
      }

      if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
             this.totalItm = 0;
          } else {
            this.totalItm = localStorage.getItem('ItemInCart');
       }


      this.events.subscribe('itemAdded', (numberOfitm) => {
          this.totalItm = numberOfitm;
      });

      this.subcateId = this.navParams.data.subcateId;
      this.getProductList(this.subcateId);

  }



  openModal(event) {
    event.stopPropagation();
    var data = { message : 'hello world' };
    var modalPage = this.modalCtrl.create('ModalPage',data);

    modalPage.onDidDismiss(data => {
      console.log(data);
      this.getItems(data.brandName, data.min, data.max);
    });

     modalPage.present();
  }


    getItems(brandName, MinVal, maxVal) {
     

      // set value
      let brand = brandName;
      let min = MinVal;
      let max = maxVal;

      // if the value is an empty string don't filter the items

      if (brand && brand.trim() != '') {
        this.productList = this.productList.filter((item) => {
          return (item.brandName.toLowerCase().indexOf(brand.toLowerCase()) > -1);
        })
      }

     if (min && min.trim() != '' && max && max.trim() != '') {
        console.log("min" + min);
        console.log("max" + max);
      

        this.productList =  this.productList.filter(item => {
           return item.price >= +min && item.price <= +max;
        });


      }

  }


   getProductList(id){

      this.loading = this.loadingCtrl.create({
          content: '',
      });
      this.loading.present();

   
      
          return new Promise(resolve => {

            this.peopleService.load(this.start, id)
              .subscribe( (res)  => {
                  
                  for(let person of res.data) {
                    console.log(res);
                    this.productList.push(person);
                  }
                  this.loading.dismissAll();
                  this.prodductListShow = true;
                  
                }

              )
            
     });

  }

    doInfinite(infiniteScroll:any) {

      console.log('Begin async operation');
      this.start+=10;
      return new Promise((resolve) => {
        setTimeout(() => {

          this.getProductList(this.subcateId).then(()=>{
              //  infiniteScroll.complete();
           });

           console.log('Async operation has ended');
           infiniteScroll.complete();
        }, 1000);
      })

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

   let data = JSON.stringify({ product_id:Id, custid : this.user, userId : this.user, USERNAME : this.userName, addBasket : '10', quantity_s : '1', TotalPrice : price, shipTotal : price, GrandTotal: price, Rate : price, productName : productName, productDetails : productDetails, sellerid : sellerId, Price : price, productImage : productImage, isGuestUserId : this.guestUserId, weight : weight });

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers });
  

    // for local : -  /AddToCart
    // for server : -  http://omoelle.com/addItemInCart.php
     
     this.http.post("http://omoelle.com/addItemInCart.php",data,options)
   
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
