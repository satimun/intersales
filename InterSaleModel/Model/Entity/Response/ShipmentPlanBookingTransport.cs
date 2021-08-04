using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanBookingTransport
    {
        public int PlanHID { get; set; }
        public int Customer_ID { get; set; }
        public int PlanWeek { get; set; }
        public DateTime PlanDate { get; set; }
        //public decimal PayAmount { get; set; }
        public int? PortLoading_ID { get; set; }
        public int? PortLoadingBy { get; set; }
        public DateTime? PortLoadingDate { get; set; }
        public string Port_Code { get; set; }
        public string Port_Description { get; set; }
        public decimal StockAmount { get; set; }
        public decimal PlanAmount { get; set; }
        public string Container_Code { get; set; }
        public string PackList_Code { get; set; }
        public string Pi_Code { get; set; }
        public string PaymentTerm { get; set; }
    }
}
