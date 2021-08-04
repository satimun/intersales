using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetCustomerGroupRes : IResponseModel
    {
        public List<CustomerGroup> customerGroups = new List<CustomerGroup>();
        public class CustomerGroup
        {
            public INTIdCodeDescriptionModel customerGroup = new INTIdCodeDescriptionModel();
            public INTIdCodeDescriptionModel customers = new INTIdCodeDescriptionModel();
            
        }
       
    }
}
