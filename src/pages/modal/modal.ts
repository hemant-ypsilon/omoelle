import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController , AlertController , Events} from 'ionic-angular';

@IonicPage()
@Component({
selector: 'page-modal',
templateUrl: 'modal.html',
})
export class ModalPage {

 filterData = {brandName : '', min : '', max: ''};

constructor(public navCtrl: NavController, public viewCtrl : ViewController ,public navParams: NavParams) {
}

public closeModal(){
    this.viewCtrl.dismiss(this.filterData);
}

ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
    console.log(this.navParams.get('message'));
}

}    