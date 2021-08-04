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
    public class DiscountStdProdADO : BaseADO
    {
        private static DiscountStdProdADO instant;
        public static DiscountStdProdADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountStdProdADO();
            return instant;
        }
        private DiscountStdProdADO() { }

        public int Import(SqlTransaction transac, sxsDiscountStdProd d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@discountStdMainID", d.DiscountStdMain_ID);
            param.Add("@productID", d.Product_ID);
            param.Add("@unitTypeID", d.UnitType_ID);
            param.Add("@empID", d.CreateBy);
            param.Add("@discountEffectiveDateID", d.discountEffectiveDateID.GetID());

            return ExecuteScalarSP<int>(transac, "SP_DiscountStdProd_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@tableName", "sxsDiscountStdProd");
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_Update_Status", param, logger).ToList();
        }
    }
}
