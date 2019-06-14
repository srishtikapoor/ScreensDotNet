import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ItemOrder',
  templateUrl: './ItemOrder.component.html'
})
export class ItemOrderDataComponent {
  public customers: GetCustomerDetails[];
  public items: GetItems[];
  public rate: GetRate[];
  public array: Array < {
    CustomerID: number,
    ItemID: number,
    ItemName: string,
    ItemOrderQuantity: number,
    TotalAmount: number
  } >= []; 
  

  public itemOrderDataModel = {
    OrderID: 0,
    ItemOrderQuantity: 0,
    TotalAmount:0,
    ItemID: 0,
    CustomerID: 0,
    ID:0
  };
    iName: any;
  Reset() {
    this.itemOrderDataModel.CustomerID = 0;
    this.itemOrderDataModel.ItemID = 0;
    this.itemOrderDataModel.ItemOrderQuantity = 0;
    this.itemOrderDataModel.TotalAmount = 0;
  };

 
  Add() {

    for (var item in this.items) {
      //var data = this.items[item];
      if (this.items[item].itemID == this.itemOrderDataModel.ItemID) {
        this.iName = this.items[item].itemName;
      }
    }
    if (this.itemOrderDataModel.CustomerID == 0 || this.itemOrderDataModel.ItemID == 0 || this.itemOrderDataModel.ItemOrderQuantity == 0 || this.itemOrderDataModel.TotalAmount == 0) {
      alert("Insert Values. No field should be empty");
    }
    else {
      this.array.push({
        CustomerID: this.itemOrderDataModel.CustomerID,
        ItemID: this.itemOrderDataModel.ItemID,
        ItemName: this.iName,
        ItemOrderQuantity: this.itemOrderDataModel.ItemOrderQuantity,
        TotalAmount: this.itemOrderDataModel.TotalAmount,

      });
      this.Reset();
    }
  }

  Delete(RowIndex) {
    if (RowIndex > -1)
      this.array.splice(RowIndex, 1);
  };

  private _baseUrl: string;
  private _http: HttpClient;
  RateList: any;

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    http.get<GetCustomerDetails[]>(apiUrl + 'Values/GetCustomerDetails').subscribe(result => {
      this.customers = result;
      console.log(this.customers);
    }, error => console.error(error));

    http.get<GetItems[]>(apiUrl + 'Values/GetItems').subscribe(result => {
      this.items = result;
      console.log(this.items);
    }, error => console.error(error));

  
    this._baseUrl = apiUrl;
    this._http = http;
    this.itemOrderDataModel = {
      OrderID: 0,
      ItemOrderQuantity: 0,
      TotalAmount: 0,
      ItemID: 0,
      CustomerID: 0,
      ID: 0
    };
  }
  
  SaveItemOrder() {
    this._http.post<any>(this._baseUrl + 'values/SaveItemOrder', this.array).subscribe(result => {
      alert("Saved Successfully");
      console.log("Error");
    }, error => console.error(error));
  }
    
  ngOnInit(): void {
    this._http.get<any>(this._baseUrl + 'values/GetRateList').subscribe(result => {
      this.RateList = result;
      console.log(this.RateList);
    }, error => console.error(error));
  }
  getPrice(itemID) {
    if (this.itemOrderDataModel.ItemOrderQuantity == 0) {
      this.itemOrderDataModel.TotalAmount = 0;
    }
    else {
      var result = this.RateList[itemID];
      this.itemOrderDataModel.TotalAmount = parseFloat((result * this.itemOrderDataModel.ItemOrderQuantity).toFixed(2));
    }
  }
}
interface GetCustomerDetails {
  CustomerID: number;
  CustomerName: string;
  CustomerEmail: string;
}
interface GetItems {
  ItemID: number;
  ItemName: string;
  CategoryID: number;
}
interface GetRate {
  ItemInventoryID: number;
  ItemQuantity: number ;
  ItemRate: number;
  ItemID: number;
  CreateDate: number;
}

interface PostItemOrder {
  OrderID: number;
  ItemOrderQuantity: number;
  TotalAmount: number;
  ItemID: number;
  CustomerID: number;
}
