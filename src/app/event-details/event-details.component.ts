import { Component, OnInit, HostListener } from '@angular/core';
import { EventModel } from '../models/event.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { PaymentService } from '../services/payment.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.less']
})
export class EventDetailsComponent implements OnInit {

  public event$: Observable<EventModel>;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  handler: any;
  amount: 500;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.loading$.next(true);
    this.event$ = this.route.params.pipe(
      switchMap(p => this.afs.doc<EventModel>(`events/${p.id}`).valueChanges()),
      tap(() => this.loading$.next(false)),
    );
    this.handler = StripeCheckout.configure({
      key: environment.stripeToken,
      locale: 'auto',
      token: token => this.paymentService.processPayment(token, this.amount),
    });
  }

  public handlePayment() {
    this.handler.open({
      name: 'Starter',
      description: 'Starter description',
      amount: this.amount,
    });
  }

  @HostListener('window:popstate')
  public onpopstate() {
    this.handler.close();
  }

}
