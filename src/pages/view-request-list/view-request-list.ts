import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams,Platform ,ToastController} from 'ionic-angular';
import { HomePage } from './../home/home';
import { ChatPage } from './../chat/chat';
import { request } from './../../components/models/request';

import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the ViewRequestListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-view-request-list',
  templateUrl: 'view-request-list.html',
})
export class ViewRequestListPage {
  order:any;
  rmodel:any;
  dateA:any;
  dateB:any;
  notification=[];
  viewStyle_map=true;
  items:any;
  userId:string;
  shown:any;
  foto:string;
  result=[];
  request={} as request
  result_date=[];
  uid:string;
  constructor(private callNumber: CallNumber,public toast:ToastController,public platform:Platform, public afDatabase: AngularFireDatabase, public navCtrl: NavController,public viewCtrl:ViewController ,public navParams: NavParams,public afd:AngularFireDatabase) {
    var id=localStorage.getItem("id");

    this.foto=localStorage.getItem("foto")
    this.uid=this.navParams.get("uid")
    if(this.uid==undefined){
      this.uid="KmXYVcVfOxUICaD8yZfXsdRvgPx1"
    }

    var getFotos=this.afDatabase.list('profile/'+this.uid, { preserveSnapshot: true })
    getFotos.subscribe(snapshots=>{
      snapshots.forEach(element => {
        console.log("element")
        
        if(element.key==="id"){
            this.userId=element.val();
        }
        
       
      

      });
    })
    
   this.items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
     console.log("snapshot????????????????????????????")
     console.log(this.items);
    this.items.subscribe(snapshots=>{
     console.log(snapshots);
      this.result_date=[];
      this.result=[];
     snapshots.forEach(element => {
       console.log("key value");
       console.log(element.key);
         console.log(element.val());
         if(element.val().deliveryGuy==this.userId){
          this.result_date.push(element.val().onlyDate);
          this.result.push(element.val());
          this.result_date=Array.from(new Set(this.result_date))

          //내가 배달 하는 모든 리스트를 불러옴. 
          //여기서 받은 오더번호를 가지고 메세지 노드에서 해당 오더번호의 모든 메세지를 
          //루프돈후, 아이디가 내가 아닌것의 read_flag를 확인
          //하여서 안읽은 것이 있으면 카운트를 늘려줌. 그래서 array에 push한다. 
          var eleOrderNo=element.val().orderNo;
          var messagenode=this.afd.list('/message/'+element.val().orderNo , { preserveSnapshot: true })
          messagenode.subscribe(snapshots=>{
            var count=0;
            snapshots.forEach(elements=>{
              console.log(element.val().orderNo+"!!!!"+elements.val().id+"!!!!"+this.userId);
              console.log("!?!?!?!"+element.val().orderNo);
              if(elements.val().id!=this.userId){
                if(elements.val().read_flag=="false"){

                  count++;
                }

                console.log(elements.val().read_flag)
              }
            })
            console.log(this.notification)
            for(var i=0; i<this.notification.length; i++){
              if(this.notification[i].orderNo==element.val().orderNo){
                console.log(i+"번째 삭제")
                this.notification.splice(i,1);
              }
            }
            this.notification.push({"orderNo":element.val().orderNo,"value":count});
            this.notification=Array.from(new Set(this.notification))
            
         })
        

        }
 
  
     })
     console.log(this.result);

    })
  }
  call(itemObject){
    alert(itemObject.phone);
    this.callNumber.callNumber(itemObject.phone, true)
    .then(() => alert('Launched dialer!'))
    .catch((ee) => alert('Error launching dialer'+ee));
  }
  chat(itemObject){
    console.log(itemObject);
    this.navCtrl.push(ChatPage,{item:itemObject})
  }
  pickup(itemObject){
    //픽업완료후 픽업완료  버튼을 눌렀을때, 

    this.request=itemObject;
    this.request.status="pickup";
    this.afDatabase.object('/requestedList/assigned/'+itemObject.orderNo).remove();
    this.afDatabase.object('/requestedList/pickup/'+itemObject.orderNo).set(this.request);
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

    var notificationObj = {title:{en:"픽업하였습니다."}, contents: {en:"픽업이 완료되었으며, 배달완료 시간에 대한 안내가 곧 이어집니다."},
    "data": {"status": "pickup", "id":this.userId,"foto":this.foto,"time": todaywithTime,"itemObject":itemObject},
    include_player_ids: [itemObject.tokenId]};
    if(this.platform.is('android')){
      window["plugins"].OneSignal.postNotification(notificationObj,
          (successResponse)=> {
            this.getList("new");
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
    alert("not applicable on web. ")
    this.getList("new");
  }
  }
  confirm(itemObject){
    
    //배달완료 버튼을 눌렀을때, 

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

    var notificationObj = {title:{en:"배달 완료"}, contents: {en:"클릭하시면 기사분 평점/리뷰를 남기실 수 있습니다."},
    "data": {"status": "finished", "id":this.userId,"foto":this.foto,"time": todaywithTime,"itemObject":itemObject},
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
    alert("not applicable on web. ")
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
  goBack(){
    this.navCtrl.setRoot(HomePage)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRequestListPage');
  }

}
