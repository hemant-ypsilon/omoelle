import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Loading, LoadingController, Events} from 'ionic-angular';
import {ProductlistPage} from '../../pages/productlist/productlist';
import { MycartPage } from '../../pages/my_cart/my_cart';
import { Http } from '@angular/http';

@Component({
  selector: 'page-subcategory',
  templateUrl: 'subcategory.html'
})
export class SubcategoryPage {

 categoryId: any;
 subCategories: any; 
 loading: Loading;
 loginStatus : number;
 totalItm : any;

 productlists(subcateId: any){
 
    if(localStorage.getItem("isOnline") == '1'){
    this.navCtrl.push(ProductlistPage, {
        subcateId: subcateId
      });
  }else{
    alert('please check network');
  }


 }

  movetosuMycart(){

     if(localStorage.getItem("isOnline") == '1'){
        this.navCtrl.push(MycartPage);
      }else{
        alert('please check network');
      }

  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events) {

      if((localStorage.getItem('userId') === "undefined" || localStorage.getItem('userId') === null) ) {
            this.loginStatus = 0;
          } else {
             this.loginStatus = 1;
      }

      if((localStorage.getItem('ItemInCart') === "undefined" || localStorage.getItem('ItemInCart') === null ||  localStorage.getItem('ItemInCart') === '' ) ) {
             this.totalItm = 0;
             this.events.publish('itemAdded', 0);
          } else {
            this.totalItm = localStorage.getItem('ItemInCart');
            this.events.publish('itemAdded', localStorage.getItem('ItemInCart'));
       }

      this.events.subscribe('itemAdded', (numberOfitm) => {
          this.totalItm = numberOfitm;
      });

  		this.categoryId = this.navParams.data.categoryId;
  		this.getSubcatList(this.categoryId);
  }

  getSubcatList(id){

     this.loading = this.loadingCtrl.create({
          content: '',
      });

      this.loading.present();

     // for local : -  /GetSubCategory
     // for server : -  http://omoelle.com/filterproduct.php

     this.http.get('http://omoelle.com/filterproduct.php?catId='+id)
		.map(res => res.json())
		.subscribe(
		data => {
			this.subCategories = data;
      this.loading.dismissAll();
		}, err => {
		   alert(err);
		 }
	 );

  }
}
