using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantPriceStdMainTypeResponse : IResponseModel
    {
        public  List<StringIdCodeDescriptionModel> priceStdMainType = new List<StringIdCodeDescriptionModel>();
    }
}
