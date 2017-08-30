import { CarProvider } from './../providers/car/car';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, LoadingController } from 'ionic-angular';
declare var google;


@Component({
   selector: 'pickup',
  templateUrl: 'pickup.html',
    providers:[CarProvider]
})
export class PickupDirective   {
    @Input() isPinSet:boolean;
    @Input() map:any;
    @Input() refreshing:any;
    @Output() updatedPickupLocation : EventEmitter<any>=new EventEmitter();
    @Output() dragging : EventEmitter<any>=new EventEmitter();
    private pickupMarker: any;
    private popup:any;
    public isactive:any;
    constructor(){
         console.log("PickupDirective")
    }
   
}