import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { EventCatalogComponent } from './components/event-catalog/event-catalog.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventNewComponent } from './event-new/event-new.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'events', component: EventCatalogComponent },
      { path: 'events/:id', component: EventDetailsComponent },
      { path: 'events-new', component: EventNewComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
