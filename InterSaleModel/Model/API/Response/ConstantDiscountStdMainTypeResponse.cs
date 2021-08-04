using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantDiscountStdMainTypeResponse : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> discountStdMainType = new List<StringIdCodeDescriptionModel>();
    }
}
