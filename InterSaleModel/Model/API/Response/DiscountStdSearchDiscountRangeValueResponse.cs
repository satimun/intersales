using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdValues
    {
        public int id { get; set; }
        
        public int discountRangeDID { get; set; }
        public int discountRangeHID { get; set; }
        public int discountEffectiveDateID { get; set; }
        public int seq { get; set; }
        public INTIdCodeDescriptionModel twineSeries = new INTIdCodeDescriptionModel();
        public decimal? minMeshSize { get; set; }
        public decimal? maxMeshSize { get; set; }
        public decimal? minMeshDepth { get; set; }
        public decimal? maxMeshDepth { get; set; }
        public decimal? minLength { get; set; }
        public decimal? maxLength { get; set; }
        public string tagDescription { get; set; }
        public string salesDescription { get; set; }
        public decimal discountPercent { get; set; }
        public decimal discountAmount { get; set; }
        public decimal increaseAmount { get; set; }
        public string status { get; set; }
        public INTIdCodeDescriptionModel updateFlag { get; set; }
        public ApproveDocumentModel approved = new ApproveDocumentModel();
        public ByDateTimeModel lastUpdate = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();
        public bool cloneFlag { get; set; }
    }

    public class DiscountStdSearchDiscountRangeValueResponse : IResponseModel
    {
        public List<DiscountStdValues> discountStdValues = new List<DiscountStdValues>();

    }
}
