import {Recipe} from "../models/recipe.model";
import {Ingredient} from "../models/ingredient.model";
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {AuthService} from "./auth.service";
import 'rxjs/Rx'

@Injectable()
export class RecipesService {

  private recipes: Recipe[] = [];

  private baseUrl: string = 'https://ionic2-recipe-book-f6445.firebaseio.com/';

  constructor(private http: Http,
              private authService: AuthService){}

  addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]){
    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
    console.log(this.recipes);
  }

  removeRecipe(index: number){
    this.recipes.splice(index, 1);
  }

  updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]) {
    this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
    console.log(this.recipes);
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const url = this.baseUrl + userId +"/recipes.json?auth="+token;
    return this.http.put(url,this.recipes)
      .map((response: Response) => {
        return response.json();
      });
  }

  fetchList(token: string){
    const userId = this.authService.getActiveUser().uid;
    const url = this.baseUrl + userId +"/recipes.json?auth="+token;
    return this.http.get(url)
      .map((response: Response) => {
        return response.json();
      })
      .do((recipes: Recipe[]) => {
        if(recipes){
          this.recipes = recipes;
        } else {
          this.recipes = [];
        }
      });
  }

}
