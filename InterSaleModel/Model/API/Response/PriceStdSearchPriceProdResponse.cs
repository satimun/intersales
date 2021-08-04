using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class PriceStdValue
    {
        public int id { get; set; }
        public int priceStdMainID { get; set; }
        public int priceStdProdID { get; set; }
        public int priceEffectiveDateID { get; set; }
        public int seq { get; set; }
        public decimal fob { get; set; }
        public decimal caf { get; set; }
        public decimal cif { get; set; }
        public string status { get; set; }
        public INTIdCodeDescriptionModel updateFlag { get; set; }
        public ApproveDocumentModel approved = new ApproveDocumentModel();
        public INTIdCodeDescriptionModel product = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel rumType = new INTIdCodeDescriptionModel();
        public INTIdCodeDescriptionModel unitType = new INTIdCodeDescriptionModel();
        public ByDateTimeModel lastUpdate = new ByDateTimeModel();
        public ResultModel _result = new ResultModel();
    }

    public class PriceStdSearchPriceProdResponse : IResponseModel
    {
        public List<PriceStdValue> priceStdValues = new List<PriceStdValue>();
    }
}
