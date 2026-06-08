import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('adds an error toast', () => {
    service.error('boom');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0]).toMatchObject({ kind: 'error', text: 'boom' });
  });

  it('dismisses a toast by id', () => {
    service.success('ok');
    const id = service.toasts()[0].id;
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });
});
