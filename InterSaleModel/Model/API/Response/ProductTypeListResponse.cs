using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductTypeListResponse : IResponseModel
    {
        public List<productType> productTypes = new List<productType>();
        public class productType
        {
            public int id { get; set; }
            public string code { get; set; }
            public string description { get; set; }
            public string groupType { get; set; }
        }
    }
}
