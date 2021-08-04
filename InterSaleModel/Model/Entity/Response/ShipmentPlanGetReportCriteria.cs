using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetReportCriteria
    {
        public int MID { get; set; }
        public string HID { get; set; }
        public string DID { get; set; }
        public string HRefID { get; set; }
        public string DRefID { get; set; }
        public string ORefID { get; set; }
        public int Revision { get; set; }
        public string PlanType { get; set; }
        public int PlanWeek { get; set; }
        public DateTime PlanDate { get; set; }
        public string Customer_Code { get; set; }
        public string Customer_Description { get; set; }
        public string Port_Code { get; set; }
        public string Port_Description { get; set; }
        public string PI_Code { get; set; }
        public string CI_Code { get; set; }
        public DateTime? Stock_Date { get; set; }
        public DateTime? ActualDate { get; set; }
        public string BeforePaymentTerm_Code { get; set; }
        public string AfterPaymentTerm_Code { get; set; }
        public string Container_Code { get; set; }
        public string Currency_Code { get; set; }
        public decimal PlanQuatity { get; set; }
        public decimal PlanWeightKG { get; set; }
        public decimal PlanBale { get; set; }
        public decimal PlanValue { get; set; }
        public decimal PlanValueTHB { get; set; }
        public string Order_Code { get; set; }
        public string Product_Code { get; set; }
        public string Product_Description { get; set; }
        public DateTime AdmitDate { get; set; }
        public DateTime MaxAdmitDate { get; set; }
        public string DeliveryType_Code { get; set; }

        public string Country_Code { get; set; }
        public string Country_Description { get; set; }

        public string ReportStatus { get; set; }

        public int? Remark_ID { get; set; }
        public string Remark_Code { get; set; }
        public string Remark_Description { get; set; }

        public string CIMAIN { get; set; }
        public string PaymentTerm { get; set; }
        public decimal PayAmount { get; set; }
        public int PortLoading_ID { get; set; }
    }
}
