using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetData
    {
        public string ID;
        public int PlanWeek;
        public DateTime PlanDate;
        public string Container_Code;
        public int? Remark_ID;
        public string Remark_Code;
        public string Remark_Des;
		public int Customer_ID;
        public string Customer_Code;
		public string Customer_Des;
        public string PI_Code;
        public string CI_Code;
        public string Order_Code;
        public int ItemNo;
		public string UnitType_Code;
		public string PaymentTerm;
		public decimal PlanAmount;
		public decimal StockAmount;
        public decimal Weight;
    }
}
