import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RequestPage } from './../pages/request/request';
import { HomePage } from '../pages/home/home';
import { NewpagePage } from './../pages/newpage/newpage'
import { CameraselectPage } from './../pages/cameraselect/cameraselect'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  pages: Array<{title:string,component:any}>;
  activePage:any;
  constructor(platform: Platform,statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}

