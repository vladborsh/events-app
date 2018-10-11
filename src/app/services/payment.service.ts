import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  userId: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.afAuth.user.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
      }
    });
  }

  public processPayment(token: any, amount) {
    this.afs.doc<any>(`payment/${this.userId}`).update({ token, amount });
  }
}
