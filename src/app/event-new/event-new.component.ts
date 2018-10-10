import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EventModel } from '../models/event.model';
import { BehaviorSubject, from, Observable, empty, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, switchMap, last, tap } from 'rxjs/operators';
import { keys } from 'lodash';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgreementModalComponent } from '../agreement-modal/agreement-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-new',
  templateUrl: './event-new.component.html',
  styleUrls: ['./event-new.component.less'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class EventNewComponent implements OnInit {

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public dateStr: string;
  public imgFileName: string;
  public file: File;
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

  constructor(
    private builder: FormBuilder,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private modalService: NgbModal,
    private router: Router,
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

  public updateFormControl(controlName: string, value: number) {
    const result = this.eventForm.controls[controlName].value + value;
    if (result >= 0) {
      this.eventForm.controls[controlName].setValue(result);
    } else {
      this.eventForm.controls[controlName].setValue(0);
    }
  }

  public changeImage(uploadEvent) {
    this.imgFileName = uploadEvent.target.files[0].name;
    this.file = uploadEvent.target.files[0];
  }

  public setTicketCurrency(curr) {
    this.event.ticket_currency = curr;
  }

  public submit() {
    const modalRef = this.modalService.open(AgreementModalComponent);
    modalRef.componentInstance.header = 'Добавление события';
    modalRef.componentInstance.text = 'Вы уверены что хотите добавить это событие?';
    modalRef.componentInstance.submit = 'Да, поехали!';

    modalRef.result
      .then(
        () => {
          this.loading$.next(true);
          this.uploadImage$()
          .pipe(
            switchMap((imgUrl: string) => this.addEvent$(this.updateEventModel(this.event), imgUrl)),
            tap(() => this.loading$.next(false)),
          )
          .subscribe((docId: string) => this.router.navigate([`/events`, docId]));
        }
      );
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
    const fileRef = this.storage.ref(`img-${ new Date().getTime() }.jpg`);
    const task = fileRef.put(this.file);
    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
    );
  }

  private addEvent$(event: EventModel, img_link: string): Observable<string> {
    return from(this.afs.collection<EventModel>('events').add({ ...event, img_link }))
      .pipe(
        map((docRef: DocumentReference) => docRef.id),
      );
  }

}
