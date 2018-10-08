import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventItemComponent {

  public defaultImgLink = 'https://vistanews.ru/uploads/posts/2018-02/1518601887_rs_1200x800_20170213_metallica.jpg';
  @Input() public event: EventModel;

}
