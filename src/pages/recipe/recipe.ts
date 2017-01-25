import { Component } from '@angular/core';
import {NavParams, NavController, ToastController} from 'ionic-angular';
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {RecipesService} from "../../services/recipes.service";
import {Recipe} from "../../models/recipe.model";
import {ShoppingListService} from "../../services/shopping-list.service";

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html'
})
export class RecipePage {

  recipe: Recipe;
  index: number;

  constructor( private navParams: NavParams,
    private navCtrl: NavController,
    private recipesService: RecipesService,
    private shoppingListService: ShoppingListService,
    private toastController: ToastController) {}

  ionViewWillEnter() {
    const data = this.navParams.data;
    this.recipe = data.recipe;
    this.index = data.index;
  }

  onAddToShoppingList() {
    this.shoppingListService.addItems(this.recipe.ingredients);
    const toast = this.toastController.create({
      message: "Ingredients added to shopping list",
      duration: 1500
    });
    toast.present();
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
