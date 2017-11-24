import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MerchantproductdetailPage } from './merchantproductdetail';

@NgModule({
  declarations: [
    MerchantproductdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MerchantproductdetailPage),
  ],
  exports: [
    MerchantproductdetailPage
  ]
})
export class MerchantproductdetailPageModule {}
