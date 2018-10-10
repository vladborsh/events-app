import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agreement-modal',
  templateUrl: './agreement-modal.component.html',
  styleUrls: ['./agreement-modal.component.less']
})
export class AgreementModalComponent implements OnInit {

  @Input() public header: string;
  @Input() public text: string;
  @Input() public submit: string;

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {}

}
