import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a millisecond duration as "m:ss" (e.g. 215000 -> "3:35").
 * Falsy/unknown values render as "0:00".
 */
@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(ms: number | undefined | null): string {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
