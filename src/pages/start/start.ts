import { HomePage } from './../home/home';
import { Component,Output } from '@angular/core';
import { NgZone  } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
declare var google;
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})

export class StartPage {
  autocompleteItems;
  autocomplete;
  loc:any;
  service = new google.maps.places.AutocompleteService();
  location=new google.maps.Geocoder();
  position:any;
  constructor (public navCtrl: NavController, public viewCtrl: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
  
  dismiss() {
  }
  goBack(){
    this.viewCtrl.dismiss();
  }
  chooseItem(item: any) {
    var lat;
    var lng;
    this.location.geocode({'address': item.short}, (results, status)=> {
          if (status === 'OK') {
              this.loc=results[0].geometry.location
              this.viewCtrl.dismiss({loc:item.short,lat:this.loc.lat(),lng:this.loc.lng(),long:item.long});
            
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query,  componentRestrictions: {country: 'Kr'} }, function (predictions, status) {
      console.log(predictions);
      console.log(status);
      console.log("getttttttt");
      me.autocompleteItems = []; 
      me.zone.run(function () {
        if(predictions!=null){
          predictions.forEach(function (prediction) {
          me.autocompleteItems.push({short:prediction.description.substring(10), long:prediction.description});
        });
        }else{
          console.log("prediction == null"+predictions);
        }
        
      });
    });
  }
}