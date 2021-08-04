using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
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
    public class PriceStdRangeDADO : BaseADO
    {
        private static PriceStdRangeDADO instant;
        public static PriceStdRangeDADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdRangeDADO();
            return instant;
        }
        private PriceStdRangeDADO() { }

        public List<GetRangeBetween> GetRangeBetween(SqlTransaction transac, GetRangeBetweenRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            param.Add("@MainID", d.MainID);
            param.Add("@RangDID", d.RangDID);
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

            param.Add("@MinMeshSize", d.MinMeshSize);
            param.Add("@MaxMeshSize", d.MaxMeshSize);
            param.Add("@MinMeshDepth", d.MinMeshDepth);
            param.Add("@MaxMeshDepth", d.MaxMeshDepth);
            param.Add("@MinLength", d.MinLength);
            param.Add("@MaxLength", d.MaxLength);
            
            return QuerySP<GetRangeBetween>(transac, "SP_PriceStdRangeD_GetRangeBetween", param, logger).ToList();
        }


        public int Import(SqlTransaction transac, sxsPriceStdRangeD d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@PriceStdRangeH_ID", d.PriceStdRangeH_ID);
            param.Add("@ProductTwineSeries_ID", d.ProductTwineSeries_ID);
            param.Add("@MinMeshSize", d.MinMeshSize);
            param.Add("@MaxMeshSize", d.MaxMeshSize);
            param.Add("@MinMeshDepth", d.MinMeshDepth);
            param.Add("@MaxMeshDepth", d.MaxMeshDepth);
            param.Add("@MinLength", d.MinLength);
            param.Add("@MaxLength", d.MaxLength);
            param.Add("@TagDescription", d.TagDescription);
            param.Add("@SalesDescription", d.SalesDescription);
            param.Add("@empID", d.CreateBy);
            param.Add("@priceEffectiveDateID", d.priceEffectiveDateID.GetID());

            return ExecuteScalarSP<int>(transac, "SP_PriceStdRangeD_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@tableName", "sxsPriceStdRangeD");
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_Update_Status", param, logger).ToList();
        }

        public List<sxsPriceStdRangeD> GetByRangeHID(List<int> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsPriceStdRangeD");
            param.Add("@colIDName", "PriceStdRangeH_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsPriceStdRangeD>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }

        public List<PriceStdRangeDSearch> Search(SearchRequest d, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@rangeHIDs", StringUtil.Join(",", d.ids1));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<PriceStdRangeDSearch>(transac, "SP_PriceStdRangeD_Search", param, logger).ToList();
        }
    }
}
