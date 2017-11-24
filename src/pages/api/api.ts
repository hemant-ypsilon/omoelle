import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ApiPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-api',
  templateUrl: 'api.html',
})
export class ApiPage {

  public people: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {

     this.getApiData();

  }
  

   getApiData() {
		var response = this.http.get('https://randomuser.me/api/?results=10')
		.map(res => res.json())
		.subscribe(
		data => {
		this.people = data.results;
		alert(JSON.stringify(this.people));
		}, err => {
		alert(err);
		}
		);
    return response;
}

  

}
