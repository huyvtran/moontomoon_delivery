import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Content,NavController, NavParams } from 'ionic-angular';
import { Chatting } from '../../components/models/chatting';
import { AngularFireDatabase } from 'angularfire2/database';
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
  ionViewWillEnter():void{
  //  this.scrollToBottom();
  }
  ionViewDidLoad(){
    
  }
  
  constructor(public afDatabase : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    this.item=this.navParams.get("item");
    this.deliveryGuy=this.item.user;
    this.deliveryGuy="kotran"

    this.chatContent=this.afDatabase.list('message/'+this.item.orderNo, { preserveSnapshot: true })
    
    this.chatContent.subscribe(snapshots=>{
      snapshots.forEach(element => {
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

    this.items=this.afDatabase.list('profile/', { preserveSnapshot: true })
    this.items.subscribe(snapshots=>{
      snapshots.forEach(element => {
        console.log("element")

        var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
        
       var valuesFiltered = keysFiltered.map((item)=> {
           console.log(item);
           console.log(element.val()[item]);
           if(item=="id"){
            if(element.val()[item]==this.deliveryGuy){
              this.image=element.val()["foto"]
            }else{
              
            }
           }
           
        
       });
      

      });
    })

  }
  
  entered(){
    this.chatMsg=[];
    this.chat_date=[];
    this.chat.content=this.contents;
    this.chat.id=this.userId;
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
  }
  

}
