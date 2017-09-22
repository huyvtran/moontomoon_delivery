import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BigpicturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bigpicture',
  templateUrl: 'bigpicture.html',
})
export class BigpicturePage {
  image:any;
  constructor(public viewCtrl:ViewController,public navCtrl: NavController, public navParams: NavParams) {
    this.image=this.navParams.get("image")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BigpicturePage');
  }
  confirm(){
    this.viewCtrl.dismiss();
  }

}
