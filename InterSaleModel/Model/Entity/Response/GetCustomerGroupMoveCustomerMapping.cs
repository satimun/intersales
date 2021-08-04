using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetCustomerGroupMoveCustomerMapping
    {
        public int Customer_ID { get; set; }
        public int CustomerGroup_ID { get; set; }
        public string CustomerCode { get; set; }
        public string CompanyName { get; set; }
        public string CustomerGroupCode { get; set; }
        public string CustomerGroupDesc { get; set; }
        public string GroupType { get; set; }
        public string Status { get; set; }
    }
}
