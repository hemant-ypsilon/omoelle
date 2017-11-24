import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderstatusPage } from './orderstatus';

@NgModule({
  declarations: [
    OrderstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderstatusPage),
  ],
  exports: [
    OrderstatusPage
  ]
})
export class OrderstatusPageModule {}
