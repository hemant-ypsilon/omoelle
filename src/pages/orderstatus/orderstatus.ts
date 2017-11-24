import { Component } from '@angular/core';
import { NavController,MenuController, NavParams, AlertController, LoadingController, Loading, IonicPage, ToastController, Platform } from 'ionic-angular';

import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

/**
 * Generated class for the OrderstatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-orderstatus',
  templateUrl: 'orderstatus.html',
})
export class OrderstatusPage {

  loading: Loading;
  statusData : any;
  orderstatus = {reqId : ''};

  constructor(private menu: MenuController,public navCtrl: NavController, 
              public navParams: NavParams,private http: Http
             ,public loadingCtrl: LoadingController, public toastCtrl: ToastController, private network: Network, public  platform:  Platform, public events: Events) {

             this.statusData = '';


  }

  statusFun(){

    this.loading = this.loadingCtrl.create({
          content: '',
      });

    this.loading.present();

    let data = JSON.stringify({ chek : this.orderstatus.reqId});

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers })
     
     this.http.post("http://omoelle.com/orderStatus.php",data,options)
   
      .map(res => res.json())

      .subscribe(data => {
   
       if(data.status == 1){

          this.statusData = data.msg
          this.loading.dismissAll(); 

        }else{

              let toast = this.toastCtrl.create({
                message: "request error",
                duration: 2000,
                 position: 'top'
              });

             toast.present();

             this.loading.dismissAll(); 

           }

           }, error => {

           console.log(error);
           
       });
  }

}
