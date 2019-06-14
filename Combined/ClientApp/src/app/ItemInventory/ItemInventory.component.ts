import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ItemInventory',
  templateUrl: './ItemInventory.component.html'
})
export class ItemInventoryDataComponent {
  isDisabled = false;
  public itemInventoryDataModel = {
    ItemInventoryID: null,
    ItemID: "",
    ItemQuantity: "",
    ItemRate: "",
    ItemName: "",
    CreateDate: 0
  };

   public UpdateItemModel = {
    ItemInventoryId: 0,
    ItemQuantity: 0,
     ItemRate: 0,
  };

  public items: GetItems[];
  public itemsInventory: GetItemsInventory[];
  private _baseUrl: string;
  private _http: HttpClient;

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    http.get<GetItems[]>(apiUrl + 'Values/GetItems').subscribe(result => {
      this.items = result;
      console.log(this.items);
    }, error => console.error(error));


    http.get<GetItemsInventory[]>(apiUrl + 'Values/GetItemsInventory').subscribe(result => {
      this.itemsInventory = result;
      console.log(this.itemsInventory);
    }, error => console.error(error));


    this._baseUrl = apiUrl;
    this._http = http;
    this.itemInventoryDataModel = {
      ItemInventoryID: 0,
      ItemQuantity: "",
      ItemRate: "",
      ItemID: "",
      ItemName: "",
      CreateDate:0
    };
    this.GetTable();
  }

  GetTable() {
    this._http.get<GetItemsInventory[]>(this._baseUrl + 'Values/GetItemsInventory').subscribe(result => {
      this.itemsInventory = result;
      console.log(this.itemsInventory);
    }, error => console.error(error));

  }


  SaveItemInventory() {
    this.isDisabled = true;
    this._http.post<PostItemInventory>(this._baseUrl + 'values/SaveItemInventory', this.itemInventoryDataModel).subscribe(result => {
      alert("Saved Successfully");
      this.isDisabled = false;
      this.GetTable();
      console.log("Error");
    }, error => console.error(error));
  }

  Update() {
    this._http.post<UpdateItemModel>(this._baseUrl + 'values/UpdateItemInventory', this.UpdateItemModel).subscribe(result => {
      alert("Updated Successfully");
      this.GetTable();
      console.log("Error");
    }, error => console.error(error));
  }

  openDetails(arr) {

    this.UpdateItemModel = Object.assign({}, arr);
    console.log(this.UpdateItemModel)
  }
  
}

interface GetItems {
  ItemID: number;
  ItemName: string;
  CategoryID: number;
}
interface PostItemInventory {
  ItemInventoryID: number;
  ItemQuantity: number;
  ItemRate: number;
  ItemID: number;
  ItemName: string;
  CreateDate: any;
}

interface GetItemsInventory {
  ItemInventoryID: number;
  ItemName: string;
  ItemRate: number;
  ItemQuantity: number;
  CreateDate: number;
}
interface UpdateItemModel {
  ItemInventoryID: number;
  ItemQuantity: number;
  ItemRate: number;
  CreateDate: string;
}
