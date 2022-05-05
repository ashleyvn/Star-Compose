import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyComponent } from './sky/sky.component';

const routes: Routes = [
  {
    path: '',
    component: SkyComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
