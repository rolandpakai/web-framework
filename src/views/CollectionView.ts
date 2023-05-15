import { Collection } from "../models/Collection";

export abstract class CollectionView<T, K> {
  parent: Element;
  collection: Collection<T, K>;

  constructor(parent: Element, collection: Collection<T, K>) {
    this.parent = parent;
    this.collection = collection;
  }

  abstract renderItem(model: T, itemParent: Element): void;

  render(): void {
    this.parent.innerHTML = '';
    const templateElement = document.createElement('template');

    for (let model of this.collection.models) {
      const itemParent = document.createElement('div');
      this.renderItem(model, itemParent);
      templateElement.content.append(itemParent);
    }

    this.parent.append(templateElement.content);
  }
}