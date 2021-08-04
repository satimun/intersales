using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
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
    public class PriceStdProdADO : BaseADO
    {
        private static PriceStdProdADO instant;
        public static PriceStdProdADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdProdADO();
            return instant;
        }
        private PriceStdProdADO() { }

        public int Import(SqlTransaction transac, sxsPriceStdProd d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@priceStdMainID", d.PriceStdMain_ID);
            param.Add("@productID", d.Product_ID);
            param.Add("@unitTypeID", d.UnitType_ID);
            param.Add("@empID", d.CreateBy);
            param.Add("@priceEffectiveDateID", d.priceEffectiveDateID.GetID());

            return ExecuteScalarSP<int>(transac, "SP_PriceStdProd_Import", param, logger);
        }

        public List<sxsPriceStdProd> GetForDiscount(SqlTransaction transac, sxsDiscountStdMain d1, sxsDiscountStdEffectiveDate d2 , sxsDiscountStdProd d3, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Customer_ID", d1.Customer_ID);
            param.Add("@ProductType_ID", d1.ProductType_ID);
            param.Add("@ProductGrade_ID", d1.ProductGrade_ID);
            param.Add("@Currency_ID", d1.Currency_ID);
            param.Add("@Type", d1.Type);
            param.Add("@EffectiveDateFrom", d2.EffectiveDateFrom);
            param.Add("@EffectiveDateTo", d2.EffectiveDateTo);
            param.Add("@Product_ID", d3.Product_ID);

            return QuerySP<sxsPriceStdProd>(transac, "SP_PriceStdProd_GetForDiscount", param, logger).ToList();
        }

        //public List<sxsPriceStdProd> GetByMainID(List<string> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        //{
        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@vals", StringUtil.Join(",", ids));
        //    param.Add("@tableName", "sxsPriceStdProd");
        //    param.Add("@colIDName", "PriceStdMain_ID");
        //    param.Add("@status", StringUtil.Join(",", status));

        //    return QuerySP<sxsPriceStdProd>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        //}

        public List<PriceStdProdSearch> Search(SearchRequest d, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@priceStdMainIDs", StringUtil.Join(",", d.ids1));
            param.Add("@productIDs", StringUtil.Join(",", d.ids2));
            param.Add("@unitTypeIDs", StringUtil.Join(",", d.ids3));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<PriceStdProdSearch>(transac, "SP_PriceStdProd_Search", param, logger).ToList();
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@tableName", "sxsPriceStdProd");
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_Update_Status", param, logger).ToList();
        }
    }
}
