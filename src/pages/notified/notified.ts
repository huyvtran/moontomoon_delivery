import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NotifiedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-notified',
  templateUrl: 'notified.html',
})
export class NotifiedPage {
  value:any;
  constructor(public navCtrl: NavController,public viewCtrl:ViewController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.value = this.navParams.get('name');
    if(this.value==undefined||this.value==null){
      this.value="haha"
    }
  }

  goBack(){
      this.viewCtrl.dismiss();
  }

}
