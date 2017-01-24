import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {Recipe} from "../../models/recipe.model";
import {RecipesService} from "../../services/recipes.service";
import {RecipePage} from "../recipe/recipe";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipes: Recipe[];

  constructor(public navCtrl: NavController,
    private recipeService: RecipesService) {}

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  ionViewWillEnter() {
    this.loadRecipes();
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {
      recipe: recipe,
      index: index
    });
  }

  onDeleteRecipe(index: number) {
    this.recipeService.removeRecipe(index);
    this.loadRecipes();
  }

  onEditRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(EditRecipePage, {
      mode: 'Edit',
      recipe: recipe,
      index: index
    });
  }

  private loadRecipes() {
    this.recipes = this.recipeService.getRecipes();
  }

}
