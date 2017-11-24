import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { ChangepasswordPage } from '../../pages/changepassword/changepassword';
import { OrderHistoryPage } from '../../pages/order-history/order-history';
import { AccountinfoPage} from '../../pages/account_info/account_info';

/**
 * Generated class for the MyaccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl : ModalController) {
  }

   openModalMyAccount(event) {
        event.stopPropagation();
        var data = { message : 'hello world' };
        var modalPage = this.modalCtrl.create('AccountinfoPage',data);
        modalPage.present();
    }


   openModalChangePassword(event) {
        event.stopPropagation();
        var data = { message : 'hello world' };
        var modalPage = this.modalCtrl.create('ChangepasswordPage',data);
        modalPage.present();
    }

    openModalOrderHistory(event) {
        event.stopPropagation();
        var data = { message : 'hello world' };
        var modalPage = this.modalCtrl.create('OrderHistoryPage',data);
        modalPage.present();
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyaccountPage');
  }

}
