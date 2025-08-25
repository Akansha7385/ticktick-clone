import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkParent } from './link-parent';

describe('LinkParent', () => {
  let component: LinkParent;
  let fixture: ComponentFixture<LinkParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkParent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkParent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
