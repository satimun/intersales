using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Constant.ConstEnum;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ShipmentPlanMainADO : BaseADO
    {
        private static ShipmentPlanMainADO instant;
        public static ShipmentPlanMainADO GetInstant()
        {
            if (instant == null)
                instant = new ShipmentPlanMainADO();
            return instant;
        }
        private ShipmentPlanMainADO() { }


        public sxtShipmentPlanMain InsertMonthlyInit(
            int customerID,int planMonth,int planYear, int createBy, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Customer_ID", customerID);
            param.Add("@PlanMonth", planMonth);
            param.Add("@PlanYear", planYear);
            param.Add("@CreateBy", createBy);

            var res = this.Query<sxtShipmentPlanMain>(
                transac,
                "exec SP_ShipmentPlanMain_InsertMonthlyInit @Customer_ID,@PlanMonth,@PlanYear,@CreateBy",
                param,
                logger)
                .ToList();
            
            return res.FirstOrDefault();
        }


        public List<sxtShipmentPlanMain> GetByID(List<int> shipmentPlanMainIDs, Logger logger)
        {
            string cmd = "exec SP_ShipmentPlanMain_GetByID @shipmentPlanMainIDs";
            var param = new Dapper.DynamicParameters();
            param.Add("@shipmentPlanMainIDs", string.Join(',', shipmentPlanMainIDs));

            var res = Query<sxtShipmentPlanMain>(cmd, param, logger).ToList();
            return res;
        }
        public List<sxtShipmentPlanMain> GetByID(int shipmentPlanMainIDs, Logger logger)
        {
            string cmd = "exec SP_ShipmentPlan_GetByID @shipmentPlanMainIDs";
            var param = new Dapper.DynamicParameters();
            param.Add("@shipmentPlanMainIDs", shipmentPlanMainIDs);

            var res = Query<sxtShipmentPlanMain>(cmd, param, logger).ToList();
            return res;
        }

        public List<sxtShipmentPlanMain> UpdateStatus(List<int> shipmentPlanMainIDs, ENShipmentPlanMonthlyStatus status, int empID, Logger logger, SqlTransaction transac = null)
        {
            string cmd = "exec SP_ShipmentPlanMain_UpdateStatus @shipmentPlanMainIDs, @status, @empID";
            var param = new Dapper.DynamicParameters();
            param.Add("@shipmentPlanMainIDs", string.Join(',', shipmentPlanMainIDs));
            param.Add("@status", EnumUtil.GetValueString<ENShipmentPlanMonthlyStatus>(status));
            param.Add("@empID", empID);

            var res = Query<sxtShipmentPlanMain>(transac, cmd, param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanRelationLastRevisionCriteria> GetPlan(
            int shipmentPlanMainID,
            Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@shipmentPlanMainIDs", shipmentPlanMainID);
            var res = this.Query<ShipmentPlanRelationLastRevisionCriteria>(
                "EXEC dbo.SP_ShipmentPlanMain_GetPlan @shipmentPlanMainIDs",
                param, logger)
                .ToList();
            return res;
        }

        public List<ShipmentPlanRelationLastRevisionCriteria> UpdateCustomerGroup(int mainID, List<int> customerIDs, Logger logger, SqlTransaction transac = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@mainID", mainID);
            param.Add("@customerIDs", string.Join(',', customerIDs));

            var res = this.QuerySP<ShipmentPlanRelationLastRevisionCriteria>(transac, "SP_ShipmentPlanMain_UpdateCustomerGroup", param, logger).ToList();
            return res;
        }
    }
}
