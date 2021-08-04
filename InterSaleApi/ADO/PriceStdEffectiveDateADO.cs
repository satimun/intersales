using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response.PublicModel;
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
    public class PriceStdEffectiveDateADO : BaseADO
    {
        private static PriceStdEffectiveDateADO instant;
        public static PriceStdEffectiveDateADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdEffectiveDateADO();
            return instant;
        }
        private PriceStdEffectiveDateADO() { }
                
        public List<sxsPriceStdEffectiveDate> GetPriceEffectiveDate(sxsDiscountStdMain dataMain, sxsDiscountStdEffectiveDate dataEffective, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Customer_ID", dataMain.Customer_ID);
            param.Add("@ProductType_ID", dataMain.ProductType_ID);
            param.Add("@ProductGrade_ID", dataMain.ProductGrade_ID);
            param.Add("@Currency_ID", dataMain.Currency_ID);
            param.Add("@EffectiveDateFrom", dataEffective.EffectiveDateFrom);
            param.Add("@EffectiveDateTo", dataEffective.EffectiveDateTo);


            return QuerySP<sxsPriceStdEffectiveDate>("SP_PriceStdEffectiveDate_GetPriceEffectiveDate", param, logger).ToList();
        }

        public int Import(SqlTransaction transac, sxsPriceStdEffectiveDate d, string codeMain, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@priceStdMainID", d.PriceStdMain_ID);
            param.Add("@effectiveDateFrom", d.EffectiveDateFrom);
            param.Add("@effectiveDateTo", d.EffectiveDateTo);
            param.Add("@empID", d.CreateBy);
            param.Add("@keyName", "STDPRICE" + "-" + codeMain);

            return ExecuteScalarSP<int>(transac, "SP_PriceStdEffectiveDate_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_PriceStdEffectiveDate_UpdateStatus", param, logger).ToList();
        }

    }
}
