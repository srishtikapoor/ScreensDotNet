import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostListener, } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateDataComponent {
  isDisabled = false;
  count = 0;
  id=0 ; 
  public customerDetails: GetCustomerDetails[];
  public loadedData: GetLoadedData[];
  //to get
  items: any;
  //
  //customerDetails = Array();
 // len: number = 50;
  Loaders: boolean = false;
  //
  
  public array: Array<{
    CustomerID: number,
    CustomerName: string,
    CustomerEmail:string
  }> = []; 
  private _baseUrl: string;
  private _http: HttpClient;
  public customerDataModel =
    {
      CustomerID: null,
      CustomerName: "",
      CustomerEmail: ""
    };

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    this._baseUrl = apiUrl;
    this._http = http;
    
    this.customerDataModel = {
      CustomerID: 0,
      CustomerName: "",
      CustomerEmail: ""
    }
   this.GetTable();
    this.GetTopData();
  }

  //lazy loading

  @HostListener('window:scroll', ['$event'])
  scrollEvent() {

    if ((window.innerHeight + document.documentElement.scrollTop) >= document.documentElement.offsetHeight) {
      {
        console.log(event);
        this.id += 10;
        this._http.get<GetLoadedData[]>(this._baseUrl + 'Values/GetLoadedData?id=' + this.id).subscribe(result => { //to get
          this.loadedData = result;
          console.log(this.customerDetails);
        }, error => console.error(error));
      };
    }
  }


  GetTable() {
    this._http.get<GetCustomerDetails[]>(this._baseUrl + 'Values/GetCustomerDetails').subscribe(result => { //to get
      this.customerDetails = result;
      console.log(this.customerDetails);
  }, error => console.error(error));
  };

  GetTopData() {
    this.id += 10;
    this._http.get<GetLoadedData[]>(this._baseUrl + 'Values/GetLoadedData?id=' + this.id).subscribe(result => { //to get
      this.loadedData = result;
      console.log(this.loadedData);
    }, error => console.error(error));
  }

  SendData(item) {
    this.customerDataModel = {
      CustomerID: item.customerID,
      CustomerName: item.customerName,
      CustomerEmail:item.customerEmail
    }
    this.count = 1;
  }

  
  SaveDetails() {
    this._http.get<GetCustomerDetails[]>('http://localhost:4248/api/Values/GetCustomerDetails').subscribe(result => { //to get
      this.customerDetails = result;
      console.log(result);
      this.scrollEvent();
        //---------------------------
      let emailExist;
      this.customerDetails.map((customer) => {
        if (this.customerDataModel.CustomerEmail == customer['customerEmail']) {
          emailExist = true;
        }
      });
      if (emailExist == true) {
        alert("Email already exists");
       
      } else {

        if (this.count == 1) {
          this.isDisabled = true;
          this._http.post<customerDataModel>(this._baseUrl + 'values/UpdateCustomerDetails', this.customerDataModel).subscribe(result => {
            alert("Updated Successfully");
            this.isDisabled = false;
            this.GetTable();
          }, error => console.error(error));
        }
        else {
          this.isDisabled = true;
          this._http.post<customerDataModel>(this._baseUrl + 'values/CustomerDetails', this.customerDataModel).subscribe(result => {
            alert("Saved Successfully");
            this.isDisabled = false;
            this.GetTable();
          }, error => console.error(error));
        }
        
      }
      this.scrollEvent();
        //---------------------------
      }, error => console.error(error));
    
  }
}

interface GetCustomerDetails {
  CustomerID: number;
  CustomerName: string;
  CustomerEmail: string;
}
interface GetLoadedData {
  CustomerID: number;
  CustomerName: string;
  CustomerEmail: string;
}
interface customerDataModel {
  CustomerID: number;
  CustomerName: string;
  CustomerEmail: string;
}

