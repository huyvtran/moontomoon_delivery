import { AngularFireDatabase } from 'angularfire2/database';
import { SimulateProvider } from './../simulate/simulate';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CarProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CarProvider {
  public simulate:SimulateProvider;
  constructor(public fb:AngularFireDatabase) {
    console.log('Hello CarProvider Provider');
    this.simulate=new SimulateProvider(this.fb);
  }
  getPickupCar(){
    return this.simulate.getPickupCar();
  }
  getCars(lat,lng){
    return Observable
      .interval(5000)
      .switchMap(()=>
      this.simulate.getCars(lat,lng))
      .share();
  }
  findPickupCar(pickupLocation){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(pickupLocation+"findPcikup");
    return this.simulate.findPickupCar(pickupLocation);
  }
}
