using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CustomerGroupCancelCustomerMappingRequest:IRequestModel
    {
        public List<CustomerGroupCanceCustomerMappingRQ> customerMappings = new List<CustomerGroupCanceCustomerMappingRQ>();
    }

    public class CustomerGroupCanceCustomerMappingRQ
    {
        public int customerGroupID { get; set; }
        public int customerID { get; set; }
    }
}

