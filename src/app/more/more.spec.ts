import { ComponentFixture, TestBed } from '@angular/core/testing';

import { More } from './more';

describe('More', () => {
  let component: More;
  let fixture: ComponentFixture<More>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [More]
    })
    .compileComponents();

    fixture = TestBed.createComponent(More);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
