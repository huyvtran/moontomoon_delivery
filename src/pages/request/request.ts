import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController, AlertController,NavParams,ViewController } from 'ionic-angular';
import { request } from './../../components/models/request';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the RequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
  
  request={} as request
  start:any;
  end:any;
  orderNo:any;
  request_text:any;
  constructor(public toast:ToastController, private dialog:AlertController,
    public afDatabase:AngularFireDatabase,public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.request=this.navParams.get('object');
    this.start=this.request.startPoint;
    this.end=this.request.endPoint;
    this.orderNo=this.request.orderNo;
    this.request_text=this.request.request_text;
    console.log(this.request);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestPage');
  }
  confirm(){
      this.afDatabase.object('/requestedList/assigned/'+this.request.orderNo).set(this.request);
      this.afDatabase.object('/requestedList/requestedAll/'+this.request.orderNo).set(this.request);
      this.afDatabase.object('/requestedList/requested/'+this.request.orderNo).remove();
      
      

      this.viewCtrl.dismiss();
      
  }
  cancel(){
    this.viewCtrl.dismiss();
    
  }

}
