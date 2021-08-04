using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductStretchingSearchRes : IResponseModel
    {
        public List<SearchResModel> stretchings = new List<SearchResModel>();
    }
}
