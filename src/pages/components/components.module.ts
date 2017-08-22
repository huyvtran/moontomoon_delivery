import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsPage } from './components';

@NgModule({
  declarations: [
    ComponentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComponentsPage),
  ],
  exports: [
    ComponentsPage
  ]
})
export class ComponentsPageModule {}
