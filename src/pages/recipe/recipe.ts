import { Component } from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';
import {Ingredient} from "../../models/ingredient.model";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {RecipesService} from "../../services/recipes.service";
import {Recipe} from "../../models/recipe.model";

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html'
})
export class RecipePage {

  recipe: Recipe;
  index: number;

  constructor( private navParams: NavParams,
    private navCtrl: NavController,
    private recipesService: RecipesService) {}

  ionViewWillEnter() {
    const data = this.navParams.data;
    this.recipe = data.recipe;
    this.index = data.index;
  }

  onAddToShoppingList() {

  }

  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {
      mode: 'Edit',
      recipe: this.recipe
    });
  }

  onDeleteRecipe() {
    this.recipesService.removeRecipe(this.index);
    this.navCtrl.pop();
  }

}
