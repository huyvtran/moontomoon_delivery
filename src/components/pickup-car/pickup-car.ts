import { CarProvider } from './../../providers/car/car';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
declare var google;
@Component({
    selector: 'pickup-car',
    templateUrl: 'pickup-car.html'
})
export class PickupCar {
    @Input() map:any;
    @Input() isPickupRequested:boolean;
    @Input() pickupLocation:any;

    public pickupCarMarker:any;
    public polylinePath:any;
    constructor(public carService : CarProvider){

    }
    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        
    }
    ngOnChanges() {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add 'implements OnChanges' to the class.
        //alert("changed"+this.isPickupRequested);
       if(this.isPickupRequested){
           //request car
           this.requestCar();
       }else{
           //remove / cancel car
           this.removeCar();
       }
    }
    addCarMarker(position){
        console.log("addCarMarker")
         console.log(position);
       
    }
    showDirection(path){
        console.log("showDirection")
        console.log(path);
        this.polylinePath=new google.maps.Polyline({
            path:path,
            strokeColor:'#FF0000',
            strokeWeight:3
        })
        this.polylinePath.setMap(this.map);
    }

    updateCar(){
        console.log("updateCar!!!???");
        this.carService.getPickupCar().subscribe(car=>{
            this.pickupCarMarker.setPosition(car.position);
            this.polylinePath.setPath(car.path);
            console.log("path length : "+car.path)
            if(car.path.length>1){
                setTimeout(()=>{
                    this.updateCar();
                },1000)
            }else{
                console.log("arrave")
            }
        })
    }
    requestCar(){
        console.log('request car '+this.pickupLocation);
        this.carService.findPickupCar(this.pickupLocation)
        .subscribe(car=>{
            this.addCarMarker(car.position);
            this.showDirection(car.path);
            //show car marker and path keep updating car
            this.updateCar();
        })
        //this.carService.findPickupCar(this.pickupLocation)
    }
    removeCar(){

    }
}