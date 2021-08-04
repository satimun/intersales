using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CountrySearchResponse : IResponseModel
    {
        public List<INTIdCodeDescriptionModel> countrys = new List<INTIdCodeDescriptionModel>();
    }

}
