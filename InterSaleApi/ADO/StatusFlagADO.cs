using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class StatusFlagADO : BaseADO
    {
        private static StatusFlagADO instant;
        public static StatusFlagADO GetInstant()
        {
            if (instant == null)
                instant = new StatusFlagADO();
            return instant;
        }
        private StatusFlagADO() { }

        public List<StatusFlagGetForApproval> GetForApproval(int tableID, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@tableConfigID", tableID);
            param.Add("@empID", empID);

            return QuerySP<StatusFlagGetForApproval>("SP_StatusFlag_GetForApproval", param, logger).ToList();
        }

        //public sxlJobLog Insert(string jobName, Logger logger = null)
        //{
        //    var param = new Dapper.DynamicParameters();
        //    param.Add("@JobName", jobName);

        //    var res = this.QuerySP<sxlJobLog>("SP_JobLog_Insert", param, logger).FirstOrDefault();
        //    return res;
        //}

        //public sxlJobLog Update(int id, string statusMessage, Logger logger = null)
        //{
        //    var param = new Dapper.DynamicParameters();
        //    param.Add("@ID", id);
        //    param.Add("@StatusMessage", statusMessage);

        //    var res = this.QuerySP<sxlJobLog>("SP_JobLog_Update", param, logger).FirstOrDefault();
        //    return res;
        //}

    }
}
