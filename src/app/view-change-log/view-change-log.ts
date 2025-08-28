import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-change-log',
  imports: [],
  templateUrl: './view-change-log.html',
  styleUrls: ['./view-change-log.css']
})
export class ViewChangeLog {
 @Input() visible: boolean = true;
  @Output() visibleChange = new EventEmitter<boolean>();
}
