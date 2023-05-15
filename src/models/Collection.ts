import axios, { AxiosResponse } from 'axios';
import { Eventing } from './Eventing';

export class Collection<T, K> {
  rootUrl: string;
  models: T[] = [];
  events: Eventing = new Eventing();
  deserialize: (json: K) => T;

  constructor(rootUrl: string, deserialize: (json: K) => T) {
    this.rootUrl = rootUrl;
    this.deserialize = deserialize;
  }

  get on() {
    return this.events.on;
  }

  get trigger() { 
    return this.events.trigger;
  }

  async fetch(): Promise<void> {
    const response: AxiosResponse = await axios.get(this.rootUrl);
    
    response.data.forEach((value: K) => {
      this.models.push(this.deserialize(value));
    });

    this.trigger('change');
  } 
}