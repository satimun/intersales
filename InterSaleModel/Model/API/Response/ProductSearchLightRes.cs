using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductSearchLightRes : IResponseModel
    {
        public List<Product> products = new List<Product>();
        public class Product
        {
            public int id { get; set; }
            public string code { get; set; }
            public string description { get; set; }

            public INTIdCodeDescriptionModel productType { get; set; }
            //public INTIdCodeDescriptionModel productGrade { get; set; }            
            public INTIdCodeDescriptionModel rumType { get; set; }            
        }
    }
}
