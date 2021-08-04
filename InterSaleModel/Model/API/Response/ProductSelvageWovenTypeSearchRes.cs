using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductSelvageWovenTypeSearchRes : IResponseModel
    {
        public List<SearchResModel> selvageWovenTypes = new List<SearchResModel>();
    }
}
