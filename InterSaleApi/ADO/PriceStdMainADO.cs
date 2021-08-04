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
    public class PriceStdMainADO : BaseADO
    {
        private static PriceStdMainADO instant;
        public static PriceStdMainADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdMainADO();
            return instant;
        }
        private PriceStdMainADO() { }

        public int Import(SqlTransaction transac, sxsPriceStdMain d, string code, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@countryGroupID", d.CountryGroup_ID);
            param.Add("@productTypeID", d.ProductType_ID);
            param.Add("@productGradeID", d.ProductGrade_ID);
            param.Add("@currencyID", d.Currency_ID);
            param.Add("@type", d.Type);
            param.Add("@empID", d.CreateBy);
            param.Add("@code", code);
            return ExecuteScalarSP<int>(transac, "SP_PriceStdMains_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_PriceStdMain_UpdateStatus", param, logger).ToList();
        }
        
    }
}
