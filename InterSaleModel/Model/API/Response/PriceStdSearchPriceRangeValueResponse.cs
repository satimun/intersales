using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdValues
    {
        public int id { get; set; }
        public int priceRangeDID { get; set; }
        public int priceEffectiveDateID { get; set; }
        public int priceRangeHID { get; set; }
        public int seq { get; set; }
        public INTIdCodeDescriptionModel twineSeries { get; set; }
        public decimal? minMeshSize { get; set; }
        public decimal? maxMeshSize { get; set; }
        public decimal? minMeshDepth { get; set; }
        public decimal? maxMeshDepth { get; set; }
        public decimal? minLength { get; set; }
        public decimal? maxLength { get; set; }
        public string tagDescription { get; set; }
        public string salesDescription { get; set; }
        public decimal fob { get; set; }
        public decimal caf { get; set; }
        public decimal cif { get; set; }
        public string status { get; set; }

        public INTIdCodeDescriptionModel updateFlag { get; set; }

        public ApproveDocumentModel approved { get; set; }
        public ByDateTimeModel lastUpdate { get; set; }
        public ResultModel _result = new ResultModel();
    }

    public class PriceStdSearchPriceRangeValueResponse : IResponseModel
    {
        public List<PriceStdValues> priceStdValues = new List<PriceStdValues>();
    }
}
