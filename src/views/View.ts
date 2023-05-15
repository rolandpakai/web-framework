import { Model, IModel, HasId } from '../models/Model';

export abstract class View<T extends IModel<K>, K extends HasId> {
  parent: Element;
  model: T;
  regions: { [key: string]: Element } = {};

  abstract template(): string;

  constructor(parent: Element, model: T) {
    this.parent = parent;
    this.model = model;
    this.bindModel();
  }

  regionsMap(): { [key: string]: string } {
    return {};
  }

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    for (let key in regionsMap) {
      const selector = regionsMap[key];
      const element = fragment.querySelector(selector);

      if (element) {
        this.regions[key] = element;
      }
    }
  }

  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  bindModel(): void {
    this.model.on('change', () => {
      this.render();
    })
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(':');

      fragment.querySelectorAll(selector).forEach(element => {
        element.addEventListener(eventName, eventsMap[eventKey], false);
      });
    }
  }

  onRender(): void {
    
  }

  render(): void {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);

    this.onRender();

    if (this.parent) {
      this.parent.innerHTML = '';
      this.parent.append(templateElement.content);
    }
  }
}