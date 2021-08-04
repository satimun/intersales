using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CustomerGroupSearchCustomerRequest : IRequestModel
    {
        public string search { get; set; }
        public List<string> customerGroupIDs { get; set; }
    }

}
