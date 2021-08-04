using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdSearchHeaderRes : IResponseModel
    {
        public List<DiscountMain> discountHeaders = new List<DiscountMain>();
        public class DiscountMain : DiscountStdMains
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
