using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class LabelRes : IResponseModel
    {
        public List<INTIdCodeDescriptionModel> labels = new List<INTIdCodeDescriptionModel>();
    }
}
