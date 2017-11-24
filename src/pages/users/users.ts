import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { User } from '../../models/user';

import {  GithubUsers } from '../../providers/github-users';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersPage {
  users: any;

  constructor(public navCtrl: NavController, private githubUsers: GithubUsers) {
    githubUsers.load().subscribe(users => {
    	this.users = users;
      	console.log(users)
    })
  }


    doInfinite(infiniteScroll) {
		    console.log('Begin async operation');

		    setTimeout(() => {
		      this.githubUsers.load().subscribe(
		        (res) => {
		          for (let user of res) {
		            this.users.push(user)
		          }
		        }
		      )

		      console.log('Async operation has ended');
		      infiniteScroll.complete();
		    }, 1000)
    }


}
