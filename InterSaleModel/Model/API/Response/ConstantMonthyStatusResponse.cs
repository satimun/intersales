using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantMonthyStatusResponse : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> monthlyStatus = new List<StringIdCodeDescriptionModel>();
    }
}
