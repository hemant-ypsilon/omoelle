import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MerchantproductlistPage } from './merchantproductlist';

@NgModule({
  declarations: [
    MerchantproductlistPage,
  ],
  imports: [
    IonicPageModule.forChild(MerchantproductlistPage),
  ],
  exports: [
    MerchantproductlistPage
  ]
})
export class MerchantproductlistPageModule {}
