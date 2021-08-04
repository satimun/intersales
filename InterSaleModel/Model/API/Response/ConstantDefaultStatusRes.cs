using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantDefaultStatusRes : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> defaultStatus = new List<StringIdCodeDescriptionModel>();
    }
}
