import { Callback } from './Eventing';
import { AxiosPromise, AxiosResponse } from 'axios';

export interface HasId {
  id?: number;
}

interface ModelAttributes<T> {
  get<K extends keyof T>(key: K): T[K];
  set(value: T): void;
  getAll(): T;
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: Callback): void;
  trigger(eventName: string): void;
}

export interface IModel<T> {
  on(eventName: string, callback: Callback): void;
  trigger(eventName: string): void;
  get<K extends keyof T>(key: K): T[K];
  set(update: T): void;
  getAll(): T;
  fetch(): Promise<void>;
  save(): Promise<void>;
}


export class Model<T extends HasId> implements IModel<T> {
  private attributes: ModelAttributes<T>;
  private events: Events;
  private sync: Sync<T>;

  constructor(
    attributes: ModelAttributes<T>, 
    events: Events,
    sync: Sync<T>
  ) {
      this.attributes = attributes;
      this.events = events;
      this.sync = sync;
  }

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  get getAll() {
    return this.attributes.getAll;
  }

  set(update: T): void {
    this.attributes.set(update);
    this.trigger('change');
  }

  async fetch(): Promise<void> {
    const id = this.get('id');

    if (typeof id !== 'number') {
      throw new Error('Missing id');
    }

    const response: AxiosResponse = await this.sync.fetch(id);
    this.set(response.data);
  }

  async save(): Promise<void> {
    await this.sync.save(this.attributes.getAll());
    this.trigger('save');
  }
}