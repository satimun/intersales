using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetCompareReportResponse : IResponseModel
    {
        public ShipmentPlanOrg shipmentOrg = new ShipmentPlanOrg();
        public ShipmentPlanCompare shipmentCompare = new ShipmentPlanCompare();

        public class ShipmentPlanOrg
        {
            public List<PlanH> planHs { get; set; }
        }
        
        public class ShipmentPlanCompare
        {
            public List<PlanH> planHs { get; set; }
        }

        public class PlanH
        {
            public string id { get; set; }
            public string refID { get; set; }
            //public int revision { get; set; }
            public int planWeek { get; set; }
            public int planMonth { get; set; }
            public int planYear { get; set; }
            public string planDate { get; set; }
            public string PlanType { get; set; }
            public List<CodeDescModel> customers { get; set; }
            public List<CodeDescModel> ports { get; set; }
            public List<CodeDescModel> countrys { get; set; }
            public List<string> ciCodes { get; set; }
            public List<string> piCodes { get; set; }
            public string lastAdmitDate { get; set; }
            public List<string> paymentTerms { get; set; }
            public string containerCode { get; set; }
            public string status { get; set; }
            public PlanBalance planBalance { get; set; }
            public INTIdCodeDescriptionModel remark { get; set; }
            public string CIMAIN { get; set; }
            public string paymentTerm { get; set; }
            public decimal payAmount { get; set; }
            public INTIdCodeDescriptionModel portLoading = new INTIdCodeDescriptionModel();
        }
        public class PlanBalance
        {
            public decimal quantity { get; set; }
            public decimal bale { get; set; }
            public decimal weight { get; set; }
            public List<Values> values { get; set; }
            public decimal valueTHB { get; set; }
        }
        public class Values
        {
            public decimal num { get; set; }
            public string code { get; set; }
        }
    }
}
