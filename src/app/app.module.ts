import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {TabsPage} from "../pages/tabs/tabs";
import {ShoppingListPage} from "../pages/shopping-list/shopping-list";
import {RecipePage} from "../pages/recipe/recipe";
import {RecipesPage} from "../pages/recipes/recipes";
import {EditRecipePage} from "../pages/edit-recipe/edit-recipe";
import {ShoppingListService} from "../services/shopping-list.service";
import {RecipesService} from "../services/recipes.service";
import {SigninPage} from "../pages/signin/signin";
import {SignupPage} from "../pages/signup/signup";
import {AuthService} from "../services/auth.service";
import {DatabaseOptionsPage} from "../database-options/database-options";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    ShoppingListPage,
    RecipePage,
    RecipesPage,
    EditRecipePage,
    SigninPage,
    SignupPage,
    DatabaseOptionsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ShoppingListPage,
    RecipePage,
    RecipesPage,
    EditRecipePage,
    SigninPage,
    SignupPage,
    DatabaseOptionsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ShoppingListService, RecipesService, AuthService]
})
export class AppModule {}
