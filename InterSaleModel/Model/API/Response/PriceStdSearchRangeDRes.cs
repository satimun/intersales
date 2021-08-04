using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdSearchRangeDRes : IResponseModel
    {
        public List<PriceStdRangeD> rangeDs = new List<PriceStdRangeD>();
        public class PriceStdRangeD
        {
            public int id { get; set; }
            public int priceRangeHID { get; set; }
            public INTIdCodeDescriptionModel twineSeries { get; set; }
            public decimal? minMeshSize { get; set; }
            public decimal? maxMeshSize { get; set; }
            public decimal? minMeshDepth { get; set; }
            public decimal? maxMeshDepth { get; set; }
            public decimal? minLength { get; set; }
            public decimal? maxLength { get; set; }
            public string tagDescription { get; set; }
            public string salesDescription { get; set; }

            public ByDateTimeModel lastUpdate = new ByDateTimeModel();
            public ResultModel _result = new ResultModel();
        }
    }
}
