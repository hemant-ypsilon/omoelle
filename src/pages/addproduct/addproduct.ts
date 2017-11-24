import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Events, ActionSheetController, Platform} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import {HomePage} from '../../pages/home/home';

declare var cordova: any;

@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html'
})
export class AddproductPage {

loading: Loading;
userId : any; 
public categories: any;
public subCategories : any;
public brand : any;
public seller : any;
addproduct = { categoryId : '', subCategoryId : '', barndId : '', productName : '', product_code : '', productDetails : '', productShortdesc : '', BestSeller : '', price : '', stock : '', featureProduct : '', weight : '', isActive : ''};
lastImage: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController,private transfer: Transfer,private camera: Camera, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform) {

    if(localStorage.getItem("isOnline") == '1'){
       this.getCategory();
       this.getbrand();
       this.getseller();
    }else{
      alert('please check network');
    }

  }

  	// get category

    getCategory(){
        this.loading = this.loadingCtrl.create({
        		content: '',
      	});

      	this.loading.present();

        this.http.get('http://omoelle.com/recordcat.php?limitVal=10&order=catName')
    		.map(res => res.json())
    		.subscribe(
      		data => {
      			this.categories = data;
      			this.loading.dismissAll();
      		}, err => {
      		   alert(err);
      		 }
    	 );
    }

   // get subcategory 

   onSelectCategory(selectedValue: any) {

    console.log('Selected', selectedValue);

    this.http.get('http://omoelle.com/filterproduct.php?catId='+selectedValue)
		.map(res => res.json())
		.subscribe(
		data => {
			this.subCategories = data;
		}, err => {
		   alert(err);
		 }
	 );

  }


   // get brand 

   getbrand() {

  

    this.http.get('http://omoelle.com/getbrand.php')
		.map(res => res.json())
		.subscribe(
		data => {
		    if(data.status == 1){
				this.brand = data.data;
			}else{
				this.brand = '';
			}
		}, err => {
		   alert(err);
		 }
	 );

  }


   // get seller 
   getseller() {

    this.http.get('http://omoelle.com/getseller.php')
		.map(res => res.json())
		.subscribe(
		data => {
		    if(data.status == 1){
				this.seller = data.data;
			}else{
				this.seller = '';
			}
		}, err => {
		   alert(err);
		 }
	 );

  }

  // Create a new name for the image
	private createFileName() {
	  var d = new Date(),
	  n = d.getTime(),
	  newFileName =  n + ".jpg";
	  return newFileName;
	}
 
	// Copy the image to a local folder
	private copyFileToLocalDir(namePath, currentName, newFileName) {
	  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
	    this.lastImage = newFileName;

	  }, error => {
	   // this.toastCtrl('Error while storing file.');

	     let toast = this.toastCtrl.create({
		    message: 'Error while storing file.',
		    duration: 3000,
		    position: 'top'
		  });
		  toast.present();

	  });
	}
	 
	private presentToast(text) {
	  let toast = this.toastCtrl.create({
	    message: text,
	    duration: 3000,
	    position: 'top'
	  });
	  toast.present();
	}
 
	// Always get the accurate path to your apps folder
	public pathForImage(img) {
	  if (img === null) {
	    return '';
	  } else {
	    return cordova.file.dataDirectory + img;
	  }
	}



  public takePicture(sourceType) {

  // Create options for the Camera Dialog

  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

           console.log("currentName" + currentName);
           console.log("correctPath" + correctPath);

          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

      console.log("currentName" + currentName);
      console.log("correctPath" + correctPath);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}


   public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }



  public addProFun() {

   if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{


	  // Destination URL
	  var url = "http://omoelle.com/upload.php";
	 
	  // File for Upload
	  var targetPath = this.pathForImage(this.lastImage);
	 
	  // File name only
	  var filename = this.lastImage;
	 
	  var options = {
	    fileKey: "file",
	    fileName: filename,
	    chunkedMode: false,
	    mimeType: "multipart/form-data",
	    params : {'fileName': filename}
	  };
	 
	  const fileTransfer: TransferObject = this.transfer.create();
	 
	  this.loading = this.loadingCtrl.create({
	    content: 'Uploading...',
	  });
	  this.loading.present();
	 
	  // Use the FileTransfer to upload the image
	  fileTransfer.upload(targetPath, url, options).then(resultdata => {

	        console.log(JSON.stringify(resultdata));

	  	 // 	console.log("status " + resultdata.status);

	  	 // 	console.log("error " + resultdata.error);
	      
		    let headers = new Headers({ 'Content-Type': 'application/json' });

		    let body = new FormData();

		    body.append('BestSeller', this.addproduct.BestSeller);

		    body.append('productName', this.addproduct.productName);

		    body.append('product_code', this.addproduct.product_code);

		    body.append('productDetails', this.addproduct.productDetails);

		    body.append('productShortdesc', this.addproduct.productShortdesc);

		    body.append('productImage', this.lastImage);

		    body.append('sellerId', localStorage.getItem("merchantId") );

		    body.append('stock', this.addproduct.stock);
		    body.append('catId', this.addproduct.categoryId);
		    body.append('brandId', this.addproduct.barndId);
		    body.append('subCatId', this.addproduct.subCategoryId);
		    body.append('price', this.addproduct.price);
		    body.append('isActive', this.addproduct.isActive);


		    body.append('featureProduct', this.addproduct.featureProduct);

		    body.append('weight', this.addproduct.weight);


		    // for local : -  /add product
		    // for server : -  http://omoelle.com/addproductfromapp.php
		     
		     this.http.post(" http://omoelle.com/addproductfromapp.php",body,headers)
		   
		      .map(res => res.json())

		      .subscribe(data => {

		       this.loading.dismissAll();

		       console.log(JSON.stringify(data));

		       if(data.status == 1){

		       	 console.log(Date.now());

		          let toast = this.toastCtrl.create({
		            message: data.message,
		            duration: 2000,
		             position: 'top'
		          });

		         toast.present();
		         this.navCtrl.setRoot(HomePage);

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

		


	  }, err => {
	    this.loading.dismissAll()
	    this.presentToast('Error while uploading file.');
	  });

   }


}



}
