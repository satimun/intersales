using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdSearchHeaderRes : IResponseModel
    {
        public List<PriceMain> priceHeaders = new List<PriceMain>();
        public class PriceMain : PriceStdMains
        {
            public string productGroupType { get; set; }
            public INTIdCodeDescriptionModel tableType { get; set; }
            public string effectiveDateFrom { get; set; }
            public string effectiveDateTo { get; set; }
            public string effectiveOldDateFrom { get; set; }
            public string effectiveOldDateTo { get; set; }
        }
    }
}
