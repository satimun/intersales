using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ProductSearchLayerRequest : IRequestModel
    {
        public int productID { get; set; }
    }
}
