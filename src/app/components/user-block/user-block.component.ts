import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-user-block',
  templateUrl: './user-block.component.html',
  styleUrls: ['./user-block.component.less']
})
export class UserBlockComponent implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.afAuth.user.subscribe(val => {});
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }

}
