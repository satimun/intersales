using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ShipmentPlanDateCircleADO : BaseADO
    {
        private static ShipmentPlanDateCircleADO instant;
        public static ShipmentPlanDateCircleADO GetInstant()
        {
            if (instant == null)
                instant = new ShipmentPlanDateCircleADO();
            return instant;
        }
        private ShipmentPlanDateCircleADO() { }

        public List<sxsShipmentPlanDateCircle> GetByCustomerID(int customerID, Logger logger = null)
        {
            string cmd = "dbo.SP_ShipmentPlanDateCircle_GetByCustomerID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerID", customerID);

            return QuerySP<sxsShipmentPlanDateCircle>(cmd, param, logger).ToList();
        }

        public List<ShipmentPlanDateCircleSearchCustomer> SearchCustomer(string search, List<string> status, Logger logger = null)
        {
            string cmd = "dbo.SP_ShipmentPlanDateCircle_SearchCustomer";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@search", search);
            param.Add("@status", string.Join(',', status));
            return QuerySP<ShipmentPlanDateCircleSearchCustomer>(cmd, param, logger).ToList();
        }

        public List<ShipmentPlanDateCircleSearchCustomer> Save(SqlTransaction transac, List<int> customerID, List<int> shippingDay, int empID, Logger logger = null)
        {
            string cmd = "dbo.SP_ShipmentPlanDateCircle_Save";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerID", string.Join(',', customerID));
            param.Add("@shippingDay", string.Join(',', shippingDay));
            param.Add("@empID", empID);
            return QuerySP<ShipmentPlanDateCircleSearchCustomer>(transac, cmd, param, logger).ToList();
        }
    }
}
