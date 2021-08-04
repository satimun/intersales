using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsCustomerGroupMapping
    {
        public int CustomerGroup_ID { get; set; }
        public int Customer_ID { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }			
    }
}
