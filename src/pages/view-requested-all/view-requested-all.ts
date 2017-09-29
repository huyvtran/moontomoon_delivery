import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams,Platform ,ToastController} from 'ionic-angular';
import { HomePage } from './../home/home';
import { ChatPage } from './../chat/chat';
import { request } from './../../components/models/request';
/**
 * Generated class for the ViewRequestedAllPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-view-requested-all',
  templateUrl: 'view-requested-all.html',
})
export class ViewRequestedAllPage {
  order:any;
  rmodel:any;
  dateA:any;
  dateB:any;
  items:any;
  userId:string;
  shown:any;
  foto:string;
  result=[];
  request={} as request
  profiles:any;
  result_date=[];
  result_rating=[];
  uid:string
  constructor(public toast:ToastController,public platform:Platform, public afDatabase: AngularFireDatabase, public navCtrl: NavController,public viewCtrl:ViewController ,public navParams: NavParams,public afd:AngularFireDatabase) {
    var id=localStorage.getItem("id");

    this.foto=localStorage.getItem("foto")
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }

      this.uid="KmXYVcVfOxUICaD8yZfXsdRvgPx1";
  
   this.items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
     console.log("snapshot????????????????????????????")
     console.log(this.items);
    this.items.subscribe(snapshots=>{
     console.log(snapshots);
  
     snapshots.forEach(element => {
       console.log("key value");
         if(element.val().status=="finished"){
          if(element.val().deliveryGuy==this.userId){
          
            this.result_date.push(element.val().onlyDate);
            this.result.push(element.val());
            this.result_date=Array.from(new Set(this.result_date))
          }
         }
       console.log(element.key);
         console.log(element.val());
        
  
  
     })
    })
  }
  chat(itemObject){
    this.navCtrl.push(ChatPage,{item:itemObject})
  }
  confirm(itemObject){
    this.request=itemObject;
    this.request.status="finished";
    this.afDatabase.object('/requestedList/assigned/'+itemObject.orderNo).remove();
    this.afDatabase.object('/requestedList/finished/'+itemObject.orderNo).set(this.request);
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

    var notificationObj = {title:{en:"배달원 완료"}, contents: {en:"클릭하시면 기사분 평점/리뷰를 남기실 수 있습니다."},
    "data": {"status": "finished", "id":this.userId,"foto":this.foto,"time": todaywithTime,"uid":itemObject.uid,"orderno":itemObject.orderNo},
    include_player_ids: [itemObject.tokenId]};
    if(this.platform.is('android')){
      window["plugins"].OneSignal.postNotification(notificationObj,
          (successResponse)=> {
              
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

  }
     
  }
  getList(value){
    this.result_date=[];
    this.result=[];
    this.items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
    this.items.subscribe(snapshots=>{
   
        
     snapshots.forEach(element => {
         if(element.val().user==this.userId){
          this.result_date.push(element.val().onlyDate);
          this.result.push(element.val());
          this.result_date=Array.from(new Set(this.result_date))
        }
     })
     console.log("date!!")
     console.log(this.result_date);
     

     console.log(this.result_date)
    })
    if(value=="old"){
      this.result_date.sort(function(a,b){
        let dateA = +new Date(a);
         let dateB = +new Date(b);
       console.log(dateA);
       console.log(dateB);
        return dateA-dateB;
      })
    }else if(value=="new"){
      this.result_date.sort(function(a,b){
        let dateA = +new Date(a);
         let dateB = +new Date(b);
       console.log(dateA);
       console.log(dateB);
        return dateB-dateA;
      })
    }
  }
  orderchanged(){
    if(this.order!=undefined){

      this.getList(this.order);
    }
  }
  viewPickup(){
   this.sorting("pickup");
  }
  viewRequested(){
    this.sorting("requested");
  }
  viewAssigned(){
    this.sorting("assigned");
  }
  viewFinished(){
    this.sorting("finished")
  }
  changed(){
    switch (this.rmodel) {
      case "pickup":
        this.sorting("pickup")
        break;
      case "requested":
        this.sorting("requested");
        break;
      case "assigned":
        this.sorting("assigned");
        break;
      case "finished":
       this.sorting("finished")
       break;
      default:
        break;
    }
  }
  sorting(value){
    this.result_date=[];
    this.result=[];
    var items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
    console.log("snapshot????????????????????????????")
   items.subscribe(snapshots=>{
    console.log(snapshots);
 
    snapshots.forEach(element => {
      console.log("key value");
      console.log(element.key);
        console.log(element.val());
        console.log(element.val().user+",,,"+this.userId);
        if(element.val().user==this.userId&&element.val().status==value){
         this.result_date.push(element.val().onlyDate);
         this.result.push(element.val());
         this.result_date=Array.from(new Set(this.result_date))
       }
    })
   })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRequestListPage');
  }


}
