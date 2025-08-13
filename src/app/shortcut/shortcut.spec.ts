import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shortcut } from './shortcut';

describe('Shortcut', () => {
  let component: Shortcut;
  let fixture: ComponentFixture<Shortcut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shortcut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shortcut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
