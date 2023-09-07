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
    public class DiscountStdRangeHADO : BaseADO
    {
        private static DiscountStdRangeHADO instant;
        public static DiscountStdRangeHADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountStdRangeHADO();
            return instant;
        }
        private DiscountStdRangeHADO() { }

        public List<sxsDiscountStdRangeH> Search(int discountEffectiveDateID, string search = "", string discountStdValueStatus = null, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", discountEffectiveDateID);
            param.Add("@search", search);
            param.Add("@discountStdValueStatus", discountStdValueStatus);

            return QuerySP<sxsDiscountStdRangeH>("SP_DiscountStd_SearchDiscountRangeH", param, logger).ToList();
        }

        public sxsDiscountStdRangeH GetById(int id)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            var res = QuerySP<sxsDiscountStdRangeH>("SP_DiscountStdRangeH_GetById", param).FirstOrDefault();
            return res;
        }

        public List<sxsDiscountStdRangeH> GetTwineSizeBetween(SqlTransaction transac, GetTwineSizeBetweenRequest d, Logger logger = null)
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


            return QuerySP<sxsDiscountStdRangeH>(transac, "SP_DiscountStdRangeH_GetTwineSizeBetween", param, logger).ToList();
        }

        public int Import(SqlTransaction transac, sxsDiscountStdRangeH d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@DiscountStdMain_ID", d.DiscountStdMain_ID);
            param.Add("@DiscountStdEffectiveDate_ID", d.DiscountStdEffectiveDate_ID);
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

            return ExecuteScalarSP<int>(transac, "SP_DiscountStdRangeH_Import", param, logger);
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);
            param.Add("@discountStdEffectiveDateID", d.discountStdEffectiveDateID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_DiscountStdRangeH_UpdateStatus", param, logger).ToList();
        }

        public List<sxsDiscountStdRangeH> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", d.ids.Join(","));
            param.Add("@discountStdMainIDs", d.ids1.Join(","));
            param.Add("@productKnotIDs", d.ids2.Join(","));
            param.Add("@productStretchingIDs", d.ids3.Join(","));
            param.Add("@unitTypeIDs", d.ids4.Join(","));
            param.Add("@productSelvageWovenTypeIDs", d.ids5.Join(","));
            param.Add("@productColorGroupIDs", d.ids6.Join(","));
            param.Add("@search", d.search);
            param.Add("@status", d.status.Join(","));

            return QuerySP<sxsDiscountStdRangeH>("SP_DiscountStdRangeH_Search", param, logger).ToList();
        }

        public List<sxsDiscountStdRangeH> GetColorGroupID(List<int> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsDiscountStdRangeH");
            param.Add("@colIDName", "ProductColorGroup_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsDiscountStdRangeH>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }

        public List<sxsDiscountStdRangeH> GetByMainID(List<string> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsDiscountStdRangeH");
            param.Add("@colIDName", "DiscountStdMain_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsDiscountStdRangeH>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }
    }
}
