import {Ingredient} from "../models/ingredient.model";
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {AuthService} from "./auth.service";
import 'rxjs/Rx'

@Injectable()
export class ShoppingListService {

  private baseUrl: string = 'https://ionic2-recipe-book-f6445.firebaseio.com/';

  private ingredients: Ingredient[] = [];

  constructor(private http: Http,
    private authService: AuthService) {}
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

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const url = this.baseUrl + userId +"/shopping-list.json?auth="+token;
    return this.http.put(url,this.ingredients)
      .map((response: Response) => {
        return response.json();
      });
  }

  fetchList(token: string){
    const userId = this.authService.getActiveUser().uid;
    const url = this.baseUrl + userId +"/shopping-list.json?auth="+token;
    return this.http.get(url)
      .map((response: Response) => {
        return response.json();
      })
      .do((ingredients: Ingredient[]) => {
        if(ingredients){
          this.ingredients = ingredients;
        } else {
          this.ingredients = [];
        }
      });
  }
}
