import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Content,NavController, ModalController,NavParams } from 'ionic-angular';
import { Chatting } from '../../components/models/chatting';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';
import firebase from 'firebase';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { BigpicturePage } from '../bigpicture/bigpicture'
import { CameraselectPage} from '../cameraselect/cameraselect';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  
})
export class ChatPage {
  ngAfterViewChecked(){
  }
  picurl:any;
  mypicref:any;
  picdata:any;
  deliveryGuy:string;
  items:any;
  image:any;
  item:any;
  chatMsg=[];
  chat_date=[];
  chatContent:any;
  contents:string;
  chat={} as Chatting
  userId:string;
  uid:string;
  ionViewWillEnter():void{
  }
  ionViewDidLoad(){
  }
  constructor(public modal:ModalController,private camera: Camera,public afDatabase : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.mypicref=firebase.storage().ref('/');
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }

    this.item=this.navParams.get("item");
    this.uid=this.item.uid;
    this.deliveryGuy=this.item.deliveryGuy;
    this.chatContent=this.afDatabase.list('message/'+this.item.orderNo, { preserveSnapshot: true })
    this.chatContent.subscribe(snapshots=>{
      snapshots.forEach(element => {
        element.val().userId=this.userId;
        this.chatMsg.push(element.val())
        this.chat_date.push(element.val().created_date.substring(0,10))
      //   var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
      //  var valuesFiltered = keysFiltered.map((item)=> {
      //      console.log(item);
      //      console.log(element.val()[item]);
      //      if(item=="id"){
      //       if(element.val()[item]==this.deliveryGuy){
      //         this.image=element.val()["foto"]
      //       }else{
              
      //       }
      //      }
      //  });
      });
      this.chat_date= this.chat_date.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    })
    })

    this.items=this.afDatabase.list('profile/'+this.uid, { preserveSnapshot: true })
    this.items.subscribe(snapshots=>{
      snapshots.forEach(element => {
        console.log("element")
        if(element.key==="foto"){
          this.image=element.val();
        }
       
      

      });
    })

  }
  clicked(image){
    let modal = this.modal.create(BigpicturePage,{"image":image});
            modal.onDidDismiss(data => {
            });
            modal.present();
  }
  async getFoto(){
    try{
      const options : CameraOptions={
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType:this.camera.DestinationType.DATA_URL,     
        quality: 50,
        targetWidth: 600,
        targetHeight: 600,
        encodingType: this.camera.EncodingType.JPEG,      
        correctOrientation: true
      }
      this.camera.getPicture(options)
      .then(file_uri => {this.picdata = file_uri; 
        this.mypicref.child(this.uidd()).child('pic.png')
        .putString(this.picdata,'base64',{contentType:'image/jpeg'})
        .then(savepic=>{
          this.picurl=savepic.downloadURL
          this.chatMsg=[];
          
          this.chat_date=[];
          this.chat.content=this.picurl;
          this.chat.id=this.item.user;
          this.chat.type="foto";
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
          
          this.chat.created_date=todayWithTime;
          this.chat.onlydate=todayWithTime.substring(0,10)
          this.afDatabase.list("message/"+this.item.orderNo+"/").push(this.chat);
    
        }).catch(error=>{
          alert(error);
          alert(error.message);
          alert(error.code);
        })
      })  
      


    }catch(e){
      alert(e.message);
      alert(e.code);
      console.log("error "+e);
    }
  }
  async takeFoto(){

    let modal = this.modal.create(CameraselectPage);
    modal.onDidDismiss(data => {
      this.picdata=data.data;
      this.upload();
    });
    modal.present();
   
    
  }
  upload(){
    this.mypicref.child(this.uidd()).child('pic.png')
    .putString(this.picdata,'base64',{contentType:'image/jpeg'})
    .then(savepic=>{
      this.picurl=savepic.downloadURL
      this.chatMsg=[];
      this.chat_date=[];
      this.chat.content=this.picurl;
      this.chat.id=this.item.user;
      this.chat.type="foto";
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
      
      this.chat.created_date=todayWithTime;
      this.chat.onlydate=todayWithTime.substring(0,10)
      this.afDatabase.list("message/"+this.item.orderNo+"/").push(this.chat);

    }).catch(error=>{
      alert(error);
      alert(error.message);
      alert(error.code);
    })

  }
  uidd(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  entered(){
    this.chatMsg=[];
    this.chat_date=[];
    this.chat.content=this.contents;
    this.chat.id=this.item.user;
    let today = new Date();
    let dd:number;
    let day:string;
    let month:string;
    this.chat.type="string"
    dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
    dd<10?day='0'+dd:day=''+dd;
    mm<10?month='0'+mm:month=''+mm;
    let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
    
    this.chat.created_date=todayWithTime;
    this.chat.onlydate=todayWithTime.substring(0,10)
    this.afDatabase.list("message/"+this.item.orderNo+"/").push(this.chat); 
  }
  

}
