using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ShipmentPlanHADO : BaseADO
    {
        private static ShipmentPlanHADO instant;
        public static ShipmentPlanHADO GetInstant()
        {
            if (instant == null)
                instant = new ShipmentPlanHADO();
            return instant;
        }
        private ShipmentPlanHADO() { }


        public sxtShipmentPlanH Save( sxtShipmentPlanH shipmentPlanH, int actionBy, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planHID", shipmentPlanH.ID);
            param.Add("@planDate", shipmentPlanH.PlanDate);
            param.Add("@planWeek", shipmentPlanH.PlanWeek);
            param.Add("@status", shipmentPlanH.Status);
            param.Add("@actionBy", actionBy);
            param.Add("@Container_Code", shipmentPlanH.Container_Code);
            param.Add("@refID", shipmentPlanH.RefID);
            param.Add("@remarkID", shipmentPlanH.Remark_ID);
            param.Add("@packListCode", shipmentPlanH.PackList_Code);
            param.Add("@calculateType", shipmentPlanH.CalculateType);
            param.Add("@volumeAdj", shipmentPlanH.VolumeAdj);
            param.Add("@weightAdj", shipmentPlanH.WeightAdj);
            //param.Add("@Container_SizeKG", shipmentPlanH.Container_SizeKG);

            var res = this.QuerySP<sxtShipmentPlanH>(transac,  "SP_ShipmentPlanH_Save", param, logger).ToList();

            return res.FirstOrDefault();
        }

        public List<sxtShipmentPlanH> GetByCustomer(int customerID, int planYear, int planMonth, string planType, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerID", customerID);
            param.Add("@planYear", planYear);
            param.Add("@planMonth", planMonth);
            param.Add("@planType", planType);
           
            var res = this.QuerySP<sxtShipmentPlanH>("SP_ShipmentPlanH_GetByCustomer", param,logger).ToList();
            return res;
        }

        public List<sxtShipmentPlanH> Approve(List<int> shipmentHIDs, int step, string approve, string status, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@shipmentHIDs", String.Join(",", shipmentHIDs));
            param.Add("@step", step);
            param.Add("@approve", approve);
            param.Add("@status", status);
            param.Add("@empID", empID);

            var res = this.QuerySP<sxtShipmentPlanH>("SP_ShipmentPlanH_Approve", param, logger).ToList();
            return res;
        }
    }
}
