using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Views;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PriceStdValueADO : BaseADO
    {
        private static PriceStdValueADO instant;
        public static PriceStdValueADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdValueADO();
            return instant;
        }
        private PriceStdValueADO() { }

        public int Import(SqlTransaction transac, sxsPriceStdValue d, int empID = 0, string updateFlag = "I", Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@priceStdRangeDID", d.PriceStdRangeD_ID);
            param.Add("@priceStdProdID", d.PriceStdProd_ID);
            param.Add("@priceStdEffectiveDateID", d.PriceStdEffectiveDate_ID);
            param.Add("@priceFOB", d.PriceFOB);
            param.Add("@priceCAF", d.PriceCAF);
            param.Add("@priceCIF", d.PriceCIF);
            param.Add("@createBy", d.CreateBy);
            param.Add("@empID", empID);
            param.Add("@updateFlag", updateFlag);

            return ExecuteScalarSP<int>(transac, "SP_PriceStdValue_Import", param, logger);
        }
        
        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@tableName", "sxsPriceStdValue");
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_Update_Status", param, logger).ToList();
        }

        public List<sxsPriceStdValue> GetByRangeDID(List<int> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsPriceStdValue");
            param.Add("@colIDName", "PriceStdRangeD_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsPriceStdValue>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }

    }
}
