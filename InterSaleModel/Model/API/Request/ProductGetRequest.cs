using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ProductGetRequest : IRequestModel
    {
        public int id { get; set; }
    }
}
