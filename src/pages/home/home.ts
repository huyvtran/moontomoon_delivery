import { GooglePlus } from '@ionic-native/google-plus';
import { MetroServiceProvider } from './../../providers/metro-service/metro-service';
import { ViewRequestListPage } from './../view-request-list/view-request-list';
import { ViewRequestedAllPage } from './../view-requested-all/view-requested-all';
import { request } from './../../components/models/request';
import { LoginPage } from './../login/login';
import { EndPage } from './../end/end';
import { StartPage } from './../start/start';
import { Http,Headers ,RequestOptions} from '@angular/http';
import { Location } from './../../components/models/location';
import { MapDirective } from './../../components/map';
import { Observable, Subscription } from 'rxjs/Rx';
import { AngularFireDatabase ,FirebaseObjectObservable} from 'angularfire2/database';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { NavController, LoadingController, NavParams, ModalController, Platform } from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import firebase from 'firebase';
import {AutocompletePage} from './../start/autocomplete';
import { AngularFireAuth } from 'angularfire2/auth';
import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { TimeService } from './../../shared/time'
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[TimeService]
})

export class HomePage implements OnInit,OnChanges  {
  list: FirebaseObjectObservable<any[]>;
  location={} as Location
  request={} as request
  Destination:string;
  MyLocation:any;
  geoCode:boolean=false;
  isPickupRequested:boolean=false;
  start:string;
  address:any;
  destination:string;
  startLat:any;
  startLng:any;
  startLat2:any;
  startLng2:any;
  endLat:any;
  endLng:any;
  endLat2:any;
  endLng2:any;
  tokenId:string;
  activePage:any;
  public startPoint:string;
  @Input() test:any;
  public isactive:any;
  interval:any;
  endPoint:string;
  userId:string;
  requested:boolean=false;
  items:any;
  it:any;
  result=[];
  isToggled:boolean=false;
  pages: Array<{title:string,component:any,attr:any}>;
  requestedRoute=[];
  firestore=firebase.database().ref('/pushtokens');
  firemsg=firebase.database().ref('/messages');
  result_metro:any;
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  totalOrder=[];
  imageUrl:string;

  constructor(public m : MapDirective, public navCtrl: NavController,public navParam:NavParams ,public mapDirective:MapDirective, public modalCtrl:ModalController, public loading:LoadingController,  
    private geo:Geolocation,private afDatabase:AngularFireDatabase,public afAuth : AngularFireAuth,private googleplus:GooglePlus,public t:TimeService
  ,public metro: MetroServiceProvider,private oneSignal: OneSignal, public platform:Platform,private backgroundGeolocation: BackgroundGeolocation,public http:Http) {
    var id=localStorage.getItem("id");
    this.imageUrl=localStorage.getItem("foto");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }

    if(this.imageUrl==undefined){
      this.imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
    }
    this.afAuth.authState.subscribe(auth=>{
      if(auth!=null||auth!=undefined){
        localStorage.setItem("uid",auth.uid);
     }
       
     })
    this.it=this.afDatabase.list('/requestedList/requestedAll', { preserveSnapshot: true })
       this.it.subscribe(snapshots=>{
         snapshots.forEach(element => {
           
            var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
      
    var valuesFiltered = keysFiltered.map((item)=> {
          this.totalOrder.push(item);
          
         });
       })
       })

    var result_metro=this.metro.getMetro().subscribe(data=>{
      this.result_metro=data;
    });
    
  
    
 this.items=this.afDatabase.list('/requestedList/requested', { preserveSnapshot: true })
       this.items.subscribe(snapshots=>{
        snapshots.forEach(element => {
          this.requestedRoute.push({lat:element.val().startLat,lng:element.val().startLng},{lat:element.val().endLat,lng:element.val().endLng})
        });
    })

  
    // localStorage.setItem("lastname", "Smith");
    // alert(localStorage.getItem("lastname"));
    this.pages=[
        
        {title:'로그인',component:LoginPage,attr:"Login"},
        {title:'배달 목록 보기',component:ViewRequestListPage,attr:"request"},
        {title:'내 평가 확인',component:ViewRequestListPage,attr:"rating"},
        {title:'로그아웃',component:ViewRequestListPage,attr:"Logout"}
      ]
      this.activePage=this.pages[0];
    this.address = {
      place: ''
    };
   //this.startTracking();
  }
 
  viewRequestedAll(){
    this.navCtrl.push(ViewRequestedAllPage,{userId:this.userId})
  }
   openPage(page){
    if(page.attr=="Logout"){
      if(this.platform.is("android")){

        this.googleplus.logout();
        this.navCtrl.setRoot(LoginPage);
      }else{
        alert("not web")
      }
    }else{
      this.navCtrl.setRoot(page.component);
      this.activePage=page;
    }
    
  }
  checkActive(page){
    return page==this.activePage;
  }
  
 
  ionViewDidLoad(){
  //  window.addEventListener('native.keyboardshow', keyboardShowHandler);
  //   window.addEventListener('native.keyboardhide', keyboardHideHandler);


  }
  
  refresh(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component)
  }
  drag_second(trigger){
        var upper=document.getElementById("upper");
        console.log(upper);
        if(trigger){

        // upper.setAttribute('class','upper isactive');
        console.log("trigger true")
        }else{
          // upper.removeAttribute('class');
          // upper.setAttribute('class','upper');
          console.log("trigger false")
        }
    }
  startTracking(){
    //toggled to activate tracking location.
    let options={timeout:10000,maximumAge :10000,enableHighAccuracy:true}
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      this.location.lat=lat;
      this.location.lng=lng;
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
	    let today_today = yyyy+'/'+month+'/'+day+' '+time;
      this.location.create_date=today_today;
      this.location.isactive=true;
      this.location.userid=this.userId;
      
      if(this.isToggled){
        this.interval=setInterval(()=>{
          //기존 프로필 위경도 5초마다 업데이트
          var obj=this.afDatabase.list("employees_status/Available/"+this.userId);
          obj.subscribe(snapshots=>{
            snapshots.forEach((ele)=>{
              if(ele.key=="isactive"){
                if(ele.val()==true){
                }
              }
            })
          })
          this.list=this.afDatabase.object("employees_status/Available/"+this.userId);
          this.list.update({
            created_date:today_today,
            isactive: true,
             lat: lat,
             lng: lng,
             userid: this.userId
          })
          this.afDatabase.object("employees_status/AllUser/"+this.userId).set(this.location);
          this.afDatabase.list("employees_status/NotAvailable"+this.userId).remove()
        },5000)
    }else{
      //만약에 배달중이면 취소못하도록 해야함. 
      

      clearInterval(this.interval);
      this.interval.sto
      this.location.lat=0;
      this.location.lng=0;
      this.afDatabase.list("employees_status/AllUser/"+this.userId).remove()
      this.afDatabase.object("employees_status/AllUser/"+this.userId).set(this.location)
      this.afDatabase.object("employees_status/NotAvailable/"+this.userId).set(this.location)
      this.afDatabase.list("employees_status/Available/"+this.userId).remove()
    }
    }).catch((error =>{
      alert(error.code+","+error.message)
    }))
    

  }
  ngOnChanges() {
    console.log("change"+this.test);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add 'implements OnChanges' to the class.
    console.log("Homepage on change");
  }
  ngOnInit(){
    //this.calculateAndDisplayRoute();
    
  }
  cancelPickUp(){
    this.isPickupRequested=false;
  }
  confirmPickUp(){
    this.isPickupRequested=true;
  }
  getGeoCoding(){
    this.geoCode=true;
  }


}

































