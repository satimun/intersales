using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.PublicModel
{
    public class ProductModel 
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string seriesDescription { get; set; }
        public string selvedgeDescription { get; set; }
        public string rumeDescription { get; set; }
    }
}
