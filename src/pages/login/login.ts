import { Profile_User } from './../../components/models/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { PhoneNumber } from './../../components/models/phonenumber';
import { ProfilePage } from './../../pages/profile/profile';
import { User } from './../../components/models/user';
import { SignupPage } from './../signup/signup';
import { HomePage } from './../../pages/home/home';
import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController,NavController, NavParams, ToastController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule} from 'angularfire2';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/map';
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import { UniqueDeviceID } from '@ionic-native/unique-device-id';



/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginflag:any;
  status:any;
  client_id="803c650d8d5a94925867774666d3e0b7";
  redirect_uri="http://localhost/";
  thingToUnsubscribeFromLater: Subscription = new Subscription();
  windowRef:any;
  profile={} as Profile_User;
  user={} as User;
  items : any;
  phoneNumber = new PhoneNumber()
  checked:boolean=false;
  verificationCode: string;
  tokenId:string;
  users: any;
  requestToken:any;
  count:number=0;
  todayWithTime:any;
  statusParam:any;
  name:any;
  flag:boolean=false;
  distance:any;
  foto:any;
  constructor(private uniqueDeviceID: UniqueDeviceID,public http:Http,public loading:LoadingController,public toast:ToastController, public afAuth : AngularFireAuth,public afDatabase:AngularFireDatabase, public navCtrl: NavController,public googleplus:GooglePlus,public afauth:AngularFireAuth,public afd:AngularFireDatabase) {
    let today = new Date();
    let dd:number;
    let day:string;
    let month:string;
    
     dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
   var time=new Date().toLocaleTimeString('kr-KR', { hour12: true,hour: "numeric",minute: "numeric",second:"numeric"});
   
    dd<10?day='0'+dd:day=''+dd;
    mm<10?month='0'+mm:month=''+mm;
    this.todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
    console.log(time);
    
    this.loginflag=localStorage.getItem("googleLoggedIn")
  }
  ionViewDidLoad(){
// notification:value.status,notificationValue:value.name
        if(this.loginflag=="true"){
          this.status="loggedin"
          this.googleLogin();
        }else if(this.loginflag=="false"){
          this.status="nologgedin"
        }
  }
  guestLogin(){
    this.uniqueDeviceID.get()
    .then((uuid: any) => {
      this.items=this.afDatabase.list('profile/'+uuid, { preserveSnapshot: true })
      this.thingToUnsubscribeFromLater=this.items.subscribe(snapshots=>{
        
        if(snapshots.length==0){
          this.profile.id=uuid;
          this.profile.type="guest";
          this.profile.uid=uuid;
          this.profile.created_date=this.todayWithTime;
          this.afDatabase.object('profile/'+uuid+'/').set(this.profile)
          this.thingToUnsubscribeFromLater.unsubscribe();
        }else{
          
          var list=this.afDatabase.object('profile/'+uuid+'/');
          list.update({
            lastLogin:this.todayWithTime
          })

          localStorage.setItem("id",uuid);
          localStorage.setItem("uid",uuid);
          localStorage.setItem("tokenId",null);
          localStorage.setItem("email", null);
          localStorage.setItem("foto",null);
          this.navCtrl.setRoot(HomePage);
          this.thingToUnsubscribeFromLater.unsubscribe();
        }
      })
      
      
    })
  
    .catch((error: any) => console.log(error));


  }
  
  ngOnInit(){
    // this.googleplus.trySilentLogin()
    // this.googleplus.login({
    //   'webClientId':'916589339698-n71c3mmpsclus88rk6fp99la7sh0vnga.apps.googleusercontent.com'
    // }).then((res)=>{
    //   alert(res)
    //   this.status=res;
    // })
    
    
    
  }
 
  verifyLoginCode(){
    this.windowRef.confirmationResult.confirm(this.verificationCode).then(result=>{
      console.log("result success");
      console.log(result);
      console.log(result.user);
    })
  }
  
    async login(user:User){
    try{
      
      // const result=await this.afauth.auth.signInWithPhoneNumber(user.phone)
      // console.log(result);
      // if(result){
      //   this.navCtrl.setRoot(HomePage)

      // }else{
      //   console.log(result.message);
      // }
    }catch(e){
      alert("no user found")
    }
    }

  //   this.http.post("https://kauth.kakao.com/oauth/token",{params:"grant_type=authorization_code"+"&client_id=" + this.client_id + "&redirect_uri="+this.redirect_uri+"&code="+requestToken},options).toPromise().then((res)=>{
  //     console.log(res.json())
  //     alert("success")
  // }).catch((error)=>{
  // })
    kakaoLogin(){
      let headers = new Headers({ 'Content-Type': 'application/x-www-urlencoded' });
           let options = new RequestOptions({ headers: headers });
      var ref = window.open('https://kauth.kakao.com/oauth/authorize?client_id='+this.client_id+'&redirect_uri='+this.redirect_uri+'&response_type=code', '_blank', 'location=no');
      ref.addEventListener('loadstart', (event: InAppBrowserEvent) =>{ 
          if((event.url).startsWith("http://localhost/")) {
              var requestToken = (event.url).split("code=")[1];
              this.http.post("https://kauth.kakao.com/oauth/token",{params:"grant_type=authorization_code"+"&client_id=" + this.client_id + "&redirect_uri="+this.redirect_uri+"&code="+requestToken},options).toPromise().then((res)=>{
                console.log(res.json())
                alert(res);
              }).catch((error)=>{
                alert(error);
              })
              ref.close();
          }
      });
    }

    logout(){
      this.googleplus.disconnect();
      }
    logout2(){
      this.googleplus.logout();
      
    }
  googleLogin(){
    
    this.googleplus.login({
      'webClientId':'916589339698-n71c3mmpsclus88rk6fp99la7sh0vnga.apps.googleusercontent.com'
    }).then((res)=>{
      localStorage.setItem('googleLoggedIn',"true");
     
      let loading=this.loading.create({
        content:'Loading...22'
      })
      loading.present().then(()=>{
      })
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(
        suc=>{
          this.afAuth.authState.subscribe(auth=>{


            loading.dismiss();
            localStorage.setItem("uid",auth.uid);
            localStorage.setItem("tokenId",this.tokenId);
            localStorage.setItem("email", res.email.split("@")[0]);
            localStorage.setItem("foto",res.imageUrl);
            this.items=this.afDatabase.list('profile/'+auth.uid, { preserveSnapshot: true })
            this.thingToUnsubscribeFromLater=this.items.subscribe(snapshots=>{
              
              if(snapshots.length==0){
                this.profile.first=false;
                this.profile.id="null";
                this.profile.created_date="null";
                this.profile.foto="null";
                this.profile.notiId="";
                this.profile.uid="";
                this.profile.email="";
                this.thingToUnsubscribeFromLater.unsubscribe();
                this.afDatabase.object('profile/'+auth.uid+'/').set(this.profile)
                .then(() => {  this.navCtrl.setRoot(ProfilePage,{uid:auth.uid,tokenId:this.tokenId,email:res.email});   } ).catch((error)=> alert("err : "+error))
              }else{
                snapshots.forEach(ele=>{
                  if(ele.key=="id"){
                    if(ele.val()=="null"){
                      this.items.unsubscribe
                      this.navCtrl.setRoot(ProfilePage,{uid:auth.uid,tokenId:this.tokenId,email:res.email})
                    }else{
                      localStorage.setItem("id",ele.val())
                      
                    }
                  }

                  if(ele.key=="phone"){
                    
                      localStorage.setItem("phone",ele.val())
                      var list=this.afDatabase.object('profile/'+auth.uid+'/');
                      list.update({
                        lastLogin:this.todayWithTime
                      })
                      this.thingToUnsubscribeFromLater.unsubscribe();
                      this.navCtrl.setRoot(HomePage,{notification:this.statusParam,notificationValue:this.name,foto:this.foto,distance:this.distance});
                  }
                  

                })
                
                
              }
            })
          })
        }).catch((error)=>{
          alert(error);
          this.status=error
        })
      }).catch((error)=>{
        alert(error);
        this.status=error
      })
   
    
    
    }
            

  
}
