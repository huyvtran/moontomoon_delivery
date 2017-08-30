import { SimulateProvider } from './../providers/simulate/simulate';
import { NotifiedPage } from './../pages/notified/notified';
import { HomePage } from './../pages/home/home';
import { Http,Headers ,RequestOptions} from '@angular/http';
import { request } from './models/request';
import { AngularFireDatabase } from 'angularfire2/database';
import { PickupCar } from './pickup-car/pickup-car';
import { CarProvider } from './../providers/car/car';
import { PickupDirective } from './../pickup/pickup';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavController, LoadingController, ToastController,Platform,AlertController, ModalController, NavParams } from 'ionic-angular';
import { AvailbleCarDirective } from './available-cars/available-cars';
import { Geolocation } from '@ionic-native/geolocation';
import { Dialogs } from '@ionic-native/dialogs';
import { OneSignal } from '@ionic-native/onesignal';

declare var google;

@Component({
   selector: 'map',
  templateUrl: 'map.html',
   entryComponents: [PickupDirective,AvailbleCarDirective,PickupCar],
     providers:[CarProvider,PickupDirective]
})
export class MapDirective implements OnInit,OnChanges  {
    @Input() isPickupRequested:any;
    @Input() startstn:string;
    @Input() endstn:string;
    @Input() startLng:any;
    @Input() startLat:any;
    @Input() endLng:any;
    @Input() endLat:any;
    @Output() starting : EventEmitter<any>=new EventEmitter();
    @Output() ending : EventEmitter<any>=new EventEmitter();
    @Output() drag_second : EventEmitter<any>=new EventEmitter();
    @Output() startLocation : EventEmitter<any>=new EventEmitter();
    @Output() endLocation : EventEmitter<any>=new EventEmitter();

    @Output() sLat : EventEmitter<any>=new EventEmitter();
    @Output() sLng : EventEmitter<any>=new EventEmitter();
    @Output() eLat : EventEmitter<any>=new EventEmitter();
    @Output() eLng : EventEmitter<any>=new EventEmitter();
    count:number=0;
    count2:number=0;
    public refreshing:boolean=false;
    public map:any;
    public isMapIdle:boolean;
    public currentLocation:any;
    public full="";
    lat:number;
    lng:number;
    tokenid:string;
    @Input() requested:boolean;
    requestedRoute=[];
      items:any;
    Marker:any;
    MarkerEnd:any;
    MarkerStart:any;
     markerStart=[];
     request={} as request
     markerEnd=[];
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
    constructor( public toast:ToastController, public loading:LoadingController,public platform:Platform, public http:Http, 
        private dialog:AlertController,public geo:Geolocation,
        public afDatabase:AngularFireDatabase,public modal:ModalController

  ){
//      
// 
    this.check_true=false;
   this.uid=localStorage.getItem("uid");
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
 

        this.items=this.afDatabase.list('/requestedList/requested', { preserveSnapshot: true })
        var count=0;
       this.items.subscribe(snapshots=>{
        
        snapshots.forEach(element => {
            
          console.log("key value");
          console.log(element.key);
            
            this.requestedRoute.push({orderNo:element.val().orderNo,
            tokenId:element.val().tokenId,key:element.key ,endLng:element.val().endLng,user:element.val().user,
            endLat:element.val().endLat ,lat:element.val().startLat,lng:element.val().startLng,
            create_date:element.val().create_date, startPoint:element.val().startPoint,
            endPoint:element.val().endPoint,status:element.val().status,
             weight:element.val().freight_weight,size:element.val().frieght_size,content:element.val().freight_content,request:element.val().request_text})
            if(this.requestedRoute.length==snapshots.length){
                if(localStorage.getItem("first")=="true"){
                    localStorage.setItem("first","false")
                    console.log(this.requestedRoute);
                    for(var i=0; i<this.requestedRoute.length; i++){
                        let route = [
                        // this.requestedRoute[(i-1]).lat, lng: this.requestedRoute[(i-1]).lng
                        {lat: this.requestedRoute[(i)].lat,lng:this.requestedRoute[(i)].lng},
                        {lat: this.requestedRoute[(i)].endLat,lng:this.requestedRoute[(i)].endLng},
                        ]
                        let flightPath = new google.maps.Polyline({
                        path: route,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                        });
                        flightPath.setMap(this.map);
                        let id;
                        count++;
                        let startPosition={lat:this.requestedRoute[i].lat,lng:this.requestedRoute[i].lng}
                        let Marker=new google.maps.Marker({
                        map : this.map,
                        position:startPosition,
                        icon:'assets/icon/start2.png',
                        store_id: count,
                        })
                        this.markerStart.push(Marker)
                        id = Marker.__gm_id
                        console.log(Marker.get('store_id'))
                        console.log("markerstartsetup")
                        console.log(id)
                        this.markerStart[id] = Marker;
                        console.log(Marker)
                        console.log(this.markerStart)
                        let endPosition={lat:this.requestedRoute[i].endLat,lng:this.requestedRoute[i].endLng}
                        let MarkerEnd=new google.maps.Marker({
                        map : this.map,
                        position:endPosition,
                        icon:'assets/icon/end.png',
                        store_id: count,
                        })
                        this.markerEnd.push(MarkerEnd)
                        let popup=new google.maps.InfoWindow({
                        content:'<p> 출발역 : '+this.requestedRoute[i].startPoint+'</p>'+
                        '<p>도착역 :'+this.requestedRoute[i].endPoint+'</p>'+
                        '<p> 발생일 : '+this.requestedRoute[i].create_date+'</p> '+
                        '<p> 화물정보 : '+this.requestedRoute[i].weight+'</p> '+
                        '<p> 남김말 : '+this.requestedRoute[i].request+'</p> '+
                        '<button id="myid" value="'+this.requestedRoute[i].key+'$'+this.requestedRoute[i].startPoint+'$'+this.requestedRoute[i].endPoint+'$'+this.requestedRoute[i].lat+'$'+this.requestedRoute[i].lng+'$'+this.requestedRoute[i].endLat+'$'+this.requestedRoute[i].endLng+'$'+this.requestedRoute[i].create_date+'$'+this.requestedRoute[i].tokenId+'$'+this.requestedRoute[i].user+'$'+this.requestedRoute[i].orderNo+'$'+this.requestedRoute[i].weight+'$'+this.requestedRoute[i].size+'$'+this.requestedRoute[i].content+'$'+this.requestedRoute[i].request+'">신청</button>'
                        });
                        Marker.addListener('click',()=>{
                        console.log(Marker.get('store_id'))
                        console.log(Marker)
                        flightPath.setMap
                        console.log(this.markerStart);
                        console.log(this.markerStart.length)
                        popup.open(this.map,Marker);
                        })
                        MarkerEnd.addListener('click',()=>{
                        // MarkerEnd.remove();
                        console.log(MarkerEnd.get('store_id'))
                        console.log(MarkerEnd)
                        MarkerEnd.setMap(null);
                        // popup.open(this.map,MarkerEnd);
                        })
                        google.maps.event.addListenerOnce(popup, 'domready', () => {
                        document.getElementById('myid').addEventListener('click', () => {
                        var complex=(<HTMLInputElement>document.getElementById('myid')).value;
                        var key=complex.split("$")[0];
                        var startPoint=complex.split("$")[1];
                        var endPoint=complex.split("$")[2];
                        var startLat=complex.split("$")[3];
                        var startLng=complex.split("$")[4];
                        var endLat=complex.split("$")[5];
                        var endLng=complex.split("$")[6];
                        var create_date=complex.split("$")[7];
                        var tokenId=complex.split("$")[8];
                        var user=complex.split("$")[9];
                        var orderNo=complex.split("$")[10];
                        var weight=complex.split("$")[11];
                        var size=complex.split("$")[12];
                        var content=complex.split("$")[13];
                        var request_message=complex.split("$")[14];
                        this.request.create_date=create_date;
                        this.request.startPoint=startPoint;
                        this.request.endPoint=endPoint;
                        this.request.startLat=parseInt(startLat);
                        this.request.endLat=parseInt(endLat);
                        this.request.endLng=parseInt(endLng);
                        this.request.startLng=parseInt(startLng);
                        this.request.user=user;
                        this.request.status="assigned";
                        this.request.orderNo=orderNo;
                        this.request.onlyDate=create_date.substring(0,10);
                        this.request.deliveryGuy="not defined yet";
                        this.request.uid=this.uid;
                        this.request.tokenId=tokenId;

                        this.request.freight_weight=weight;
                        this.request.freight_size=size;
                        this.request.freight_content=content;
                        this.request.request_text=request_message;

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
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(startLat,startLng),
                        new google.maps.LatLng(endLat,endLng));
                        distance=distance/1000;
                        distance=distance.toFixed(2);
                        var notificationObj = {title:{en:"배달원 지정안내"}, contents: {en:"칙칙폭폭 배달원이 지정되었습니다.\n 확인해보세요"},
                        "data": {"status": "assigned", "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance},
                        include_player_ids: [tokenId]};
                        let alert = this.dialog.create({
                        title: 'Confirm purchase',
                        message: '해당 배달을 시작하시겠습니까?',
                        buttons: [
                        {
                        text: '취소',
                        role: 'cancel',
                        handler: () => {
                            popup.close();
                        }
                        },
                        {
                        text: '신청',
                        handler: () => {
                            
                            popup.close();
                            Marker.setMap(null);
                            MarkerEnd.setMap(null);
                            flightPath.setMap(null);
                            if(this.platform.is('android')){
                                
                                
                                window["plugins"].OneSignal.postNotification(notificationObj,
                                (successResponse)=> {
                                this.request.deliveryGuy=this.userId;
                                this.afDatabase.object('/requestedList/assigned/'+orderNo).set(this.request);
                                this.afDatabase.object('/requestedList/requestedAll/'+orderNo).set(this.request);
                                this.afDatabase.object('/requestedList/requested/'+orderNo).remove();
                                let toast = this.toast.create({
                                    message: '전송되었습니다.',
                                    duration: 2000,
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
                                this.request.deliveryGuy=this.userId;
                                this.afDatabase.object('/requestedList/assigned/'+orderNo).set(this.request);
                                this.afDatabase.object('/requestedList/requestedAll/'+orderNo).set(this.request);
                                this.afDatabase.object('/requestedList/requested/'+orderNo).remove();
                                let toast = this.toast.create({
                                message: '전송되었습니다.',
                                duration: 3000,
                                position: 'middle'
                                });
                                toast.onDidDismiss(() => {
                                console.log('Dismissed toast');
                                });
                                toast.present();
                            }
                        }
                        }
                        ]
                        });
                        if(this.platform.is('android')){
                        }else{
                        // let data={
                        // "app_id": "2192c71b-49b9-4fe1-bee8-25617d89b4e8",
                        // "include_player_ids": ["f474e684-6d7a-4546-810d-140a1c153b54"],
                        // "data": {"welcome": true, "name":"pdJung"},
                        // "contents": {"en": "한글 테스트"}
                        // }
                        // let headers = new Headers({ 'Content-Type': 'application/json' });
                        // let options = new RequestOptions({ headers: headers });
                        // this.http.post('https://onesignal.com/api/v1/notifications', data, options).toPromise().then((res)=>{
                        // console.log(res.json())
                        // }).catch((error)=>{
                        // })
                        }
                    });
                    });
                    }
                    

                }
            }
        });
    })
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
    if(this.requested){
        this.count=0;
        this.count2=0;
    }
    
}

ngOnInit(){ 
    localStorage.setItem("first","true");
    this.map=this.createMap();
    this.getCurrentLocation2().subscribe(currentLocation=>{
    });
}
centerLocation2(){
    this.isMapIdle=false;
    this.getCurrentLocation2().subscribe(currentLocation=>{
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
addMapEventListener(){

}

    createMap(location=new google.maps.LatLng(37.5665,126.9780)){
        let mapOptions={
            center:location,
            zoom:15,
            disableDefaultUI: false
        }
        let mapEl=document.getElementById('map');
        let map=new google.maps.Map(mapEl,mapOptions);
        google.maps.event.addListener(map,'zoom_changed',(event)=>{
            // alert(map.getZoom());
            //zoom detect
        })
        
        return map;
    }
      getCurrentLocation2(){
    let loading=this.loading.create({
      content:'위치정보를 받아오는 중2...'
    })
    loading.present().then(()=>{
    })
    let options={  timeout: 10000}
    let locationObs=Observable.create(observable =>{
        let watch = this.geo.watchPosition();
        watch.subscribe((data) => {
         // data can be a set of coordinates, or an error (if an error occurred).
         // data.coords.latitude
         // data.coords.longitude
         alert(data.coords.latitude);
        });
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      this.starting.next(lat);
      this.ending.next(lng);
      let location=new google.maps.LatLng(lat,lng);
      this.map.panTo(location);
    }).catch((error =>{

        alert(error.code+","+error.message)
        
    }))
    
    })
    return locationObs
  }
}