using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class RunningADO : BaseADO
    {
        private static RunningADO instant;
        public static RunningADO GetInstant()
        {
            if (instant == null)
                instant = new RunningADO();
            return instant;
        }
        private RunningADO() { }

        public int Next_sxtShipmentPlanOrderStand_ID(Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@keyName", "sxtShipmentPlanOrderStand_ID");

            int res = this.ExecuteScalar<int>("exec SP_Running_Scalar @keyName", param, logger);
            return res;
        }
        
    }
}
