using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CustomerGroupMoveCustomerMappingRequest:IRequestModel
    {
        public int customerGroupID { get; set; }        
        public List<int> customerIDs = new List<int>();
    }
}
