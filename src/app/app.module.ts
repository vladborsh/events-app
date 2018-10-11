import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.module.routing';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MainComponent } from './pages/main/main.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { EventCatalogComponent } from './components/event-catalog/event-catalog.component';
import { LoginComponent } from './pages/login/login.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { UserBlockComponent } from './components/user-block/user-block.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventNewComponent } from './event-new/event-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { AgreementModalComponent } from './agreement-modal/agreement-modal.component';
import { PaymentService } from './services/payment.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavigationComponent,
    EventCatalogComponent,
    LoginComponent,
    EventItemComponent,
    UserBlockComponent,
    EventDetailsComponent,
    EventNewComponent,
    LoaderComponent,
    AgreementModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [
    PaymentService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AgreementModalComponent],
})
export class AppModule { }
