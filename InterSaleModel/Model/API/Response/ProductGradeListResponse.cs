using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductGradeListResponse : IResponseModel
    {
        public List<INTIdCodeDescriptionModel> productGrades = new List<INTIdCodeDescriptionModel>();
    }
}
