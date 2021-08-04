using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class DiscountStdSearchDiscountForPriceReq : IRequestModel
    {
        public string effectiveDateTo { get; set; }
        public string effectiveDateFrom { get; set; }

        public int countryGroupID { get; set; }

        public int? productID { get; set; }
        public int productTypeID { get; set; }
        public int? productGradeID { get; set; }
        public int currencyID { get; set; }
        public int unitTypeID { get; set; }

        public int? knotID { get; set; }
        public int? stretchingID { get; set; }
        public int? selvageWovenTypeID { get; set; }
        public int? colorGroupID { get; set; }

        public string minTwineSizeCode { get; set; }
        public string maxTwineSizeCode { get; set; }

        public int? twineseriesID { get; set; }

        public decimal? minMeshSize { get; set; }
        public decimal? maxMeshSize { get; set; }
        public decimal? minMeshDepth { get; set; }
        public decimal? maxMeshDepth { get; set; }
        public decimal? minLength { get; set; }
        public decimal? maxLength { get; set; }
        public string approvedFlag { get; set; }
    }
}
