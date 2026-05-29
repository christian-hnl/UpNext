import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMember } from './session-member';

describe('SessionMember', () => {
  let component: SessionMember;
  let fixture: ComponentFixture<SessionMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
