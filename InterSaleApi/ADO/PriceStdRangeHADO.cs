using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PriceStdRangeHADO : BaseADO
    {
        private static PriceStdRangeHADO instant;
        public static PriceStdRangeHADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdRangeHADO();
            return instant;
        }
        private PriceStdRangeHADO() { }

        public List<sxsPriceStdRangeH> GetById(int id, Logger logger = null)
        {
            string cmd = "exec SP_PriceStdRangeH_GetById @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsPriceStdRangeH>(cmd, param, logger).ToList();
        }

        public List<sxsPriceStdRangeH> GetTwineSizeBetween(SqlTransaction transac, GetTwineSizeBetweenRequest d,  Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            param.Add("@MainID", d.MainID);
            param.Add("@effectiveDateFrom", d.effectiveDateFrom);
            param.Add("@effectiveDateTo", d.effectiveDateTo);

            param.Add("@ProductKnot_ID", d.ProductKnot_ID);
            param.Add("@ProductStretching_ID", d.ProductStretching_ID);
            param.Add("@UnitType_ID", d.UnitType_ID);
            param.Add("@ProductSelvageWovenType_ID", d.ProductSelvageWovenType_ID);
            param.Add("@ProductColorGroup_ID", d.ProductColorGroup_ID);

            param.Add("@MinFilamentSize", d.MinFilamentSize);
            param.Add("@MinFilamentAmount", d.MinFilamentAmount);
            param.Add("@MinFilamentWord", d.MinFilamentWord);
            param.Add("@MaxFilamentSize", d.MaxFilamentSize);
            param.Add("@MaxFilamentAmount", d.MaxFilamentAmount);
            param.Add("@MaxFilamentWord", d.MaxFilamentWord);


            return QuerySP<sxsPriceStdRangeH>(transac, "SP_PriceStdRangeH_GetById", param, logger).ToList();
        }

        public int Import(SqlTransaction transac, sxsPriceStdRangeH d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@PriceStdMain_ID", d.PriceStdMain_ID);
            param.Add("@ProductKnot_ID", d.ProductKnot_ID);
            param.Add("@ProductStretching_ID", d.ProductStretching_ID);
            param.Add("@UnitType_ID", d.UnitType_ID);
            param.Add("@ProductSelvageWovenType_ID", d.ProductSelvageWovenType_ID);
            param.Add("@ProductColorGroup_ID", d.ProductColorGroup_ID);
            param.Add("@MinProductTwineSizeCode", d.MinProductTwineSizeCode);
            param.Add("@MinFilamentAmount", d.MinFilamentAmount);
            param.Add("@MinFilamentSize", d.MinFilamentSize);
            param.Add("@MinFilamentWord", d.MinFilamentWord);
            param.Add("@MaxProductTwineSizeCode", d.MaxProductTwineSizeCode);
            param.Add("@MaxFilamentAmount", d.MaxFilamentAmount);
            param.Add("@MaxFilamentSize", d.MaxFilamentSize);
            param.Add("@MaxFilamentWord", d.MaxFilamentWord);
            param.Add("@empID", d.CreateBy);

            return ExecuteScalarSP<int>(transac, "SP_PriceStdRangeH_Import", param, logger);
        }

        public List<sxsPriceStdRangeH> GetForDiscount(SqlTransaction transac, sxsDiscountStdMain d1, sxsDiscountStdEffectiveDate d2, sxsDiscountStdRangeH d3, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Customer_ID", d1.Customer_ID);
            param.Add("@ProductType_ID", d1.ProductType_ID);
            param.Add("@ProductGrade_ID", d1.ProductGrade_ID);
            param.Add("@Currency_ID", d1.Currency_ID);
            param.Add("@Type", d1.Type);
            param.Add("@EffectiveDateFrom", d2.EffectiveDateFrom);
            param.Add("@EffectiveDateTo", d2.EffectiveDateTo);
            param.Add("@ProductKnot_ID", d3.ProductKnot_ID);
            param.Add("@ProductStretching_ID", d3.ProductStretching_ID);
            param.Add("@UnitType_ID", d3.UnitType_ID);
            param.Add("@ProductSelvageWovenType_ID", d3.ProductSelvageWovenType_ID);
            param.Add("@ProductColorGroup_ID", d3.ProductColorGroup_ID);

            return QuerySP<sxsPriceStdRangeH>(transac, "SP_PriceStdRangeH_GetForDiscount", param, logger).ToList();
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_PriceStdRangeH_UpdateStatus", param, logger).ToList();
        }

        public List<sxsPriceStdRangeH> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", d.ids.Join(","));
            param.Add("@priceStdMainIDs", d.ids1.Join(","));
            param.Add("@productKnotIDs", d.ids2.Join(","));
            param.Add("@productStretchingIDs", d.ids3.Join(","));
            param.Add("@unitTypeIDs", d.ids4.Join(","));
            param.Add("@productSelvageWovenTypeIDs", d.ids5.Join(","));
            param.Add("@productColorGroupIDs", d.ids6.Join(","));
            param.Add("@search", d.search);
            param.Add("@status", d.status.Join(","));

            return QuerySP<sxsPriceStdRangeH>("SP_PriceStdRangeH_Search", param, logger).ToList();
        }

        public List<sxsPriceStdRangeH> GetColorGroupID(List<int> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsPriceStdRangeH");
            param.Add("@colIDName", "ProductColorGroup_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsPriceStdRangeH>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }

        public List<sxsPriceStdRangeH> GetByMainID(List<string> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsPriceStdRangeH");
            param.Add("@colIDName", "PriceStdMain_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsPriceStdRangeH>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }
    }
}
