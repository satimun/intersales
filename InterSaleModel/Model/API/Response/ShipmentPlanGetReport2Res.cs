using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetReport2Res : IResponseModel
    {

        public List<Report> reports = new List<Report>();
        public class Report
        {
            public int week { get; set; }
            public string date { get; set; }
            public Shipment plan { get; set; }
            public Shipment actual { get; set; }
            public string status { get; set; }
        }

        public class Shipment
        {
            public string id { get; set; }
            public int week { get; set; }
            public string date { get; set; }
            public List<INTIdCodeDescriptionModel> customers { get; set; }
            public INTIdCodeDescriptionModel country { get; set; }
            public INTIdCodeDescriptionModel zoneAccount { get; set; }
            public INTIdCodeDescriptionModel regionalZone { get; set; }
            public List<CodeDescModel> ports { get; set; }
            public List<string> ciCodes { get; set; }
            public List<string> piCodes { get; set; }
            public string stockDate { get; set; }
            public List<string> paymentTerms { get; set; }
            public string containerCode { get; set; }
            public PlanBalance balance { get; set; }
            public INTIdCodeDescriptionModel remark { get; set; }
            public INTIdCodeDescriptionModel remarkGroup { get; set; }
            public string status { get; set; }
        }
        public class PlanBalance
        {
            public decimal quantity { get; set; }
            public decimal bale { get; set; }
            public decimal weight { get; set; }
            public decimal volume { get; set; }
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
