import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';

const routes: Routes = [
  { path: '', component: SearchPageComponent },
  { path:'schedule/:id', component: SchedulePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
