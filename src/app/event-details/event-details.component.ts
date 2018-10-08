import { Component, OnInit } from '@angular/core';
import { EventModel } from '../models/event.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.less']
})
export class EventDetailsComponent implements OnInit {

  public event$: Observable<EventModel>;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.event$ = this.route.params.pipe(
        switchMap(p => this.afs.doc<EventModel>(`events/${p.id}`).valueChanges()),
     );
  }

}
