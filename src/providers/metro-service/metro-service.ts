import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MetroServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MetroServiceProvider {

  constructor(public http: Http) {

    console.log('Hello MetroServiceProvider Provider');
  }

  getMetro():Observable<any> {
    console.log(this.http.get('assets/metroLocation.json'))
     return this.http.get('assets/metroLocation.json').map(data=>{
       console.log("mock data");
        console.log(data.json().DATA);
        return data.json().DATA
     })
     
  
       
  }

}
