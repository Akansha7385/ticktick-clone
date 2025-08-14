import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMenu } from './task-menu';

describe('TaskMenu', () => {
  let component: TaskMenu;
  let fixture: ComponentFixture<TaskMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
