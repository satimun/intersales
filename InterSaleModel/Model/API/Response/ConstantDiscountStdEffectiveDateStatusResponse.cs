using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantDiscountStdEffectiveDateStatusResponse : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> constants = new List<StringIdCodeDescriptionModel>();
    }
}
