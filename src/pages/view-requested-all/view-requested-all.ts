import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
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
  items:any;
  userId:string;
  shown:any;
  result=[];
  result_date=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public afd:AngularFireDatabase) {
      this.userId=this.navParams.get("userId");
       
      
      this.items=this.afd.list('/requestedList/requested', { preserveSnapshot: true })
        console.log("snapshot????????????????????????????")
        console.log(this.items);
       this.items.subscribe(snapshots=>{
        console.log(snapshots);

        snapshots.forEach(element => {
          console.log("key value");
          console.log(element.key);
            console.log(element.val());
           var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
      
    var valuesFiltered = keysFiltered.map((item)=> {
      console.log(item);
      console.log(element.val()[item]);

      this.result_date.push(element.val()[item].onlyDate)
      console.log("rrresult")
      console.log(this.result_date);
      this.result.push(element.val()[item])
        console.log(this.result);
        this.result_date=Array.from(new Set(this.result_date))
        console.log(this.result_date);
    });

        })
       })
  }

}
