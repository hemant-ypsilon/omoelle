import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { InAppBrowser} from '@ionic-native/in-app-browser'
import { EmailComposer } from '@ionic-native/email-composer';
import {  PeopleService } from '../providers/random-user';

import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SubcategoryPage } from '../pages/subcategory/subcategory';
import { ForgotpassPage } from '../pages/forgotpass/forgotpass';
import { ProductlistPage } from '../pages/productlist/productlist';
import { MycartPage } from '../pages/my_cart/my_cart';
import { SignupPage } from '../pages/signup/signup';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiPage } from '../pages/api/api';
import { HelpsupportPage } from '../pages/helpsupport/helpsupport';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { ProductdetailPage } from '../pages/product_detail/product_detail';
import { GithubUsers } from '../providers/github-users';
import { UsersPage } from '../pages/users/users';
import { Payment_modePage } from '../pages/payment_mode/payment_mode';

import { WizardPage } from '../pages/wizard/wizard';
import { AddproductPage } from '../pages/addproduct/addproduct';

import {IonSimpleWizard} from '../pages/ion-simple-wizard/ion-simple-wizard.component';

import {IonSimpleWizardStep} from '../pages/ion-simple-wizard/ion-simple-wizard.step.component';

import { MerchantproductlistPage } from '../pages/merchantproductlist/merchantproductlist';
import { MerchantproductdetailPage } from '../pages/merchantproductdetail/merchantproductdetail';

import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { OrderHistoryDetailsPage } from '../pages/order_history_details/order_history_details';
import { OrderstatusPage } from '../pages/orderstatus/orderstatus';
import { TermsAndConditionPage } from '../pages/terms-and-condition/terms-and-condition';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { MyaccountPage } from '../pages/myaccount/myaccount';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SubcategoryPage,
    ForgotpassPage,
    ProductlistPage,
    MycartPage,
    SignupPage,
    ApiPage,
    ProductdetailPage,
    UsersPage,
    HelpsupportPage,
    AboutusPage,
    Payment_modePage,
    IonSimpleWizard,
    IonSimpleWizardStep,
    WizardPage,
    AddproductPage,
    MerchantproductlistPage,
    MerchantproductdetailPage,
    OrderDetailPage,
    OrderHistoryDetailsPage,
    OrderstatusPage,
    TermsAndConditionPage,
    MyaccountPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule, CustomFormsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SubcategoryPage,
    ForgotpassPage,
    ProductlistPage,
    MycartPage,
    SignupPage,
    ApiPage,
    ProductdetailPage,
    UsersPage,
    HelpsupportPage,
    AboutusPage,
    Payment_modePage,
    WizardPage,
    AddproductPage,
    MerchantproductlistPage,
    MerchantproductdetailPage,
    OrderDetailPage,
    OrderHistoryDetailsPage,
    OrderstatusPage,
    TermsAndConditionPage,
    MyaccountPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GithubUsers,
    Network,
    InAppBrowser,
    EmailComposer,
    Transfer,Camera,File,FilePath,LocationAccuracy,PeopleService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
