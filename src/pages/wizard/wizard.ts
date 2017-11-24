import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Events, Loading, LoadingController, ToastController, NavController} from 'ionic-angular';
import { WizardAnimations } from '../../pages/ion-simple-wizard/ion-simple-wizard-animations';

import {HomePage} from '../../pages/home/home';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the WizardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-wizard',
  templateUrl: 'wizard.html',
  animations: WizardAnimations.btnRotate,
  providers: [Keyboard]
})
export class WizardPage {

  @Input() finishIcon = 'send';//Default
  @Input() showSteps: boolean=true;//Default
  @Input() step = 1;//Default
  @Output() finish = new EventEmitter();
  @Output() stepChange = new EventEmitter();
  public steps = 0;//Innitial
  public hideWizard = false;//Default
  @Input() stepCondition = true;//Default


  stepDefaultCondition: any;
  currentStep: any;
  name : any;
  rc : any;
  business : any;
  address : any;
  error : any;



  loading: Loading;
  HaveMerchant : any;
  id : any;

  nature1 = [];
  nature2 = [];
  nature3 = [];

  infrastructures1 =[];
  infrastructures2 =[];

  customerspay1 = [];
  customerspay2 = [];

  website1 = [];
  website2 = [];

  discount1 = [];
  discount2 = [];

  return1 = [];
  return2 = [];

  productData = [];

  bankData = [];

  i : number;

  productlist = [];
  banklist = [];


   merchant = {user_id : '',ContactPerson : '', Secondary_Contact_Person : '', RC_Number : '', BusinessName : '', RegisteredAddress : '', Other_Address : '', gender : '', city : '', Website : '', email : '', PhoneNumber : '', Mobile : '', Secondary_Designation : '', Secondary_Email : '', Secondary_Phone : '', nature_of_business : '', model_of_business : '', distribution_all_over_Nigeria : '', distinguishing_description : '', service_offer : '', business_registered : '', business_registered_if_yes : '', is_internet_connection : '', information_technology_infrastructures : '' , customers_pay : '', have_a_website : '', visit_site_monthly : '', names_of_bank : '', discount_offer : '', inform_us : '', immediately_priority_to_clients : '', immediately_priority_if_yes : '', give_assurance : '', give_assurance_if_yes : '', ReturnPolicy : '', same_day_delivery : '', attend_seminar : '', promotional_materials : '', other_model_of_business : '', other_nature_of_business : '',};


  constructor(public evts: Events, public keyboard: Keyboard, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: Http, public navCtrl: NavController) {


    this.stepDefaultCondition = this.stepCondition;

     this.evts.subscribe('step:changed', step => {
        //Handle the current step if you need
        this.currentStep = step[0];
        //Set the step condition to the default value
        this.stepCondition = this.stepDefaultCondition;
      });

      this.evts.subscribe('step:next', () => {
        //Do something if next
        console.log('Next pressed: ', this.currentStep);
      });

      this.evts.subscribe('step:back', () => {
          //Do something if back
          console.log('Back pressed: ', this.currentStep);
    });



      this.nature1 = [{ 'name' : 'Cosmetics', 'checked' : false},{ 'name' : 'Health', 'checked' : false},{ 'name' : 'Hair', 'checked' : false},{ 'name' : 'Body & Skincare Products', 'checked' : false},{ 'name' : 'Bags', 'checked' : false},{ 'name' : 'Shoe', 'checked' : false},{ 'name' : 'Wellbeing', 'checked' : false},{ 'name' : 'Jewelleries', 'checked' : false}];

      this.infrastructures1 = [{ 'name' : 'Smart phone', 'checked' : false},{ 'name' : 'Laptop', 'checked' : false},{ 'name' : 'Computer', 'checked' : false},{ 'name' : 'Tablet', 'checked' : false}];

       this.customerspay1 = [{ 'name' : 'Cash Sales', 'checked' : false},{ 'name' : 'Cheque', 'checked' : false},{ 'name' : 'Point of Sale Terminal', 'checked' : false},{ 'name' : 'Internet Payment System', 'checked' : false}];

       this.website1 = [{ 'name' : 'Corporate Web Address and Presence', 'checked' : false},{ 'name' : 'Combination of both', 'checked' : false},{ 'name' : 'Social Network', 'checked' : false},{ 'name' : 'None', 'checked' : false}];

       this.discount1 = [{ 'name' : 'Corporate Web Address and Presence', 'checked' : false},{ 'name' : 'Combination of both', 'checked' : false},{ 'name' : 'Social Network', 'checked' : false},{ 'name' : 'None', 'checked' : false}];

        this.return1 = [{ 'name' : 'Not Aplicable', 'checked' : false},{ 'name' : 'Return immediately', 'checked' : false},{ 'name' : 'Exchange', 'checked' : false},{ 'name' : 'Less than 3 day', 'checked' : false}];

        

        if((localStorage.getItem('isUserHaveMerchant') === "undefined" || localStorage.getItem('isUserHaveMerchant') === null) ) {
             this.HaveMerchant = 0;
          } else {
             this.HaveMerchant = 1;
      }

      this.productlist = [{ 'name' : ''},{ 'name' : ''},{ 'name' : ''},{ 'name' : ''},{ 'name' : ''},{ 'name' : ''}];

      this.banklist = [{ 'name' : ''},{ 'name' : ''},{ 'name' : ''},{ 'name' : ''}];


         if(localStorage.getItem("isUserHaveMerchant") == '1'){
            this.getMerchantDetail();
        }


       this.name = 0;
       this.rc = 0;
       this.business = 0;
       this.address = 0;
       this.error = 1;




     
  }






  textChange(e, name) {

      if (e.target.value && e.target.value.trim() !== '' && name == 'name') {
         this.name = 1;
         this.error = 1;
      }else if (e.target.value && e.target.value.trim() !== '' && name == 'rc') {
        this.rc = 1;
        this.error = 1;
      } else if (e.target.value && e.target.value.trim() !== '' && name == 'business') {
        this.business = 1;
        this.error = 1;
      } else if (e.target.value && e.target.value.trim() !== '' && name == 'address') {
        this.address = 1;
        this.error = 1;
      } else {
        this.error = 0;
      }


      console.log(" name " + this.name);
       console.log(" rc " + this.rc);
        console.log(" address " + this.address);
         console.log(" business " + this.business);

     if(this.name == 1 && this.rc == 1 && this.business == 1 && this.address == 1 && this.error == 1){
        console.log('insite true'); 
        this.stepCondition = true;
     }else{
     console.log('insite false'); 
       this.stepCondition = false;
     }

  }


    getMerchantDetail(){

      this.loading = this.loadingCtrl.create({
          content: '',
      });

      this.loading.present();

       // for local : -  /GetAccountDetail
      // for server : -  http://omoelle.com/getmerchantdetail.php

       this.id = localStorage.getItem("userId");

       this.http.get('http://omoelle.com/getmerchantdetail.php?Id='+this.id)
      .map(res => res.json())
      .subscribe(
      data => {
        this.merchant = data.data;


          // for service_offer
          this.productData = data.data.service_offer.split(',');
          for (this.i = 0; this.i < 6; this.i++) {

            if(this.productData[this.i]!= undefined || this.productData[this.i] != ''){
                
                this.productlist[this.i].name = this.productData[this.i];
              }else{

                 this.productlist[this.i].val = '';
              }

          }


          // for bank list
          this.bankData = data.data.names_of_bank.split(',');
          for (this.i = 0; this.i < 4; this.i++) {

            if(this.bankData[this.i]!= undefined || this.bankData[this.i] != ''){
                
                this.banklist[this.i].name = this.bankData[this.i];
              }else{

                 this.banklist[this.i].val = '';
              }

          }




        // for nature
        this.nature2 = data.data.nature_of_business.split(',');
        for (this.i = 0; this.i < this.nature1.length; this.i++) {

             if(this.nature2.indexOf(this.nature1[this.i].name) !== -1) {
                 console.log(this.nature1[this.i].name);

                 this.nature1[this.i].checked = true;
              }

          }

        //  infrastructures
        this.infrastructures2 = data.data.information_technology_infrastructures.split(',');

        for (this.i = 0; this.i < this.infrastructures1.length; this.i++) {

             if(this.infrastructures2.indexOf(this.infrastructures1[this.i].name) !== -1) {
                 this.infrastructures1[this.i].checked = true;
              }

          }


        // customerspay
        this.customerspay2 = data.data.customers_pay.split(',');
        for (this.i = 0; this.i < this.customerspay1.length; this.i++) {

             if(this.customerspay2.indexOf(this.customerspay1[this.i].name) !== -1) {
                 this.customerspay1[this.i].checked = true;
              }

          }

        // website
        this.website2 = data.data.have_a_website.split(',');
        for (this.i = 0; this.i < this.website1.length; this.i++) {

             if(this.website2.indexOf(this.website1[this.i].name) !== -1) {
                 this.website1[this.i].checked = true;
              }

          }

        // discount1
        this.discount2 = data.data.discount_offer.split(',');
        for (this.i = 0; this.i < this.discount1.length; this.i++) {

             if(this.discount2.indexOf(this.discount1[this.i].name) !== -1) {
                 this.discount1[this.i].checked = true;
              }

          }

        // return
        this.return2 = data.data.return_policy.split(',');
        for (this.i = 0; this.i < this.return1.length; this.i++) {

             if(this.return2.indexOf(this.return1[this.i].name) !== -1) {
                 this.return1[this.i].checked = true;
              }

        }

        this.loading.dismissAll();
      }, err => {
         alert(err);
       }
     );

   }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WizardPage');
  }

    updateNature(chBox, event) {
        var cbIdx = this.nature2.indexOf(chBox);

        if(event.target.checked) {
          if(cbIdx < 0 ){
               this.nature2.push(chBox);
               console.log(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.nature2.splice(cbIdx,1);
              console.log(cbIdx);
          }
        }
    }

    updateInfra(chBox, event) {
        var cbIdx = this.infrastructures2.indexOf(chBox);

        if(event.target.checked) {
          if(cbIdx < 0 ){
               this.infrastructures2.push(chBox);
             console.log(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.infrastructures2.splice(cbIdx,1);
              console.log(cbIdx);
          }
        }
    }

    updateCustomer(chBox, event) {
        var cbIdx = this.customerspay2.indexOf(chBox);

        if(event.target.checked) {
          if(cbIdx < 0 ){
               this.customerspay2.push(chBox);
             console.log(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.customerspay2.splice(cbIdx,1);
              console.log(cbIdx);
          }
        }
    }


    updateWebsite(chBox, event) {
        var cbIdx = this.website2.indexOf(chBox);

        if(event.target.checked) {
          if(cbIdx < 0 ){
               this.website2.push(chBox);
             console.log(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.website2.splice(cbIdx,1);
              console.log(cbIdx);
          }
        }
    }

  updateDiscount(chBox, event) {
        var cbIdx = this.discount2.indexOf(chBox);

        if(event.target.checked) {
          if(cbIdx < 0 ){
               this.discount2.push(chBox);
             console.log(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.discount2.splice(cbIdx,1);
              console.log(cbIdx);
          }
        }
    }


     updateReturn(chBox, event) {
        var cbIdx = this.return2.indexOf(chBox);

        if(event.target.checked) {
          if(cbIdx < 0 ){
               this.return2.push(chBox);
             console.log(chBox);
          }
        } else {
          if(cbIdx >= 0 ){
             this.return2.splice(cbIdx,1);
              console.log(cbIdx);
          }
        }
    }

    service_offer(value : string) {
       this.productData.push(value);
    }

    bank_change(value : string) {
       this.bankData.push(value);
    }



  ngOnInit() {
    /**
     * Hide the wizard buttons when the keyboard is open
     */
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.hideWizard = true;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.hideWizard = false;
    })
  }

  /**
   * @return {number} New Steps
   */
  public addStep() {
    const newSteps = this.steps + 1;
    this.steps = newSteps;
    return newSteps;
  }

  /**
   * @return {boolean} true if is the final step
   */


  isOnFinalStep() {

    if(localStorage.getItem("isOnline") == '0'){

      alert('Please check internet connection');
      
    }else{
   
    this.loading = this.loadingCtrl.create({
      content: '',
    });

    this.loading.present();

    this.merchant.names_of_bank = this.bankData.toString()

    this.merchant.service_offer = this.productData.toString()

    this.merchant.nature_of_business = this.nature2.toString()

    this.merchant.information_technology_infrastructures = this.infrastructures2.toString()

    this.merchant.customers_pay = this.customerspay2.toString()

    this.merchant.have_a_website = this.website2.toString()

    this.merchant.discount_offer = this.discount2.toString()

    this.merchant.ReturnPolicy = this.return2.toString()

    this.merchant.user_id = localStorage.getItem("userId");


    let data = JSON.stringify(this.merchant);

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers })


    // for local : -  /AddToCart
    // for server : -  http://omoelle.com/createMerchant.php
     
     this.http.post("http://omoelle.com/createMerchant.php",data,options)
   
      .map(res => res.json())

      .subscribe(data => {

       this.loading.dismissAll();

       console.log(JSON.stringify(data));

       if(data.status == 1){

          localStorage.setItem("isUserHaveMerchant", '1')
          this.evts.publish('isMerchant', 1);
          this.HaveMerchant = 1;

          let toast = this.toastCtrl.create({
            message: data.message,
            duration: 2000,
             position: 'top'
          });

         this.merchant = data.data;
         toast.present();
         this.navCtrl.setRoot(HomePage);

        }else{

              let toast = this.toastCtrl.create({
                message: data.message,
                duration: 2000,
                 position: 'top'
              });

             toast.present();

           }

           }, error => {

           console.log(error);
           
       });


    }

   // alert(JSON.stringify(this.merchant.customers_pay));
  //  return this.step === 16;
  }

  /**
   * @return {boolean} the current step condition
   */
  getCondition() {
    return this.stepCondition;
  }


  /**
   * @return {boolean} true if the the step is the first 
   */
  isOnFirstStep() {
    return this.step === 1;
  }
  /**
   * @method back button event and emit Event Called 'step:back'
   */
  back() {
    this.stepChange.emit(this.step - 1);
    this.evts.publish('step:back'); 
  }
  /**
   * @method next button event and emit  Event Called 'step:next'
   */
  next() {
    this.stepChange.emit(this.step + 1);
    this.evts.publish('step:next');
  }


}
