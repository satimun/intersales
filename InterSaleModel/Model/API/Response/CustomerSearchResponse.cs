using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CustomerSearchResponse : IResponseModel
    {
        public List<Customer> customers { get; set; }
        public class Customer : SearchResModel
        {
            public INTIdCodeDescriptionModel country { get; set; }
            public INTIdCodeDescriptionModel countryGroup { get; set; }
        }
    }
}
