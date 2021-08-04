using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class Productx
    {
        public int id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string grade { get; set; }
        public string series { get; set; }
        public string selvage { get; set; }
    }
    public class ProductFindResponse : IResponseModel
    {
        public List<Productx> products = new List<Productx>();
    }
}
