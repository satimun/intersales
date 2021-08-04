using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class JobLogADO : BaseADO
    {
        private static JobLogADO instant;
        public static JobLogADO GetInstant()
        {
            if (instant == null)
                instant = new JobLogADO();
            return instant;
        }
        private JobLogADO() { }

        public sxlJobLog Insert(string jobName, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@JobName", jobName);

            var res = this.QuerySP<sxlJobLog>("SP_JobLog_Insert", param, logger).FirstOrDefault();
            return res;
        }

        public sxlJobLog Update(int id, string statusMessage, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@ID", id);
            param.Add("@StatusMessage", statusMessage);

            var res = this.QuerySP<sxlJobLog>("SP_JobLog_Update", param, logger).FirstOrDefault();
            return res;
        }

    }
}
