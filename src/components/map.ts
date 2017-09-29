import { SimulateProvider } from './../providers/simulate/simulate';
import { NotifiedPage } from './../pages/notified/notified';
import { HomePage } from './../pages/home/home';
import { RequestPage } from './../pages/request/request';
import { Http,Headers ,RequestOptions} from '@angular/http';
import { request } from './models/request';
import { AngularFireDatabase } from 'angularfire2/database';
import { PickupCar } from './pickup-car/pickup-car';

import {NavController, App} from "ionic-angular/index";
import { CarProvider } from './../providers/car/car';
import { PickupDirective } from './../pickup/pickup';
import { Component, OnInit,Injectable, ViewChild,Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {  LoadingController, ToastController,Platform,AlertController, ModalController, NavParams } from 'ionic-angular';
import { AvailbleCarDirective } from './available-cars/available-cars';
import { Geolocation } from '@ionic-native/geolocation';
import { Dialogs } from '@ionic-native/dialogs';
import { OneSignal } from '@ionic-native/onesignal';
import { Observable, Subscription } from 'rxjs/Rx';
import { ChatPage } from './../pages/chat/chat'
declare var google;

@Component({
   selector: 'map',
  templateUrl: 'map.html',
   entryComponents: [PickupDirective,AvailbleCarDirective,PickupCar],
     providers:[CarProvider,PickupDirective]
})
@Injectable()
export class MapDirective implements OnInit,OnChanges  {
    locationSending:any;
    @Input() changed2:boolean;
    @Input() isPickupRequested:any;
    @Input() startstn:string;
    @Input() endstn:string;
    @Input() startLng:any;
    @Input() startLat:any;
    @Input() endLng:any;
    @Input() endLat:any;
    @Input() distanceSetting:any;
    @Input() refreshing:any;
    @Output() changedfirst : EventEmitter<any>=new EventEmitter();
    @Output() changed : EventEmitter<any>=new EventEmitter();
    @Output() starting : EventEmitter<any>=new EventEmitter();
    @Output() ending : EventEmitter<any>=new EventEmitter();
    @Output() drag_second : EventEmitter<any>=new EventEmitter();
    @Output() startLocation : EventEmitter<any>=new EventEmitter();
    @Output() endLocation : EventEmitter<any>=new EventEmitter();

    @Output() currentLoc : EventEmitter<any>=new EventEmitter();
    thingToUnsubscribeFromLater: Subscription = new Subscription();
    @Output() currentNumber : EventEmitter<any>=new EventEmitter();
    count:number=0;
    count2:number=0;
    public map:any;
    public isMapIdle:boolean;
    public currentLocation:any;
    public full="";
    lat:number;
    lng:number;
    myCurrentlat:any;
    myCurrentlng:any;
    tokenid:string;
    @Input() requested:boolean;
    popuparray=[];
    requestedRoute=[];
      items:any;
    Marker:any;
    MarkerEnd:any;
    MarkerStart:any;
     markerStart=[];
     centerMarker:any;
     circleMarker:any;
     request={} as request
     markerEnd=[];
     pathRoute=[];
     geocoder:any;
     full_address:string;
     public fetchingExpress:boolean=false;
     start_end:boolean=false;
     startMarker:any;
     endMarker:any;
     userId:string;
     foto:string;
     uid:string;
     tokenId:string;
     compare:number;
     new_compare:number;
     check_true:boolean;
     count3:number=0;
     c:number=0;
     name:string;
     public navCtrl:NavController;

    constructor( public toast:ToastController,private app:App,public loading:LoadingController,public platform:Platform, public http:Http, 
        private dialog:AlertController,public geo:Geolocation,
        public afDatabase:AngularFireDatabase,public modal:ModalController
        

  ){
    this.navCtrl = app.getActiveNav();
//      
// 
    this.check_true=false;
   this.uid=localStorage.getItem("uid");
   if(this.uid==undefined){
       this.uid="KmXYVcVfOxUICaD8yZfXsdRvgPx1"
   }
    var id=localStorage.getItem("id");
    this.foto=localStorage.getItem("foto")

    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
     
   
     
    if(this.platform.is('android')){


        window["plugins"].OneSignal
.startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
.handleNotificationOpened((jsonData)=> {
    let value=jsonData.notification.payload.additionalData
    if(value.status=="chat"){
        alert("chatk!")
        this.navCtrl.push(ChatPage,{"item":value.object})
       
    }

})
.endInit();
    }else if(this.platform.is('ios')){
        window["plugins"].OneSignal
        .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
        .handleNotificationOpened((jsonData)=> {
            let value=jsonData.notification.payload.additionalData
            if(value.welcome){
                let modal = this.modal.create(NotifiedPage,{name:value.name});
                let me = this;
                modal.onDidDismiss(data => {
                    this.fetchingExpress=true;
                });
                modal.present();
            }else{
                alert("nope");
            }
        })
            .endInit();
    }else{
        // let modal = this.modal.create(NotifiedPage);
        // let me = this;
        // modal.onDidDismiss(data => {
        
        // });
        // modal.present();
    }
      
    //  let headers = new Headers({ 'Authorization': 'Bearer Xw8t8tVjgtT0t--jRrsD7oFqZEq2AFBIjF9XSwoqAuYAAAFdv6Kaqg' });
    // let options = new RequestOptions({ headers: headers });
    //   this.http.get('https://kapi.kakao.com/v1/user/me', options).toPromise().then((res)=>{
    //       console.log(res.json())
    //       alert(res.json());
    //   }).catch((error)=>{
    //     alert(error);
    // })
     
        // 
  
    //       window["plugins"].OneSignal
    // .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
  	// .handleNotificationOpened(notificationOpenedCallback)
    // .endInit();
        
        
    }
    
    makeMarker(){

       
        var maker=this.afDatabase.list('/requestedList/requested', { preserveSnapshot: true })
        var count=0;
        this.thingToUnsubscribeFromLater= maker.subscribe(snapshots=>{
        this.requestedRoute=[];
        
        snapshots.forEach(element => {
          console.log("key value");
          console.log(element.key);
          console.log(this.distanceSetting)
          var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(element.val().startLat,element.val().startLng),
          new google.maps.LatLng(this.myCurrentlat,this.myCurrentlng));   
            console.log(distance);
            console.log("distance!")
            distance=parseInt(distance);

            console.log(element.val().startLat+",,,"+element.val().startLng)
            console.log(this.myCurrentlat+",,,"+this.myCurrentlng)
            console.log(element.val())
            if(this.distanceSetting>distance){
                console.log("!!!!");
                this.requestedRoute.push({type:element.val().type,orderNo:element.val().orderNo,
                    tokenId:element.val().tokenId,key:element.key ,endLng:element.val().endLng,user:element.val().user,
                    endLat:element.val().endLat ,lat:element.val().startLat,lng:element.val().startLng,
                    create_date:element.val().create_date, startPoint:element.val().startPoint,
                    endPoint:element.val().endPoint,status:element.val().status,
                     desiredTime:element.val().desired_time,startDetail:element.val().startDetail,
                     endDetail:element.val().endDetail,senderuid:element.val().senderuid,
                     request:element.val().request_text,distance:element.val().distance})
                            console.log(this.requestedRoute);
            }
            
                    
                    
                   
                    

        });
        for(var i=0; i<this.markerStart.length; i++){
            this.markerStart[i].setMap(null);
        }
        for(var i=0; i<this.markerEnd.length; i++){
            this.markerEnd[i].setMap(null);
        }
        for(var i=0; i<this.pathRoute.length; i++){
            this.pathRoute[i].setMap(null);
        }
        this.markerStart=[];
        this.markerEnd=[];
        this.pathRoute=[];
        for(var i=0; i<this.requestedRoute.length; i++){
            console.log("II:"+i);
            let route = [
            // this.requestedRoute[(i-1]).lat, lng: this.requestedRoute[(i-1]).lng
            {lat: this.requestedRoute[(i)].lat,lng:this.requestedRoute[(i)].lng},
            {lat: this.requestedRoute[(i)].endLat,lng:this.requestedRoute[(i)].endLng},
            ]
            
            let startPosition={lat:this.requestedRoute[i].lat,lng:this.requestedRoute[i].lng}
            console.log("drawing!"+i)
            this.drawStarter(startPosition);
            let endPosition={lat:this.requestedRoute[i].endLat,lng:this.requestedRoute[i].endLng}
            this.drawEnd(endPosition);
            this.drawRoute(route);
            console.log("II:"+i);
           

            
            }
        console.log("marker length "+this.markerStart.length);
        let currentNumber=this.markerStart.length;
        this.currentNumber.next(currentNumber)
        console.log(this.markerStart);
        for(let k = 0; k < this.markerStart.length; k++){
            this.markerStart[k].addListener('click', () => {
                console.log("kkk"+k)
                console.log(this.requestedRoute);
                       
                var endPoint=this.requestedRoute[k].endPoint;
            var startPoint=this.requestedRoute[k].startPoint;
            console.log(startPoint);
            console.log(endPoint);
            var startLat=this.requestedRoute[k].lat;
            var startLng=this.requestedRoute[k].lng;
            var endLat=this.requestedRoute[k].endLat;
            var endLng=this.requestedRoute[k].endLng;
            var create_date=this.requestedRoute[k].create_date;
            var distance=this.requestedRoute[k].distance;
            var startDetail=this.requestedRoute[k].startDetail;
            var endDetail=this.requestedRoute[k].endDetail;
            var desiredTime=this.requestedRoute[k].desiredTime;
            var senderuid=this.requestedRoute[k].senderuid;
            var tokenId=this.requestedRoute[k].tokenId;
            var user=this.requestedRoute[k].user;
            var orderNo=this.requestedRoute[k].orderNo;
            var weight=this.requestedRoute[k].weight;
            var size=this.requestedRoute[k].size;
            var content=this.requestedRoute[k].content;
            var request_message=this.requestedRoute[k].request;
            var order=this.requestedRoute[k].order;

            this.request.create_date=create_date;
            this.request.startPoint=startPoint;
            this.request.endPoint=endPoint;
            this.request.startLat=(startLat);
            this.request.endLat=(endLat);
            this.request.endLng=(endLng);
            this.request.startLng=(startLng);
            this.request.user=user;
            this.request.status="assigned";
            this.request.orderNo=orderNo;
            this.request.onlyDate=create_date.substring(0,10);
            this.request.distance=distance;
            this.request.type=this.requestedRoute[k].type;
            this.request.request_text=request_message;
            this.request.startDetail=startDetail;
            this.request.endDetail=endDetail;
            this.request.desired_time=desiredTime;
            this.request.senderuid=senderuid;
            this.request.messengeruid=this.uid;
            this.request.tokenId=tokenId;
            var getFotoAndName=this.afDatabase.list('profile/'+this.uid, { preserveSnapshot: true })
            getFotoAndName.subscribe(snapshots=>{
              snapshots.forEach(element => {
                console.log("element")
                if(element.key==="foto"){
                    this.request.messengerFoto=element.val();
                }
                if(element.key==="name"){
                    this.request.messengerName=element.val();
                }
                if(element.key==="id"){
                    this.request.deliveryGuy=element.val();
                }
                if(element.key=="phone"){
                    this.request.messengerPhone=element.val();
                }
               
              
        
              });
            })
            console.log(this.request);
            this.navCtrl.push(RequestPage,{object:this.request})
            

                })
            }
                            })
                        }
                    //  google.maps.event.addListenerOnce(this.popuparray[k], 'domready', () => {
                    //     document.getElementById('myid').addEventListener('click', () => {
                    //         var complex=(<HTMLInputElement>document.getElementById('myid')).value;
                    //         var key=complex.split("$")[0];
                    //         var startPoint=complex.split("$")[1];
                    //         var endPoint=complex.split("$")[2];
                    //         var startLat=complex.split("$")[3];
                    //         var startLng=complex.split("$")[4];
                    //         var endLat=complex.split("$")[5];
                    //         var endLng=complex.split("$")[6];
                    //         var create_date=complex.split("$")[7];
                    //         var tokenId=complex.split("$")[8];
                    //         var user=complex.split("$")[9];
                    //         var orderNo=complex.split("$")[10];
                    //         var weight=complex.split("$")[11];
                    //         var size=complex.split("$")[12];
                    //         var content=complex.split("$")[13];
                    //         var request_message=complex.split("$")[14];
                    //         var order=complex.split("$")[15];
                    //         this.request.create_date=create_date;
                    //         this.request.startPoint=startPoint;
                    //         this.request.endPoint=endPoint;
                    //         this.request.startLat=parseInt(startLat);
                    //         this.request.endLat=parseInt(endLat);
                    //         this.request.endLng=parseInt(endLng);
                    //         this.request.startLng=parseInt(startLng);
                    //         this.request.user=user;
                    //         this.request.status="assigned";
                    //         this.request.orderNo=orderNo;
                    //         this.request.onlyDate=create_date.substring(0,10);
                    //         this.request.deliveryGuy="not defined yet";
                    //         this.request.uid=this.uid;
                    //         this.request.tokenId=tokenId;
                    
                    //         this.request.freight_weight=weight;
                    //         this.request.freight_size=size;
                    //         this.request.freight_content=content;
                    //         this.request.request_text=request_message;
                    //         console.log(this.request);
                    //         this.markerStart[k].setMap(null);
                    //         this.markerEnd[k].setMap(null);
                    //         this.pathRoute[k].setMap(null);
                    //         let today = new Date();
                    //         let dd:number;
                    //         let day:string;
                    //         let month:string;
                    //         dd = today.getDate();
                    //         var mm = today.getMonth()+1; //January is 0!
                    //         var yyyy = today.getFullYear();
                    //         var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
                    //         dd<10?day='0'+dd:day=''+dd;
                    //         mm<10?month='0'+mm:month=''+mm;
                    //         let todaywithTime = mm+"/"+dd+"/"+time;
                    //         let todayNoTime= yyyy+" "+mm+" "+dd;
                    //         var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(startLat,startLng),
                    //         new google.maps.LatLng(endLat,endLng));
                    //         var notificationObj = {title:{en:"배달원 지정안내"}, contents: {en:"칙칙폭폭 배달원이 지정되었습니다.\n 확인해보세요"},
                    //         "data": {"status": "assigned", "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance},
                    //         include_player_ids: [tokenId]};
                    //         this.request.deliveryGuy=this.userId;
                    //         this.thingToUnsubscribeFromLater.unsubscribe();
                    //         let modal = this.modal.create(RequestPage,{object:this.request});
                    //         let me = this;
                    //         modal.onDidDismiss(data => {
                    //             alert("dismissed");
                    //             this.makeMarker();
                    //         });
                    //         modal.present();
                    //     })
                    // })
                            // this.afDatabase.object('/requestedList/assigned/'+orderNo).set(this.request);
                            // this.afDatabase.object('/requestedList/requestedAll/'+orderNo).set(this.request);
                            // this.afDatabase.object('/requestedList/requested/'+orderNo).remove();
                           
                            
                            // this.changed.next("changed")
                            // let toast = this.toast.create({
                            // message: '전송되었습니다.',
                            // duration: 3000,
                            // position: 'middle'
                            // });
                            // toast.onDidDismiss(() => {
                            // console.log('Dismissed toast');
                            // });
                            // toast.present();

                            // let alert = this.dialog.create({
                            //     title: 'Confirm purchase',
                            //     message: '해당 배달을 시작하시겠습니까?',
                            //     buttons: [
                            //     {
                            //     text: '취소',
                            //     role: 'cancel',
                            //     handler: () => {
                            //     }
                            //     },
                            //     {
                            //     text: '신청',
                            //     handler: () => {
                                    
                            //         // if(this.platform.is('android')){
                                        
                                        
                            //         //     this.request.deliveryGuy=this.userId;
                            //         //     this.afDatabase.object('/requestedList/assigned/'+orderNo).set(this.request);
                            //         //     this.afDatabase.object('/requestedList/requestedAll/'+orderNo).set(this.request);
                            //         //     this.afDatabase.object('/requestedList/requested/'+orderNo).remove();
                            //         //     let toast = this.toast.create({
                            //         //         message: '전송되었습니다.',
                            //         //         duration: 2000,
                            //         //         position: 'middle'
                            //         //         });
                            //         //         toast.onDidDismiss(() => {
                            //         //             console.log('Dismissed toast');
                            //         //         });
                            //         //             toast.present();
                            //         // }else{
                                        
                            //         //     }
                            //         }
                            //     }]
                            // })

   

                       
             
        
   
    drawStarter(startPoint){
       
        this.Marker=new google.maps.Marker({
            map : this.map,
            position:startPoint,
            icon:'assets/icon/start2.png',
            })
            this.markerStart.push(this.Marker)
            console.log("drawStarter");
            console.log(this.markerStart);

           
            
    }
    drawEnd(endPoint){
        
         this.MarkerEnd=new google.maps.Marker({
             map : this.map,
             position:endPoint,
             icon:'assets/icon/end.png',
             })
             this.markerEnd.push(this.MarkerEnd)
             
     }
     drawRoute(route){

        let flightPath = new google.maps.Polyline({
            path: route,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
            });
            flightPath.setMap(this.map);
            this.pathRoute.push(flightPath);
     }
dragging(trigger){
    if(trigger){
        this.drag_second.next(true);    
    }else{
        this.drag_second.next(false);
    }
}

ionViewDidLoad(){
    
}
ngOnChanges() {
    this.makeMarker();

    console.log("stst")
    console.log(this.markerStart);
    
    // for(var j = 0; j < this.markerStart.length; j++){
    //     ((k) => this.markerStart[k].addListener('click', () => {
    //         console.log("jjj"+k)
    //             console.log("j"+k)
    //             // console.log(this.popuparray);
    //             // console.log(this.popuparray[k]);
    //             // console.log(this.markerStart)
    //             // console.log(this.markerStart[k])
    //             // if(this.popuparray[k]!=undefined){

    //             //     this.popuparray[k].open(this.map,this.markerStart[k]);
    //             // }else{
    //             //     console.log("ㅠㅠㅠㅠㅠ")
    //             // }
    //     }))(j);
    // }
            
            if(this.circleMarker!=undefined){
                console.log("radius : "+this.distanceSetting);
                console.log("thissssss");
                console.log(this.requestedRoute)
                this.distanceSetting=parseInt(this.distanceSetting);
                this.circleMarker.setMap(null);
                  this.circleMarker = new google.maps.Circle({
                    map: this.map,
                    radius: this.distanceSetting,    // 10 miles in metres
                    fillColor: 'green'
                  });
                  this.circleMarker.bindTo('center', this.centerMarker, 'position');
                  if(this.distanceSetting<1500){
                    this.map.setZoom(14);
                  }else if(this.distanceSetting<3001){
                      this.map.setZoom(13);
                  }else if(this.distanceSetting==5000){
                      this.map.setZoom(12)
                  }else if(this.distanceSetting>5000){
                      this.map.setZoom(11);
                  }
            }
           
        
    if(this.requested){
        this.count=0;
        this.count2=0;
    }
    
}

ngOnInit(){ 
    
    this.map=this.createMap();
    this.getCurrentLocation2().subscribe(currentLocation=>{
        alert(currentLocation);
    });

}
centerLocation2(){
    this.isMapIdle=false;
    this.getCurrentLocation2().subscribe(currentLocation=>{
        alert(currentLocation);
     this.map.panTo(currentLocation);    
        
    });
}
centerLocation(location){
    if(location){
            this.map.panTo(location);
    }else{
        this.isMapIdle=false;
        this.getCurrentLocation2().subscribe(currentLocation=>{
         this.map.panTo(currentLocation);    
            
        });
    }
  }
  
updatedPickupLocation(location){
this.currentLocation=location;
this.centerLocation(location);
}
    createMap(location=new google.maps.LatLng(37.5665,126.9780)){
        let mapOptions={
            center:location,
            zoom:14,
            disableDefaultUI: false
        }
        let mapEl=document.getElementById('map');
        let map=new google.maps.Map(mapEl,mapOptions);
        google.maps.event.addListener(map,'zoom_changed',(event)=>{
        })
        
        return map;
    }
        getCurrentLocation2(){
            this.centerMarker="";
            var loca
            let loading=this.loading.create({
              content:'위치정보를 받아오는 중23…'
            })
            loading.present().then(()=>{
            })
            let options={timeout:6500,maximumAge :3000,enableHighAccuracy:true}
            let locationObs=Observable.create(observable =>{
                
              this.geo.getCurrentPosition(options).then(resp=>{
              let lat=resp.coords.latitude;
              let lng=resp.coords.longitude;
              this.myCurrentlat=lat
              this.myCurrentlng=lng
              //   this.starting.next(lat);
              //   this.ending.next(lng);
              let location=new google.maps.LatLng(lat,lng);
              this.locationSending=location
              this.currentLoc.next(location);
                
              this.map.panTo(location);
              this.centerMarker=new google.maps.Marker({
                map: this.map,
                icon:'',
                position: new google.maps.LatLng(lat, lng),
                title: 'Some location'
              })
              this.circleMarker = new google.maps.Circle({
                map: this.map,
                radius: 1000,    // 10 miles in metres
                fillColor: 'green'
              });
                this.circleMarker.bindTo('center', this.centerMarker, 'position');
                
              loading.dismiss();
            }).catch((error =>{
                loading.dismiss();
                if(error.code==3){
                   
                }
            
            }))
            
            })
            
    
            return locationObs
          }
}