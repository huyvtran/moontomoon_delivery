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
import { NavController, LoadingController, NavParams, ModalController, Platform ,ToastController} from 'ionic-angular';
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
  showOrNot:boolean=true;
  thingToUnsubscribeFromLater: Subscription = new Subscription();
  myCurrentlat:any;
  myCurrentlng:any;
  viewStyle_map:boolean=true;
  viewStyle_list:boolean=true;
  showheartIconRead:boolean=true;
  viewSetting:any;
  distanceSetting:any;
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
  delivering:boolean=false;
  result_date=[];
  changed2:boolean=false;
  constructor(public toast: ToastController,public m : MapDirective, public navCtrl: NavController,public navParam:NavParams ,public mapDirective:MapDirective, public modalCtrl:ModalController, public loading:LoadingController,  
    private geo:Geolocation,private afDatabase:AngularFireDatabase,public afAuth : AngularFireAuth,private googleplus:GooglePlus,public t:TimeService
  ,public metro: MetroServiceProvider,private oneSignal: OneSignal, public platform:Platform,private backgroundGeolocation: BackgroundGeolocation,public http:Http) {
    var id=localStorage.getItem("id");
    this.imageUrl=localStorage.getItem("foto");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    this.distanceSetting="5000";
    this.distanceSetting=parseInt(this.distanceSetting);
    if(this.imageUrl==undefined){
      this.imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
    }
    console.log("change"+this.test);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add 'implements OnChanges' to the class.
    console.log("Homepage on change");

    
    this.afAuth.authState.subscribe(auth=>{
      if(auth!=null||auth!=undefined){
        localStorage.setItem("uid",auth.uid);
     }
       
     })
    

   
  
    
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
  listView(){
    this.viewStyle_list=false;
    this.viewStyle_map=true;
    this.showheartIconRead=false;
  }
  mapView(){
    this.viewStyle_map=false;
    this.viewStyle_list=true;
    this.showheartIconRead=true;
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
    let options={timeout:5000,maximumAge :5000,enableHighAccuracy:true}
      
        if(this.isToggled){
          this.list=this.afDatabase.object("employees_status/Available/"+this.userId);
          this.interval=setInterval(()=>{
            //기존 프로필 위경도 5초마다 업데이트
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
               var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric",second:"numeric"});
               console.log(time); 
               dd<10?day='0'+dd:day=''+dd;
                mm<10?month='0'+mm:month=''+mm;
              let today_today = yyyy+'/'+month+'/'+day+' '+time;
              this.location.create_date=today_today;
              this.location.isactive=true;
              this.location.userid=this.userId;

            
            console.log(this.list);
            this.list.update({
              created_date:today_today,
              isactive: true,
               lat: lat,
               lng: lng,
               userid: this.userId
            })
            console.log(this.list);
            console.log(this.location);
            console.log("add : "+this.location)
            this.afDatabase.object("employees_status/AllUser/"+this.userId).set(this.location);
            this.afDatabase.list("employees_status/NotAvailable/"+this.userId).remove()
          }).catch((error)=>{
            console.log("error"+error.code+","+error.message)
          })
          
          },10000)
      }else{
        //만약에 배달중이면 취소못하도록 해야함. 
        var obj=this.afDatabase.list("/requestedList/requestedAll", { preserveSnapshot: true });
        var count=0;
        obj.subscribe(snapshots=>{
          snapshots.forEach((ele)=>{
            console.log(ele.key);
            if(ele.val().deliveryGuy==this.userId){
              if(ele.val().status!="finished"){
                console.log(ele.val().status);
                count++;
                
                return;
              }
            }
          
          })
        })
        if(count>0){
          
          alert("현재 진행중인 배송 "+count+"건이 있어 위치를 끌수 없습니다\n 배송을 모두 마친 후, 눌러주세요.");
          setTimeout(()=>{
            this.isToggled=true;
          },200);
        }else{
          clearInterval(this.interval);
          this.interval.sto
          this.location.lat=0;
          this.location.lng=0;
          this.afDatabase.list("employees_status/AllUser/"+this.userId).remove()
          this.afDatabase.object("employees_status/AllUser/"+this.userId).set(this.location)
          this.afDatabase.object("employees_status/NotAvailable/"+this.userId).set(this.location)
          this.afDatabase.list("employees_status/Available/"+this.userId).remove()
        }
        
        
      }

      
    

  }

  
  viewChanged(){
    console.log(this.viewSetting)
  }
  currentLoc(value){
    console.log("currentLoc");
    console.log(value.lat());
    this.myCurrentlat=value.lat();
    this.myCurrentlng=value.lng();
    console.log(value.lng());
  }
  kmChanged(){
    console.log("kmChanged")
    console.log(this.distanceSetting);
   
    var requestList=this.afDatabase.list('/requestedList/requested/', { preserveSnapshot: true })
    console.log("kmChanged????????????????????????????")
    console.log(this.items);
    requestList.subscribe(snapshots=>{
    console.log(snapshots);
    this.result=[];
    this.result_date=[];
    
    snapshots.forEach(element => {
        console.log("!!!!!")
        console.log(this.result);
        console.log("????");
        console.log(element.val().distance);
        console.log(this.distanceSetting);
        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(element.val().startLat,element.val().startLng),
        new google.maps.LatLng(this.myCurrentlat,this.myCurrentlng));   
          console.log(distance);
          console.log(this.myCurrentlat+",,"+this.myCurrentlng);
          console.log("homedistance!")
          distance=parseInt(distance);
        if(distance<=this.distanceSetting){
           this.result_date.push(element.val().onlyDate);
           
           
           this.result_date=Array.from(new Set(this.result_date))
           this.result.push(element.val());
           this.result=Array.from(new Set(this.result))
           console.log("key value");
           console.log(element.val());
           console.log(this.result);
           console.log(this.result_date);
        }
        
       
 
 
    })
    console.log("value for spread");
    console.log(this.result);
    if(this.result.length==0){
      this.showOrNot=false;
    }else{
      this.showOrNot=true;
    }
    
   })
   
  }
  
  requesting(itemObject){
    this.request=itemObject;
    this.request.status="assigned";
    this.afDatabase.object('/requestedList/requested/'+itemObject.orderNo).remove();
    this.afDatabase.object('/requestedList/assigned/'+itemObject.orderNo).set(this.request);
    this.afDatabase.object('/requestedList/requestedAll/'+itemObject.orderNo).set(this.request);
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
    let todaywithTime = mm+"/"+dd+"/"+time;
    let todayNoTime= yyyy+" "+mm+" "+dd;

    var notificationObj = {title:{en:"배달원 지정안내"}, contents: {en:"칙칙폭폭 배달원이 지정되었습니다.\n 확인해보세요"},
    "data": {"status": "assigned", "id":this.userId,"foto":this.imageUrl,"time": todaywithTime,"distance":itemObject.distance},
    include_player_ids: [itemObject.tokenId]};
    if(this.platform.is('android')){
      window["plugins"].OneSignal.postNotification(notificationObj,
          (successResponse)=> {
              
              let toast = this.toast.create({
                  message: '정상적으로 신청완료 되었습니다.',
                  duration: 3000,
                  position: 'middle'
                });
              
                toast.onDidDismiss(() => {
                  console.log('Dismissed toast');
                });
              
                toast.present();

          },
          function (failedResponse) {
          console.log("Notification Post Failed: ", failedResponse);
          });

          
  }else{
    alert("web!")
    this.result_date=[];
    this.result=[];
    console.log("initialized")
    console.log(this.result);
    console.log(this.result_date);

    var requestList=this.afDatabase.list('/requestedList/requestedAll/', { preserveSnapshot: true })
    console.log("refreshing????????????????????????????")
    console.log(this.items);
    requestList.subscribe(snapshots=>{
    console.log(snapshots);
 
    snapshots.forEach(element => {
      console.log("key value222222");
        if(element.val().status=="requested"&&element.val().distance<=this.distanceSetting){
           this.result_date.push(element.val().onlyDate);
           this.result_date=Array.from(new Set(this.result_date))
           this.result.push(element.val());
           this.result=Array.from(new Set(this.result))
           
           console.log(element.val());
           console.log(this.result);
           console.log(this.result_date);
        }
       
 
 
    })
   })
    alert("not applicable on web. ")
  }
  this.changed2=!this.changed2;
  // this.kmChanged();
  }
  ngOnChanges() {
    alert("home ngchanged")
  }
  
  changed(event){
    this.result=[];
    this.result_date=[];
    var requestList=this.afDatabase.list('/requestedList/requested/', { preserveSnapshot: true })
    console.log("kmChanged????????????????????????????")
    console.log(this.items);
    this.thingToUnsubscribeFromLater=requestList.subscribe(snapshots=>{
    console.log(snapshots);
    snapshots.forEach(element => {
        console.log("!!!!!")
        console.log(element.val().distance);
        console.log(this.distanceSetting);
        if(element.val().distance<=this.distanceSetting){
           this.result_date.push(element.val().onlyDate);
           this.result.push(element.val());
           
           this.result_date=Array.from(new Set(this.result_date))
           console.log("key value");
           console.log(element.val());
           console.log(this.result);
           console.log(this.result_date);
        }
        
       
 
 
    })
    console.log("value for spread222");
    console.log(this.result);
    
   })
   
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

































