import { Observable, pipe, MonoTypeOperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Subscibes to the Observable and immediatly unsubcribes from it, when the first
 * value is emitted.
 * @param callback The callback function to call when subscribing
 * @returns The original Observable
 */
export function subscribeOnce<T>(
  callback?: (value?: T) => void
): MonoTypeOperatorFunction<T> {
  return (observable: Observable<T>) => {
    const sub = observable.subscribe((value?: T) => {
      sub.unsubscribe();
      callback(value);
    });
    return observable;
  };
}

/**
 * Subscribes to the Observable and unsubcribes from it, when the condition
 * callback returns false.
 * @param condition The condition to unsubscribe if false, as a callback function
 * @param callback The callback function to call when subscribing
 * @returns The original Observable
 */
export function subscribeUntil<T>(
  condition: (value?: T) => boolean,
  callback?: (value?: T) => void
): MonoTypeOperatorFunction<T> {
  return (observable: Observable<T>) => {
    const sub = observable.subscribe((value?: T) => {
      if (!condition(value)) sub.unsubscribe();
      callback(value);
    });
    return observable;
  };
}

/**
 * Changes the Observable to the one give inside of the callback function if the
 * condition callback function returns true.
 * @param condition The condition to switch to the new Observable
 * @param callback The callback function to create the new Observable
 * @returns A new Observable emitting the value from the callback function or
 * the original Observable
 */
export function switchIf<T>(
  condition: (value?: T) => boolean,
  callback?: (value?: T) => any
): MonoTypeOperatorFunction<T> {
  return pipe(
    map((value?: T) => {
      if (condition(value)) return callback(value);
      return value;
    })
  );
}
