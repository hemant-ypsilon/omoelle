import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PeopleService {

  perpage:number = 10;
  
  constructor(public http: Http) {}

  load(start:number=0, id) {
      
     return  this.http.get('http://omoelle.com/recordfproduct.php?limit='+this.perpage+'&start='+start+'&catId='+id)
        .map(res => res.json());
        
  }
}
