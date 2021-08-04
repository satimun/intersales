using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class DiscountStdEffectiveDateADO : BaseADO
    {
        private static DiscountStdEffectiveDateADO instant;
        public static DiscountStdEffectiveDateADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountStdEffectiveDateADO();
            return instant;
        }
        private DiscountStdEffectiveDateADO() { }

        public int Import(SqlTransaction transac, sxsDiscountStdEffectiveDate d, string codeMain, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountStdMainID", d.DiscountStdMain_ID);
            param.Add("@effectiveDateFrom", d.EffectiveDateFrom);
            param.Add("@effectiveDateTo", d.EffectiveDateTo);
            param.Add("@empID", d.CreateBy);
            param.Add("@keyName", "STDDISCOUNT" + "-" + codeMain);

            return ExecuteScalarSP<int>(transac, "SP_DiscountStdEffectiveDate_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_DiscountStdEffectiveDate_UpdateStatus", param, logger).ToList();
        }
    }
}
