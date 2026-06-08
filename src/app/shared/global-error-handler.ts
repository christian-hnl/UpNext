import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';

/**
 * Catches any error that isn't handled locally, logs the technical detail for
 * developers and shows the user one friendly, non-cryptic message.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notifications = inject(NotificationService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);

    // NG0100 (ExpressionChangedAfterItHasBeenChecked) is a development-mode-only
    // diagnostic from Angular — it never occurs in production builds and breaks
    // nothing. Log it quietly, but don't spam the user with a toast.
    if (message.includes('NG0100') || message.includes('ExpressionChanged')) {
      console.warn('[GlobalError] dev-only diagnostic:', message);
      return;
    }

    console.error('[GlobalError]', error);
    this.notifications.error('Etwas ist schiefgelaufen. Bitte versuche es erneut.');
  }
}
