using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CustomerGroupMoveCustomerMappingResponse:IResponseModel
    {
        public CustomerGroupMoveCustomerMappingRes customerGroup = new CustomerGroupMoveCustomerMappingRes();
    }



    public class CustomerGroupMoveCustomerMappingRes
    {
        public int ID { get; set; }
        public string GroupType { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public List<CustomerMoveCustomerMapping> customers = new List<CustomerMoveCustomerMapping>();
    }

    
    public class CustomerMoveCustomerMapping
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public ResultModel _result = new ResultModel();
    }

  
}
