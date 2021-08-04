using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantRemarkGroupTypeRes : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> remarkGroupTypes = new List<StringIdCodeDescriptionModel>();
    }
}
