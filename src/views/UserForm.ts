import { View } from "./View";
import { User, UserProps } from "../models/User";

export class UserForm extends View<User, UserProps> {

  eventsMap(): { [key: string]: () => void } {
    return {
      'click:button.set-name': this.onSetNameButtonClick,
      'click:button.set-age': this.onSetAgeButtonClick,
      'click:button.save-model': this.onSaveButtonClick,
    }
  }

  onSetNameButtonClick = () => {
    if (this.parent) {
      const input = this.parent.querySelector('input');

      if (input) {
        const name = input.value;
        this.model.set({ name });
      }
    }
  }

  onSetAgeButtonClick = (): void =>{
    this.model.setRandomAge();
  }

  onSaveButtonClick = (): void => {
    this.model.save();
  }

  template(): string {
    return `
      <div>
        <input placeholder="${this.model.get('name')}"/>
        <button class="set-name">Update Name</button>
        <button class="set-age">Set Random Age</button>
        <button class="save-model">Save</button>
      </div>
    `;
  }
}