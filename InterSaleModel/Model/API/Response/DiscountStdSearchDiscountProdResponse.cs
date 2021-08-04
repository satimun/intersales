using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class DiscountStdValue
    {
        public int id { get; set; }
        public int discountStdMainID { get; set; }
        public int discountStdProdID { get; set; }
        public int discountEffectiveDateID { get; set; }
        public int seq { get; set; }
        public decimal discountPercent { get; set; }
        public decimal discountAmount { get; set; }
        public decimal increaseAmount { get; set; }
        public string status { get; set; }
        public INTIdCodeDescriptionModel updateFlag { get; set; }
        public ApproveDocumentModel approved = new ApproveDocumentModel();
        public INTIdCodeDescriptionModel product = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel unitType = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel rumType = new INTIdCodeDescriptionModel();
        public ByDateTimeModel lastUpdate = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();

        public bool cloneFlag { get; set; }

    }

    public class DiscountStdSearchDiscountProdResponse : IResponseModel
    {
        public List<DiscountStdValue> discountStdValues =  new List<DiscountStdValue>();
    }
}
