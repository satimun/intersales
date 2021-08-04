using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ShipmentPlanDADO : BaseADO
    {
        private static ShipmentPlanDADO instant;
        public static ShipmentPlanDADO GetInstant()
        {
            if (instant == null)
                instant = new ShipmentPlanDADO();
            return instant;
        }
        private ShipmentPlanDADO() { }


        public sxtShipmentPlanD Save( sxtShipmentPlanD shipmentPlanD, int actionBy, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planDID", shipmentPlanD.ID);
            //param.Add("@planMainID", shipmentPlanD.ShipmentPlanMain_ID);
            param.Add("@planOrderStnID", shipmentPlanD.ShipmentPlanOrderStand_ID);
            param.Add("@planHID", shipmentPlanD.ShipmentPlanH_ID);
            param.Add("@planQty", shipmentPlanD.PlanQuatity);
            param.Add("@planWeiKG", shipmentPlanD.PlanWeightKG);
            param.Add("@planBale", shipmentPlanD.PlanBale);
            param.Add("@planVal", shipmentPlanD.PlanValue);
            param.Add("@status", shipmentPlanD.Status);
            param.Add("@actionBy", actionBy);
            param.Add("@planVolume", shipmentPlanD.PlanVolume);
            param.Add("@customerID", shipmentPlanD.Customer_ID);
            param.Add("@planType", shipmentPlanD.planType);
            param.Add("@planMonth", shipmentPlanD.planMonth);
            param.Add("@planYear", shipmentPlanD.planYear);

            var res = this.QuerySP<sxtShipmentPlanD>(
                transac,
                "SP_ShipmentPlanD_Save",
                param,
                logger)
                .ToList();

            return res.FirstOrDefault();
        }
    }
}
