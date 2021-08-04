using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CustomerGroupCancelCustomerMappingReponse:IResponseModel
    {
        public List<CustomerGroupCancelCustomerMappingRes> customerGroupMapping = new List<CustomerGroupCancelCustomerMappingRes>();

    }
 

    public class CustomerGroupCancelCustomerMappingRes
    {
        public CustomerGroupCancelCustomerMapping customerGroup = new CustomerGroupCancelCustomerMapping();
        public CustomerCancelCustomerMapping customer = new CustomerCancelCustomerMapping();
        public ResultModel _result = new ResultModel();
    }

    public class CustomerGroupCancelCustomerMapping
    {
        public int ID { get; set; }      
        public string Code { get; set; }
        public string Description { get; set; }
        
    }

    public class CustomerCancelCustomerMapping
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }

}
