import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangeLog } from './view-change-log';

describe('ViewChangeLog', () => {
  let component: ViewChangeLog;
  let fixture: ComponentFixture<ViewChangeLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChangeLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewChangeLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
