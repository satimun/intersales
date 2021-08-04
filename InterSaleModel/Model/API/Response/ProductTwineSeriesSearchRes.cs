using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductTwineSeriesSearchRes : IResponseModel
    {
        public List<TwineSeries> twineSeries = new List<TwineSeries>();
        public class TwineSeries : SearchResModel
        {
            public INTIdCodeDescriptionModel productType { get; set; }
            public INTIdCodeDescriptionModel unitType { get; set; }
            public INTIdCodeDescriptionModel packageType { get; set; }
            public decimal amountUnitPerPackage { get; set; }
            public decimal amountPackage { get; set; }
        }
    }
}
