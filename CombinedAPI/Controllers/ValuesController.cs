using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CombinedAPI.Models;

using System.Data;
using Microsoft.AspNetCore.Cors;
using DBHelper;

namespace CombinedAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class ValuesController : ControllerBase
    {
        DataHelper datahelper = new DataHelper();
        // GET api/values
        [HttpGet(Name ="GetStates")]
        
          public DataTable GetStates()
        {
            DataTable dt = datahelper.GetResults("Select * from States");
            return dt;
            
        }

        [HttpGet(Name = "GetCustomerDetails")]

        public DataTable GetCustomerDetails()
        {
            DataTable details = datahelper.GetResults("Select * from CustomerData");
            return details;
        }

        //POST api/values
       [HttpPost(Name = "CustomerDetails")]
        //[Route("api/values/CustomerDetails")]
        public void CustomerDetails([FromBody]PostData data)
        {
            DataTable postData = datahelper.PostValues("Insert into CustomerData Values('" + data.CustomerName + "','" + data.CustomerEmail + "')");
            return;
        }



        //get categories
        [HttpGet(Name = "GetCategory")]
        public DataTable GetCategory()
        {
            DataTable dt = datahelper.GetResults("Select * from CategoryMaster");
            return dt;
        }

        [HttpGet(Name = "GetItems")]
        public DataTable GetItems()
        {
            DataTable items = datahelper.GetResults("select ItemMaster.ItemID, ItemMaster.ItemName, ItemMaster.CategoryID, CategoryMaster.CategoryName from ItemMaster Inner Join CategoryMaster ON ItemMaster.CategoryID = CategoryMaster.CategoryID");
            return items;
        }
        [HttpGet(Name = "GetItemsInventory")]
        public DataTable GetItemsInventory()
        {
            DataTable items = datahelper.GetResults("select ItemInventory.ItemInventoryID, ItemMaster.ItemName, ItemInventory.ItemRate, ItemInventory.ItemQuantity, ItemInventory.CreateDate from ItemInventory Inner Join ItemMaster ON ItemMaster.ItemID = ItemInventory.ItemID");
            return items;
        }


        //post item with category
        [HttpPost(Name = "AddItem")]
        public void AddItem([FromBody]PostItem item)
        {
            DataTable postItem = datahelper.PostValues("Insert into ItemMaster Values('" + item.ItemName + "' ,'" + item.CategoryID + "')");
            return;
        }

        [HttpPost(Name = "SaveItemInventory")]
        public void SaveItemInventory([FromBody]PostItemInventory item)
        {
            DataTable postItemInventory = datahelper.PostValues("Insert into ItemInventory(ItemQuantity, ItemRate,ItemID) Values('" + item.ItemQuantity + "' ,'" + item.ItemRate + "','" + item.ItemID + "')");
            return;
        }

        //[HttpPost(Name = "SaveItemOrder")]
        //public void SaveItemOrder([FromBody]PostItemOrder item)
        //{
        //    DataTable postItemOrder = new DataHelper().PostValues("Insert into ItemOrder(ItemOrderQuantity, TotalAmount) Values('" + item.ItemOrderQuantity + "' ,'" + item.TotalAmount + "')");
        //    return;
        //}


        [HttpGet(Name = "GetRateList")]
        public Dictionary<int, decimal> GetRateList()
        {
            DataTable dtRateList = datahelper.GetResults("Select distinct ItemRate,ItemID from ItemInventory where ItemInventoryID in(SELECT MAX(ItemInventoryID) FROM iteminventory GROUP BY ItemID)");
            Dictionary<int, decimal> itemRateList = new Dictionary<int, decimal>();

            foreach (DataRow drRate in dtRateList.Rows)
            {
                itemRateList.Add(Convert.ToInt16(drRate["ItemID"]), Convert.ToDecimal(drRate["ItemRate"]));
            }
            return itemRateList;
        }

        [HttpPost(Name ="SaveItemOrder")]
        public void SaveItemOrder([FromBody]List <PostItemOrder> items)
        {
            foreach(var item in items)
            {
                DataTable postItemOrder = datahelper.PostValues("INSERT INTO ItemOrder VALUES ('" + item.ItemOrderQuantity + "','" + item.TotalAmount + "', '" + item.ItemID + "','" + item.CustomerID + "')");
            }
               

            return;
        }

        [HttpPost(Name = "UpdateCustomerDetails")]
        public void UpdateCustomerDetails([FromBody]PostData item)
        {
            DataTable postItemInventory = datahelper.PostValues("Update CustomerData SET CustomerName= ('" + item.CustomerName+ "'), CustomerEmail=('"+item.CustomerEmail+"') where CustomerID=('"+item.CustomerID+"')"); 
            return;
        }
        /*('" + item.CustomerName + "' ,'" + item.CustomerEmail + "' where CustomerID='" + item.CustomerID+"'");*/

        //[HttpPost(Name = "UpdateItem")]
        //public void UpdateItem([FromBody]PostItem item)
        //{
        //    DataTable postItemInventory = datahelper.PostValues(""UPDATE ItemMaster SET ItemName='" + item.ItemName + "' WHERE ItemID='" + item.ItemID+ "'");
        //    return;
        //}
        [HttpPost(Name = "UpdateItemInventory")]
        public void UpdateItemInventory([FromBody] UpdateItemModel data)
        {
            DataTable dtInventory = new DataHelper().PostValues("UPDATE ItemInventory SET ItemQuantity = ('" + data.ItemQuantity + "'), ItemRate = ('" + data.ItemRate + "'), CreateDate= getDate() WHERE ItemInventoryID = ('" + data.ItemInventoryID + "')");
            return;
        }
        [HttpGet(Name = "GetLoadedData")]
        public DataTable GetLoadedData(int id)
        {
            DataTable items = datahelper.GetResults("Select TOP "+id+" * from CustomerData");
            return items;
        }
    }
}

