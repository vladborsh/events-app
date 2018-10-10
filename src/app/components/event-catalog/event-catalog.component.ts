import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventModel } from '../../models/event.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-event-catalog',
  templateUrl: './event-catalog.component.html',
  styleUrls: ['./event-catalog.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCatalogComponent implements OnInit {

  items$: Observable<EventModel[]>;

  constructor(
    private afs: AngularFirestore,
  ) {}

  ngOnInit() {
    this.items$ = this.afs.collection<EventModel>('events').snapshotChanges()
      .pipe(
        map(events => events.map(event => ({ $key: event.payload.doc.id, ...event.payload.doc.data() }))),
      );
  }

}
