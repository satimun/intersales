using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetCustomerGroup
    {
        public int CustomerID { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerDes { get; set; }

        public int CustomerGroupID { get; set; }
        public string CustomerGroupCode { get; set; }
        public string CustomerGroupDes { get; set; }
    }
}
