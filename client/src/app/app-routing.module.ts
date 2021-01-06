import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainchatComponent } from './mainchat/mainchat.component';

const routes: Routes = [
  {path: '', component: MainchatComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
