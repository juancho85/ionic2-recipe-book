import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController, ToastController, NavController} from 'ionic-angular';
import {FormGroup, FormControl, Validators, FormArray, FormBuilder} from "@angular/forms";
import {RecipesService} from "../../services/recipes.service";
import {Recipe} from "../../models/recipe.model";
import {Ingredient} from "../../models/ingredient.model";

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html'
})
export class EditRecipePage implements OnInit {

  mode: string = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private recipesService: RecipesService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit'){
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }

    this.initializeForm();
  }

  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];


    if(this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      //array of form controls
      for(let ingredient of this.recipe.ingredients){
        ingredients.push(this.getIngredientFormGroup(ingredient));
      }
    }


    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  private getIngredientFormGroup(ingredient: Ingredient): FormGroup{
    const formGroup = this.formBuilder.group({
      name: new FormControl(ingredient.name, Validators.required),
      amount: new FormControl(ingredient.amount, Validators.required)
    });

    return formGroup;
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      title: 'What do you want to do',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = (<FormArray>this.recipeForm.get('ingredients'));
            const len = fArray.length;
            if(len > 0) {
              for(let i = len - 1; i>=0; i--){
                fArray.removeAt(i);
              }
              this.showToast('All ingredients were deleted!');
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert() {
    return this.alertController.create({
      title: 'Add ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'amount',
          placeholder: 'Amount'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            //data.name references the name value in the input array
            if(data.name == null || data.name.trim() == ''){
              this.showToast('Please provide a valid ingredient!');
              return;
            }
            (<FormArray>this.recipeForm.get('ingredients'))
              .push(this.getIngredientFormGroup(new Ingredient(data.name, data.amount)));
            console.log(this.recipeForm);
            this.showToast('Ingredient added!');
          }
        }
      ]
    })
  }

  private showToast(message: string) {
    const toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  onSubmit() {
    const value = this.recipeForm.value;
    let ingredients = [];
    if(this.mode=='Edit'){
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, value.ingredients)
    }else{
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, value.ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  debug(formGroup: FormGroup){
    console.log(formGroup['name'].value);
    console.log(formGroup.value);
  }




}
