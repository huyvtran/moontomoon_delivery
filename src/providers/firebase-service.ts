import { Subscription } from 'rxjs/Rx';
import { AngularFireDatabase,    FirebaseListObservable
 } from 'angularfire2/database';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
@Injectable()
export class TimeService{
    item:FirebaseListObservable<any>;
    users:any;
    arr_key:any;
    constructor(public afd:AngularFireDatabase){
        console.log("provider!");

    }
    
    // getShoppingItems(){
    //     return new Promise<any>((resolve,reject)=>{
    //         this.afd.object('/profile/user_id').subscribe(result=>{
    //         console.log("!!!!!!!!!!!!!!!!!!!");
    //         console.log(result);
    //         console.log(Array.of(result)[0])
    //         resolve(result);
    //     }) 
    // })
    addLocation(){
      


    }
   
    getShoppingItems(){
        console.log(this.item=this.afd.list('/profile/user_id'));
        this.item=this.afd.list('/profile/user_id');
        return this.item;
    // this.afd.database.ref("profile/user_id").on('value',function(snap){
    //     snap.forEach(function(childNodes){
    //         console.log(childNodes.name);
    //     })
    }
    // this.item.subscribe(snapshots=>{
    //     snapshots.array.forEach(element => {
    //         console.log("???????????????");
    //         console.log(snapshots.key);
    //         console.log(snapshots.val());
    //     });
    // })
    //   this.afd.list('/profile/user_id').subscribe(result=>{
    //         console.log("passing")
    //         console.log(result);
    //         return result;
    //     })
      
    getLocation(){
        var count;
        var array_value=[];

        console.log("getLocation")
        this.item=this.afd.list('/Available/', { preserveSnapshot: true });
        this.item
            .subscribe(snapshots => {
                console.log("getLocation222")
                snapshots.forEach(snapshot => {
                    array_value.push(snapshot.key);
                console.log(snapshot.key)
                console.log(snapshot.val())
                });
            })
            console.log("snapshot result"+this.arr_key);
            console.log(array_value);
            return array_value;
        //  this.item.forEach(element => {
        //      console.log("getLocation333")
        //     console.log(element);
        //     return element;
        // });
        
        
    }
    addMapLocation(location:any){
        console.log("maplocal");
        console.log(location.create_date);
        location.create_date=new Date();
        let today = new Date();
        let dd:number;
        let day:string;
        let month:string;
         dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
       var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
       console.log("time:"+time);
       
        dd<10?day='0'+dd:day=''+dd;
        mm<10?month='0'+mm:month=''+mm;
        
	    let today_today = yyyy+'/'+month+'/'+day+' '+time;
  console.log(today_today);
            location.create_date=today_today;
         this.afd.list('/profile/user_id/location').push(location).then((i)=>{
             console.log("success"+i);
        }).catch((error)=>{
            alert(error);
        })
    }
    addExercise(exercise){
        console.log("exercise from home : "+exercise);
        console.log(this.afd.list('/profile/user_id'));
        //  this.afd.database.ref("profile/user_id").on('value',function(snap){
        // snap.forEach(function(childNodes){

        // })
        var count;
           this.afd.list('/profile/user_id').subscribe(result=>{
            console.log("passing")
            console.log(result.length);
            count=result.length;
        })
    console.log("count ");
    console.log(count);
    console.log((count+1))
    var id=(count+1);
      this.afd.object('profile/user_id/'+id).set(exercise)
      .then(() => alert("ssss"))
      .catch((error)=> console.log("err : "+error))
    }

    addItem(name){
        this.afd.list('/shoppingItems').push(name).then((i)=>{
        }).catch((error)=>{
            alert(error);
        })

    }
    removeItem(id){
        this.afd.list('/shoppingItems/').remove(id);
    }
}