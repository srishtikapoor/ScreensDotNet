using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CombinedAPI.Models
{
    public class UpdateItemModel
    {
        public int ItemInventoryID { get; set; }
        public int ItemQuantity { get; set; }
        public decimal ItemRate { get; set; }
        public string CreateDate { get; set; }
    }
}
