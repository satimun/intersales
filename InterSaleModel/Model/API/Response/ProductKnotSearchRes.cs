using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductKnotSearchRes : IResponseModel
    {
        public List<SearchResModel> knots = new List<SearchResModel>();
    }
}
