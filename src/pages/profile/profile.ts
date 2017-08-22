import { Profile_User } from './../../components/models/profile';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from './../home/home';
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
   profile={} as Profile_User
  google:boolean;
  items:any;
  foto:string;
  today:string;
  result:string;
  start:boolean;
  dup:boolean=false;
  nodup:boolean=false;
  uid:string;
  tokenId:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase) {
    this.start=true;
    this.uid=this.navParams.get("uid");
    this.tokenId=this.navParams.get("tokenId")
    alert(this.uid+","+this.tokenId)
      //  this.profile.foto="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
      //  this.profile.first=true;
  }
  dupulicate(){
    this.dup=false;
    this.nodup=false;
    this.start=false;
    this.afAuth.authState.subscribe(auth=>{
      this.items=this.afDatabase.list('profile/', { preserveSnapshot: true })
      this.items.subscribe(snapshots=>{
        snapshots.forEach(element => {
          console.log("element")

          var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
          
         var valuesFiltered = keysFiltered.map((item)=> {
             console.log(item);
             console.log(element.val()[item]);
             if(item=="id"){
              if(element.val()[item]==this.profile.id){
                this.result="중복된아이디입니다";
                this.dup=true;
              }else{
                this.nodup=true;
                this.result="사용가능"
              }
             }
             
          
         });
        

        });
      })

    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  createProfile(){
    this.profile.first=true;
    this.afAuth.authState.subscribe(auth=>{
      let today = new Date();
      let dd:number;
      let day:string;
      let month:string;
       dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
     var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
      dd<10?day='0'+dd:day=''+dd;
      mm<10?month='0'+mm:month=''+mm;
      let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;

      this.profile.uid=this.uid;
      this.profile.notiId=this.tokenId;
      this.profile.created_date=todayWithTime
      this.profile.foto=localStorage.getItem("foto");
      this.afDatabase.object('profile/'+auth.uid+'/').set(this.profile)
      this.navCtrl.setRoot(HomePage);
    })
  }
}
