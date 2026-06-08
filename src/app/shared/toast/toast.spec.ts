import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toast } from './toast';
import { NotificationService } from '../notification.service';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an active notification', () => {
    const notifications = TestBed.inject(NotificationService);
    notifications.info('hello there');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('hello there');
  });
});
