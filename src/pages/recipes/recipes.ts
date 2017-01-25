import { Component } from '@angular/core';
import {NavController, PopoverController, LoadingController, AlertController} from "ionic-angular";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {Recipe} from "../../models/recipe.model";
import {RecipesService} from "../../services/recipes.service";
import {RecipePage} from "../recipe/recipe";
import {AuthService} from "../../services/auth.service";
import {DatabaseOptionsPage} from "../../database-options/database-options";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipes: Recipe[];

  constructor(public navCtrl: NavController,
              private recipeService: RecipesService,
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {}

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

  onShowOptions(event) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({
      ev: event
    });
    popover.onDidDismiss(
      data => {
        if(data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.recipeService.fetchList(token)
                  .subscribe(
                    (list: Recipe[]) => {
                      if(list) {
                        this.recipes = list;
                      } else {
                        this.recipes = [];
                      }
                      loading.dismiss();
                    },
                    error => {
                      loading.dismiss();
                      this.handleError(error.json().error);
                    }
                  );
              }
            )
            .catch()
        } else if(data.action == 'store') {
          loading.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.recipeService.storeList(token)
                  .subscribe(
                    () => loading.dismiss(),
                    error => {
                      this.handleError(error.json().error)
                    }
                  );
              }
            )
            .catch()
        }
      }
    )
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
