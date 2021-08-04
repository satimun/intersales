using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanProgressCriteria
    {
        public int CustomerID;
        public string CustomerCode;
        public string CustomerDescription;

        public int CustomerGroupID;
        public string CustomerGroupCode;
        public string CustomerGroupDescription;

        public int CountryID;
        public string CountryCode;
        public string CountryDescription;

        public int SaleEmployeeID;
        public string SaleEmployeeCode;
        public string SaleEmployeeDescription;

        public int ZoneAccountID;
        public string ZoneAccountCode;
        public string ZoneAccountDescription;

        public string ShipmentPlanMainPorts;

        public int? ShipmentPlanMainID;
        public string ShipmentPlanMainCode;
        public string ShipmentPlanMainPlanType;
        public int? ShipmentPlanMainPlanMonth;
        public int? ShipmentPlanMainPlanYear;
        public int? ShipmentPlanMainRevision;
        public string ShipmentPlanMainMonthlyStatus;
        public string ShipmentPlanMainWeeklyStatus;
        public string ShipmentPlanMainStatus;
        //public int? ShipmentPlanMainApproveBy;
        //public DateTime? ShipmentPlanMainApproveDate;
        public int? ShipmentPlanMainCreateBy;
        public DateTime? ShipmentPlanMainCreateDate;
        public int? ShipmentPlanMainModifyBy;
        public DateTime? ShipmentPlanMainModifyDate;
        public int PlanOrderCount;

        public string FavoriteFlag;
    }
}
