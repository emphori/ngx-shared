import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mapTo, merge, publishLast, share, take, tap } from 'rxjs/operators';

interface ApiClientConfig {
  host: string;
}

type Ref<T> = [Subject<T | T[]>, Observable<T | T[]>];

interface RefSpace<T> {
  collections: Set<Ref<T>>;
  items: Map<any, Array<Ref<T>>>;
}

@Injectable()
export class ApiClientService<T = {}> {
  private refs: { [refSpaceId: string]: RefSpace<T> } = {};

  constructor(
    @Inject('ApiClientConfig') public config: ApiClientConfig,
    public http: HttpClient,
  ) {}

  @memoizeApiCall
  public browse(refId: keyof T, url: string): Observable<T[]> {
    const subject = new Subject<T[]>();
    const observable = this.http.get<T[]>(url);

    return this.monitor(refId, url, subject, observable);
  }

  @memoizeApiCall
  public read(refId: keyof T, url: string, id: string): Observable<T> {
    const subject = new Subject<T>();
    const observable = this.http.get<T>(`${this.config.host}/${url}/${id}`);

    return this.monitor(refId, url, subject, observable);
  }

  public edit(refId: keyof T, url: string, id: string, payload: T): Observable<T> {
    return this.http.patch<T>(`${this.config.host}/${url}/${id}`, payload).pipe(tap(() => {
      this.update(refId, url, payload);
    }));
  }

  public add(refId: keyof T, url: string, payload: T): Observable<T> {
    const subject = new Subject<T>();
    const observable = this.http.put<T>(`${this.config.host}/${url}`, payload);

    return this.publish(refId, url, subject, observable);
  }

  public delete(url: string, id: string): Observable<void> {
    return this.http.delete(`${this.config.host}/${url}/${id}`).pipe(mapTo(null), tap(() => {
      this.remove(url, id);
    }));
  }

  private monitor(refId: keyof T, refSpaceId: string, subject: Subject<T>, observable: Observable<T>): Observable<T>;
  private monitor(refId: keyof T, refSpaceId: string, subject: Subject<T[]>, observable: Observable<T[]>): Observable<T[]>;
  private monitor(refId: keyof T, refSpaceId: string, subject: Subject<T | T[]>, observable: Observable<T | T[]>): Observable<T | T[]> {
    const refSpace = this.getRefSpace(refSpaceId);

    return observable.pipe(
      tap((docs: T | T[]) => {
        const ref: Ref<T> = [subject, observable];

        if (Array.isArray(docs)) {
          refSpace.collections.add(ref);
        }

        for (const doc of Array.isArray(docs) ? docs : [docs]) {
          if (refSpace.items.has(doc[refId])) {
            refSpace.items.get(doc[refId]).push(ref);
          } else {
            refSpace.items.set(doc[refId], [ref]);
          }
        }
      }),
      share(),
      merge(subject),
    );
  }

  private publish(refId: keyof T, refSpaceId: string, subject: Subject<T>, observable: Observable<T>): Observable<T> {
    const refSpace = this.getRefSpace(refSpaceId);

    return observable.pipe(
      tap((doc: T) => {
        refSpace.collections.forEach((ref) => {
          ref[1].pipe(take(1)).subscribe((docs) => ref[0].next(docs));
        });

        refSpace.items.set(doc[refId], [[subject, observable.pipe(publishLast())]]);
      }),
      merge(subject),
    );
  }

  private update(refId: keyof T, refSpaceId: string, payload: T): void {
    const refSpace = this.getRefSpace(refSpaceId);

    if (refSpace.items.has(payload[refId])) {
      for (const ref of refSpace.items.get(payload[refId])) {
        ref[1].pipe(take(1)).subscribe((docs) => ref[0].next(docs));
      }
    }
  }

  private remove(refSpaceId: string, id: any): void {
    const refSpace = this.getRefSpace(refSpaceId);

    if (refSpace.items.has(id)) {
      for (const ref of refSpace.items.get(id)) {
        if (refSpace.collections.has(ref)) {
          ref[1].pipe(take(1)).subscribe((docs) => ref[0].next(docs));
        }
      }

      refSpace.items.delete(id);
    }
  }

  private getRefSpace(refSpaceId: string): RefSpace<T> {
    if (!this.refs[refSpaceId]) {
      this.refs[refSpaceId] = {
        collections: new Set(),
        items: new Map(),
      };
    }

    return this.refs[refSpaceId];
  }
}

export function memoizeApiCall<T>(target: ApiClientService<T>, propertyKey: keyof ApiClientService<T>, descriptor: PropertyDescriptor) {
  const fn: any = descriptor.value;
  const cache: any = {};

  descriptor.value = function(...strings: any[]) {
    const key = strings.join();
    return cache.hasOwnProperty(key) ? cache[key] : (cache[key] = fn.apply(this, strings));
  };
}
