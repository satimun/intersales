using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxtShipmentPlanMain
    {
        public int ID { get; set; }
        public int Customer_ID { get; set; }
        public string Code { get; set; }
        public string PlanType { get; set; }
        public int PlanMonth { get; set; }
        public int PlanYear { get; set; }
        //public int Revision { get; set; }
        //public string LastRevisionFlag { get; set; }
        //public int? ApproveBy { get; set; }
        //public DateTime? ApproveDate { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
