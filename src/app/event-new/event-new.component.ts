import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EventModel } from '../models/event.model';
import { BehaviorSubject, from, Observable, empty, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, switchMap, last } from 'rxjs/operators';
import { keys } from 'lodash';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-new',
  templateUrl: './event-new.component.html',
  styleUrls: ['./event-new.component.less'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class EventNewComponent implements OnInit {

  public dateStr: string;
  public event: EventModel;
  public eventForm: FormGroup = this.builder.group({
    name: new FormControl('', [Validators.required]),
    short_description: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    number_of_seats: new FormControl(0, [Validators.required]),
    date: new FormControl('', [Validators.required]),
    ticket_price: new FormControl(0, [Validators.required]),
    type: new FormControl('event', [Validators.required]),
  });
  public img$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private builder: FormBuilder,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
  ) {}

  ngOnInit() {
    this.event = {
      name: '',
      description: '',
      short_description: '',
      img_link: '',
      date: 0,
      type: '',
      ticket_currency: 'UAH',
      ticket_price: 0,
      number_of_seats: 0,
    };
  }

  public upload(uploadEvent) {
    const reader = new FileReader();
    reader.onload = e => {
      this.img$.next(reader.result as string);
    };
    reader.readAsDataURL(uploadEvent.target.files[0]);
    this.img$.next(uploadEvent.target.files[0]);
  }

  public setTicketCurrency(curr) {
    this.event.ticket_currency = curr;
  }

  public submit() {
    this.uploadImage$()
      .pipe(
        switchMap((imgUrl: string) => this.addEvent$(this.updateEventModel(this.event), imgUrl))
      )
      .subscribe();
  }

  private updateEventModel(event: EventModel): EventModel {
    keys(this.eventForm.controls).forEach((key: string) => {
        event[key] = (key === 'date')
          ? new Date(this.eventForm.controls[key].value).getTime()
          : event[key] = this.eventForm.controls[key].value;
      }
    );

    return event;
  }

  private uploadImage$(): Observable<string> {
    const imgContent = this.img$.getValue();
    if (!imgContent) {
      return of('');
    }
    const fileRef = this.storage.ref(`img-${ new Date().getTime() }.jpg`);
    const task = fileRef.putString(imgContent);
    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
    );
  }

  private addEvent$(event: EventModel, img_link: string): Observable<string> {
    return from(this.afs.collection<EventModel>('events').add({...event, img_link}))
      .pipe(
        map((docRef: DocumentReference) => docRef.id),
      );
  }

  private mapIdToImgPath(id: string): string {
    return `${id}-img`;
  }

}
