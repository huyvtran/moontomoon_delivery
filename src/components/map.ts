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
    constructor( public toast:ToastController, public loading:LoadingController,public platform:Platform, public http:Http, 
        private dialog:AlertController,public pick:PickupDirective,public geo:Geolocation,
        public afDatabase:AngularFireDatabase,public modal:ModalController
  ){
//      
// 
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
        console.log("snapshot????????????????????????????")
        console.log(this.items);
       this.items.subscribe(snapshots=>{
        console.log(snapshots);

        snapshots.forEach(element => {
          console.log("key value");
          console.log(element.key);
         
            console.log(element.val());

            console.log(element.val().endPoint) 
            
            
            
            
                    
                      this.requestedRoute.push({orderNo:element.val().orderNo,tokenId:element.val().tokenId,key:element.key ,endLng:element.val().endLng,user:element.val().user,endLat:element.val().endLat ,lat:element.val().startLat,lng:element.val().startLng,create_date:element.val().create_date, startPoint:element.val().startPoint,endPoint:element.val().endPoint,status:element.val().status},
                      {lat:element.val().endLat,lng:element.val().endLng,create_date:element.val().create_date, startPoint:element.val().startPoint,endPoint:element.val().endPoint,status:element.val().status})
                      console.log(this.requestedRoute);
                      console.log(this.requestedRoute.length);
                      console.log(this.requestedRoute[0])
                       console.log(this.requestedRoute[1])
            
                       var j=1;
                        for(var i=0; i<this.requestedRoute.length; i++){
                        console.log(i);
                           
                            if(i%2!=0){
                                 let newRoute=[];
                            newRoute.push(this.requestedRoute[(i-1)])
                            newRoute.push(this.requestedRoute[i])
                            console.log(newRoute);
                            let flightPath = new google.maps.Polyline({
                            path: newRoute,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                            });
            
                            flightPath.setMap(this.map);
            
                            let Marker=new google.maps.Marker({
                                map : this.map,
                                position:this.requestedRoute[(i-1)],
                                icon:'assets/icon/start2.png'
                            })
                            this.markerStart.push(Marker)
                            let popup=new google.maps.InfoWindow({
                                content:'<p>'+this.requestedRoute[(i-1)].orderNo+'</p><p>'+this.requestedRoute[(i-1)].tokenId+'</p><p> 출발역 : '+this.requestedRoute[(i-1)].startPoint+'</p><p>도착역 :'+this.requestedRoute[(i-1)].endPoint+'</p><p> 발생일 : '+this.requestedRoute[(i-1)].create_date+'</p> <button id="myid" value="'+this.requestedRoute[(i-1)].key+'$'+this.requestedRoute[(i-1)].startPoint+'$'+this.requestedRoute[(i-1)].endPoint+'$'+this.requestedRoute[(i-1)].lat+'$'+this.requestedRoute[(i-1)].lng+'$'+this.requestedRoute[(i-1)].endLat+'$'+this.requestedRoute[(i-1)].endLng+'$'+this.requestedRoute[(i-1)].create_date+'$'+this.requestedRoute[(i-1)].tokenId+'$'+this.requestedRoute[(i-1)].user+'$'+this.requestedRoute[(i-1)].orderNo+'">신청</button>'
                            });
                          
                            Marker.addListener('click',()=>{
                                popup.open(this.map,Marker);
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
                                   this.request.create_date=create_date;
                                   this.request.startPoint=startPoint;
                                   this.request.endPoint=endPoint;
                                   this.request.startLat=parseInt(startLat);
                                   this.request.endLat=parseInt(endLat);
                                   this.request.endLng=parseInt(endLng);
                                   this.request.startLng=parseInt(startLng);
                                   this.request.user=this.userId;
                                   this.request.status="assigned";
                                   this.request.orderNo=orderNo;
                                   this.request.onlyDate=create_date.substring(0,10);
                                   this.request.deliveryGuy="not defined yet";
                                   this.request.uid=this.uid;
                                   console.log("?s")
                                   console.log(this.request.orderNo)
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
                                   "data": {"welcome": true, "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance},
                                   include_player_ids: [tokenId]};
                                    
                                    
                                    //  
            
                                    let alert = this.dialog.create({
                                        title: 'Confirm purchase',
                                        message: '해당 배달을 시작하시겠습니까?',
                                        buttons: [
                                          {
                                            text: '취소',
                                            role: 'cancel',
                                            handler: () => {
                                                console.log("cancelded")
                                                
                                            }
                                          },
                                          {
                                            text: '신청',
                                            handler: () => {

                                                popup.close();
                                                if(this.platform.is('android')){
                                                    window["plugins"].OneSignal.postNotification(notificationObj,
                                                        (successResponse)=> {
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
                                      alert.present();
                                    if(this.platform.is('android')){
                                       
                                       
                                    }else{
                                        
            
                                    //     let data={
                                    //         "app_id": "2192c71b-49b9-4fe1-bee8-25617d89b4e8", 
                                    //  "include_player_ids": ["f474e684-6d7a-4546-810d-140a1c153b54"],
                                    //  "data": {"welcome": true, "name":"pdJung"},
                                    //  "contents": {"en": "한글 테스트"}
                                    //     }
                                    //     let headers = new Headers({ 'Content-Type': 'application/json' });
                                    //    let options = new RequestOptions({ headers: headers });
            
                                    //      this.http.post('https://onesignal.com/api/v1/notifications', data, options).toPromise().then((res)=>{
                                    //         console.log(res.json())
                                    //     }).catch((error)=>{
                                    //     })
            
                                    }
                                   
                                });
                            });
            
                            let MarkerEnd=new google.maps.Marker({
                                map : this.map,
                                position:this.requestedRoute[i],
                                icon:'assets/icon/end.png'
                            })
                            
                            this.markerEnd.push(MarkerEnd)
                            }
                       
                    }
    //        var keysFiltered = Object.keys(element.val()).filter((item)=>{return !(item == "Ndb_No" || element.val()[item] == undefined)});
    // var valuesFiltered = keysFiltered.map((item)=> {
        








    // });
            
          
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
    
    createMarkerForStart(location){
         this.Marker=new google.maps.Marker({
            map : this.map,
            position:location,
            icon:'assets/icon/start2.png'
        })
        this.markerStart.push(this.Marker)
        if(this.markerStart.length>1){
            for(var i=0; i<this.markerStart.length; i++){

                if(this.markerStart.length-1==i){

                }else{
                    this.markerStart[i].setMap(null);
                }
            }
        }
    }
    createMarkerForEnd(location){
         this.Marker=new google.maps.Marker({
            map : this.map,
            position:location,
            icon:'assets/icon/end.png'
        })
        this.markerEnd.push(this.Marker)
        
                  var flightPlanCoordinates=[
           
        ];
        
        if(this.markerEnd.length>1){
            for(var i=0; i<this.markerEnd.length; i++){

                if(this.markerEnd.length-1==i){
                    
                }else{
                    this.markerEnd[i].setMap(null);
                }
            }
        }
    }
    ngOnChanges() {
        if(this.requested){
            this.count=0;
            this.count2=0;
            alert("true")
        }
        if(this.startLat!=undefined||this.startLat!=null){
            let location2={lat:this.startLat,lng:this.startLng};
            this.centerLocation(location2);
           this.createMarkerForStart(location2);
        }

        if(this.endLat!=undefined||this.endLat!=null){
            let location={lat:this.endLat,lng:this.endLng};
            this.centerLocation(location);
            this.createMarkerForEnd(location);
           
        }

        console.log("map changed");
        console.log(this.startstn+","+this.endstn);
       
        
    }
    calling(){

    }
    
    ngOnInit(){
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
    // google.maps.event.addListener(this.map,'dragstart',(event)=>{
    //     console.log("addMapEventListener dragging"+event);
    //     this.isMapIdle=false;
    // })
    // google.maps.event.addListener(this.map,'idle',(event)=>{
    //     console.log("idle"+event);
    //     console.log(this.refreshing);
    //     if(this.refreshing){
    //         this.refreshing=false;
    //     }
    //     this.isMapIdle=true;
      
    // })
    
   


   
  }

  getGeoCoding(lat,lng){
    this.count++;

    let request = {
              latLng: {lat:lat,lng:lng}
            };  
            if(this.count<3){
                alert("getgeocoding")
        this.geocoder=new google.maps.Geocoder();
        this.geocoder.geocode(request,  (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0] != null) {
                                         
                       let city=results[0].address_components[results[0].address_components.length-3].short_name; 
                       let gu = results[0].address_components[results[0].address_components.length-4].short_name;    
                       let dong=results[0].address_components[results[0].address_components.length-5].short_name; 
                       let detail=results[0].address_components[results[0].address_components.length-6].short_name; 
                       this.full_address=city+" "+gu+" "+dong+" "+detail;
                       
                       if(this.start_end){
                        //this.home.startPoint=this.full_address;
                        this.startLocation.next(this.full_address.substring(5))
                        this.sLat.next(lat);
                        this.sLng.next(lng);
                        let loading=this.loading.create({
                            content:'Loading...'
                          })
                          loading.present().then(()=>{
                          })
    
                          setTimeout(()=>{
                              loading.dismiss();
                          },200)
                       }else{
                        this.eLat.next(lat);
                        this.eLng.next(lng);
                        this.endLocation.next(this.full_address.substring(5))
                        let loading=this.loading.create({
                            content:'Loading...'
                          })
                          loading.present().then(()=>{
                          })
    
                          setTimeout(()=>{
                              loading.dismiss();
                          },200)
                       }
                      } else {
                        alert("No address available");
                      }
                    }
                  });
    }
   
    // this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818)
    // .then((result: NativeGeocoderReverseResult) => console.log('The address is ' + result.street + ' in ' + result.countryCode))
    // .catch((error: any) => console.log(error));
           

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
        google.maps.event.addListener(map,'click',(event)=>{
            this.count2++;
            if(this.count2<3){
                this.start_end=!this.start_end;
                //start_end 가 트루이면, 출발입력하는 것. 
                
                console.log("mouseup????????????"+event.latLng.lat()+","+event.latLng.lng());
                console.log(event);
                
                this.lat=event.latLng.lat();
                this.lng=event.latLng.lng();
                var location=new google.maps.LatLng(this.lat,this.lng) 
                if(this.start_end){
                    let startMarker=new google.maps.Marker({
                        map : map,
                        position:location,
                        icon:'assets/icon/start2.png'
                    })
                }else
                {
                    let endMarker=new google.maps.Marker({
                        map : map,
                        position:location,
                        icon:'assets/icon/end.png'
                    })
                }
                
                this.getGeoCoding(this.lat,this.lng);
            }
            
        })
        return map;
    }
      getCurrentLocation2(){
    let loading=this.loading.create({
      content:'위치정보를 받아오는 중...'
    })
    loading.present().then(()=>{
    })
    let options={timeout:5000,maximumAge :5000,enableHighAccuracy:true}
    let locationObs=Observable.create(observable =>{
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      this.starting.next(lat);
      this.ending.next(lng);
      let location=new google.maps.LatLng(lat,lng);
      this.map.panTo(location);
      loading.dismiss();
    }).catch((error =>{
        //position error 발생시 다시 위치 추척
        loading.dismiss();
    //   this.geo.getCurrentPosition(options).then(resp=>{
    //   let lat=resp.coords.latitude;
    //   let lng=resp.coords.longitude;
    //   let location=new google.maps.LatLng(lat,lng);
    //   this.map.panTo(location);
    //   loading.dismiss()
    //     })
    }))
    
    })
    return locationObs
  }
}