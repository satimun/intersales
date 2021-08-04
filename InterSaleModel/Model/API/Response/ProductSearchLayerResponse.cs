using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductSearchLayerResponse : IResponseModel
    {
        public List<ProductGetResponse> products = new List<ProductGetResponse>();
    }
}
