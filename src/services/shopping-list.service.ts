import {Ingredient} from "../models/ingredient.model";

export class ShoppingListService {

  private ingredients: Ingredient[] = [];

  getItems() {
    //return a copy, not the actual array
    return this.ingredients.slice();
  }

  addItem(name: string, amount: number) {
    this.ingredients.push(new Ingredient(name, amount));
    console.log(this.ingredients);
  }

  addItems(ingredients: Ingredient[]){
    //ES6 spread operator: deconstruct array into individual elements and then push
    //them individually
    this.ingredients.push(...ingredients);
  }

  removeItem(index: number) {
    this.ingredients.splice(index, 1);
  }
}
