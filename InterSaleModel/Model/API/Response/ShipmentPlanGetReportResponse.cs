using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetReportResponse : IResponseModel
    {
        public List<PlanH> planHs { get; set; }
        public List<TotalResult> totalResults { get; set; }


        public class PlanH
        {
            public string id { get; set; }
            public string refID { get; set; }
            public int revision { get; set; }
            public int planWeek { get; set; }
            public string planDate { get; set; }
            public string PlanType { get; set; }
            public List<CodeDescModel> customer { get; set; }
            public List<CodeDescModel> port { get; set; }
            public List<CodeDescModel> country { get; set; }
            public List<string> deliverTypes { get; set; }
            public List<string> ciCodes { get; set; }
            public List<string> piCodes { get; set; }
            public List<string> paymentTerms { get; set; }
            public List<string> currencyCodes { get; set; }
            public string containerCode { get; set; }
            public string status { get; set; }
            public PlanBalance planBalance { get; set; }
            public List<PlanD> planDs { get; set; }
        }
        public class PlanD
        {
            public string id { get; set; }
            public string refID { get; set; }
            public string orefID { get; set; }
            public string orderCode { get; set; }
            public string piCode { get; set; }
            public string ciCode { get; set; }
            public string admitDate { get; set; }
            public string maxAdmitDate { get; set; }
            public string deliverType { get; set; }
            public string currencyCode { get; set; }
            public string paymentTerm { get; set; }
            public string status { get; set; }
            public CodeDescModel country { get; set; }
            public CodeDescModel product { get; set; }
            public CodeDescModel customer { get; set; }
            public CodeDescModel port { get; set; }
            public PlanBalance planBalance { get; set; }
        }
        public class PlanBalance
        {
            public decimal quantity { get; set; }
            public decimal bale { get; set; }
            public decimal weight { get; set; }
            public decimal value { get; set; }
            public decimal valueTHB { get; set; }
        }
        public class TotalResult
        {
            public ZoneAccount zoneAccount { get; set; }
            public string costDescription { get; set; }
            public decimal valueForcastYear { get; set; }
            public TotalResultValue valueJanToNow { get; set; }
            public TotalResultValue valueNow { get; set; }
        }
        public class ZoneAccount
        {
            public string code { get; set; }
            public string description { get; set; }
        }
        public class TotalResultValue {
            public decimal forecast { get; set; }
            public decimal target { get; set; }
            public decimal targetCompare { get; set; }
            public decimal actual { get; set; }
            public decimal balance { get; set; }
        }
    }
}
