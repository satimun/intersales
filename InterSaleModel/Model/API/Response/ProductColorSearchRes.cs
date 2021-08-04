using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductColorSearchRes : IResponseModel
    {
        public List<SearchResModel> colors = new List<SearchResModel>();
    }
}
