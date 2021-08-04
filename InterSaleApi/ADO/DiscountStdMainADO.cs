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
    public class DiscountStdMainADO : BaseADO
    {
        private static DiscountStdMainADO instant;
        public static DiscountStdMainADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountStdMainADO();
            return instant;
        }
        private DiscountStdMainADO() { }

        public int Import(SqlTransaction transac, sxsDiscountStdMain d, string code, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerID", d.Customer_ID);
            param.Add("@productTypeID", d.ProductType_ID);
            param.Add("@productGradeID", d.ProductGrade_ID);
            param.Add("@currencyID", d.Currency_ID);
            param.Add("@type", d.Type);
            param.Add("@empID", d.CreateBy);
            param.Add("@code", code);

            return ExecuteScalarSP<int>(transac, "SP_DiscountStdMains_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_DiscountStdMain_UpdateStatus", param, logger).ToList();
        }
    }
}
