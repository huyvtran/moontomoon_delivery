import { User } from './../../components/models/user';
import { ProfilePage } from './../profile/profile';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
  import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {


  user={} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afauth:AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  register(user:User){

    this.afauth.auth.createUserWithEmailAndPassword(this.user.email,this.user.password).then((data)=>{
      console.log(data)
    this.navCtrl.setRoot(ProfilePage,{google:false});
    }).catch((error)=>{
      alert(error);
    })
    
  }
}
