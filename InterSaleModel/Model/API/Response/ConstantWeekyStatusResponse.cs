using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantWeekyStatusResponse : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> weeklyStatus = new List<StringIdCodeDescriptionModel>();
    }
}
