import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Ingredient} from "../../models/ingredient.model";
import {PopoverController, LoadingController, AlertController} from "ionic-angular";
import {AuthService} from "../../services/auth.service";
import {DatabaseOptionsPage} from "../../database-options/database-options";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {


  items: Ingredient[] = [];

  constructor(private shoppingListService: ShoppingListService,
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController ) {}

  onAddItem(form: NgForm) {
    this.shoppingListService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  ionViewWillEnter() {
   this.loadItems();
  }

  onRemoveItem(index: number){
    this.shoppingListService.removeItem(index);
    this.loadItems();
  }

  private loadItems(){
    this.items = this.shoppingListService.getItems();
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
        //when clicking outside of the popover
        if(!data){
          return;
        }
        if(data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getToken()
            .then(
              (token: string) => {
                this.shoppingListService.fetchList(token)
                  .subscribe(
                    (list: Ingredient[]) => {
                      if(list) {
                        this.items = list;
                      } else {
                        this.items = [];
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
                this.shoppingListService.storeList(token)
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
