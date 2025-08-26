import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Next7Days } from './next7-days';

describe('Next7Days', () => {
  let component: Next7Days;
  let fixture: ComponentFixture<Next7Days>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Next7Days]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Next7Days);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
