import { Injectable } from '@angular/core';
@Injectable()
export class TimeService{
    
    constructor(){
        console.log("TimeService!");

    }
    getTime(){
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

        return todaywithTime;
    }
}