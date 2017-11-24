import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountinfoPage } from './account_info';

@NgModule({
  declarations: [
    AccountinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountinfoPage),
  ],
  exports: [
    AccountinfoPage
  ]
})

export class AccountinfoPageModule {}
