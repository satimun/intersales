using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxtShipmentPlanH
    {
        public int? ID { get; set; }
        public string RefID { get; set; }
        public string Container_Code { get; set; }
        public int PlanWeek { get; set; }
        public DateTime PlanDate { get; set; }
        public string Status { get; set; }
        public string SalesApprove { get; set; }
        public int SalesApproveBy { get; set; }
        public DateTime? SalesApproveDate { get; set; }
        public string RegionalApprove { get; set; }
        public int RegionalApproveBy { get; set; }
        public DateTime? RegionalApproveDate { get; set; }
        public string ManagerApprove { get; set; }
        public int ManagerApproveBy { get; set; }
        public DateTime? ManagerApproveDate { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string PackList_Code { get; set; }

        public int? Remark_ID { get; set; }

        public int ShipmentPlanMain_ID { get; set; }

        public List<int> customerIDs = new List<int>();

        public decimal? VolumeAdj { get; set; }
        public decimal? WeightAdj { get; set; }
        public string CalculateType { get; set; }
    }
}
