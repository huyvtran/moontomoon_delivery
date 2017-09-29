import { Component ,Injectable} from '@angular/core';
import { IonicPage, NavController,ToastController, AlertController,NavParams,ViewController,Platform } from 'ionic-angular';
import { request } from './../../components/models/request';
import { CallNumber } from '@ionic-native/call-number';

import { Http,Headers ,RequestOptions} from '@angular/http';
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
  userId:any;
  imageUrl:any;
  name:any;
  distance:any;
  startDetail:any;
  endDetail:any;
  type:any;
  desiredTime:any;
  
  constructor(private callNumber: CallNumber,public http:Http,public platform: Platform, public toast:ToastController, private dialog:AlertController,
    public afDatabase:AngularFireDatabase,public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.request=this.navParams.get('object');
    
    this.start=this.request.startPoint;
    this.end=this.request.endPoint;
    this.orderNo=this.request.orderNo;
    this.request_text=this.request.request_text;
    this.distance=this.request.distance;
    this.startDetail=this.request.startDetail;
    this.endDetail=this.request.endDetail;
    if(this.platform.is("android")){
      window["plugins"].OneSignal.getIds((idx)=>{
        this.request.messengertokenId=idx.userId
      });
    }
   
    var id=localStorage.getItem("id");
    this.type=this.request.type
    this.desiredTime=this.request.desired_time;
    console.log(this.request)
    if(id!=undefined||id!=null){
      this.userId=id;
      }else{
      this.userId="admin"
      }
    this.imageUrl=localStorage.getItem("foto");
    this.name=localStorage.getItem("name");
    console.log(this.request);
  }

  ionViewDidLoad() {
    // this.callNumber.callNumber("01079998598", true)
    // .then(() => console.log('Launched dialer!'))
    // .catch(() => console.log('Error launching dialer'));
    // console.log('ionViewDidLoad RequestPage');
  }
  confirm(){
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
    var todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
    this.request.matchedDate=todayWithTime;
    console.log(this.request);
    var notificationObj = {title:{en:"메신져 지정안내"}, contents: {en:"메신져가 지정되었습니다.\n 확인해보세요"},
            "data": {"status": "assigned", "id":this.userId, "name":this.name,"foto":this.imageUrl,"distance":this.distance,"itemObject":this.request},
            include_player_ids: [this.request.tokenId]};

    if(this.platform.is('android')){
      window["plugins"].OneSignal.postNotification(notificationObj,
        (successResponse)=> {
            this.request.deliveryGuy=this.userId;
            this.afDatabase.object('/requestedList/assigned/'+this.orderNo).set(this.request);
            this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request);
            this.afDatabase.object('/requestedList/requested/'+this.orderNo).remove();
            // let toast = this.toast.create({
            //     message: '전송되었습니다.',
            //     duration: 3000,
            //     position: 'middle'
            //   });
              alert("매칭이 완료되었습니다. 나의 배송 목록 보기에서 상세내용을 확인해주세요!")
              // toast.onDidDismiss(() => {
              //   console.log('Dismissed toast');
              // });
            
              // toast.present();
  
        },
        function (failedResponse) {
          alert(failedResponse)
          alert(JSON.stringify(failedResponse))
        console.log("Notification Post Failed: ", failedResponse);
        });
    }else if(this.platform.is('ios')){
      var notificationObj = {title:{en:"메신져 지정안내"}, contents: {en:"메신져가 지정되었습니다.\n 확인해보세요"},
      "data": {"status": "assigned", "id":this.userId, "name":this.name,"foto":this.imageUrl,"distance":this.distance,"itemObject":this.request},
      include_player_ids: [this.request.tokenId]};

      window["plugins"].OneSignal.postNotification(notificationObj,
        (successResponse)=> {
          this.request.deliveryGuy=this.userId;
            this.afDatabase.object('/requestedList/assigned/'+this.orderNo).set(this.request);
            this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request);
            this.afDatabase.object('/requestedList/requested/'+this.orderNo).remove();
            // let toast = this.toast.create({
            //     message: '전송되었습니다.',
            //     duration: 3000,
            //     position: 'middle'
            //   });
              alert("매칭이 완료되었습니다. 나의 배송 목록 보기에서 상세내용을 확인해주세요!")
              // toast.onDidDismiss(() => {
              //   console.log('Dismissed toast');
              // });
            
              // toast.present();
  
        },
        function (failedResponse) {
          alert(JSON.stringify(failedResponse))
        console.log("Notification Post Failed: ", failedResponse);
        });

    }else{
      console.log(this.request);
      this.request.deliveryGuy=this.userId;
      this.afDatabase.object('/requestedList/assigned/'+this.orderNo).set(this.request);
      this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request);
      this.afDatabase.object('/requestedList/requested/'+this.orderNo).remove();
      
    //   let data={
    //                   "app_id": "2192c71b-49b9-4fe1-bee8-25617d89b4e8", 
    //            "include_player_ids": ["b36ce4e7-9210-43d0-b8fa-9c86542c384b"],
    //            "data": {"status": "assigned", "id":this.userId, "name":this.name,"foto":this.imageUrl,"distance":this.distance,"itemObject":this.request},
    //            "contents": {"en": "testtest"}
    //               }
    //               let headers = new Headers({ 'Content-Type': 'application/json' });
    //              let options = new RequestOptions({ headers: headers });
        
    //                this.http.post('https://onesignal.com/api/v1/notifications', data, options).toPromise().then((res)=>{
    //                   console.log(res.json())
    //                   alert("매칭이 완료되었습니다. 나의 배송 목록 보기에서 상세내용을 확인해주세요!")
    //               }).catch((error)=>{
    //               })
    }
    


      this.viewCtrl.dismiss();
      
  }
  cancel(){
    this.viewCtrl.dismiss();
    
  }

}
