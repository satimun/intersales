using System;
using System.Collections.Generic;
using System.Text;
using InterSaleModel.Model.API.Response.PublicModel;

namespace InterSaleModel.Model.API.Response
{
    public class ConstantCountryGroupModel : IResponseModel
    {
        public List<StringIdCodeDescriptionModel> ConstantCountry = new List<StringIdCodeDescriptionModel>();
    }
}
