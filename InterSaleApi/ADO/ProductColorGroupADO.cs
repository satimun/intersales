using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
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
    public class ProductColorGroupADO : BaseADO
    {
        private static ProductColorGroupADO instant;
        public static ProductColorGroupADO GetInstant()
        {
            if (instant == null)
                instant = new ProductColorGroupADO();
            return instant;
        }
        private ProductColorGroupADO() { }

        public List<ProductColorGroupSearch> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@countryGroupIDs", StringUtil.Join(",", d.ids1));
            param.Add("@customerIDs", StringUtil.Join(",", d.ids2));
            param.Add("@productTypeIDs", StringUtil.Join(",", d.ids3));
            param.Add("@productGradeIDs", StringUtil.Join(",", d.ids4));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<ProductColorGroupSearch>("SP_ProductColorGroup_Search", param, logger).ToList();
        }

        public List<sxsProductColorGroup> GetByID(int id, Logger logger = null)
        {
            string cmd = "exec SP_ProductColorGroup_GetByID @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsProductColorGroup>(cmd, param, logger).ToList();
        }

        public List<sxsProductColorGroup> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductColorGroup_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductColorGroup>(cmd, param, logger).ToList();
        }

        public List<sxsProductColorGroup> GetByColorCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductColorGroup_GetByColorCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductColorGroup>(cmd, param, logger).ToList();
        }

        public List<ProductColorGroupSearch> Import(SqlTransaction transac, ProductColorGroupSearchRes.ColorGroup d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            param.Add("@productColorGroupID", d.id.GetID());
            param.Add("@countryGroupID", d.countryGroup.id);
            param.Add("@productTypeID", d.productType.id);
            param.Add("@productGradeID", d.productGrade.id);
            param.Add("@colorCodes", d.colors.Where(x => !string.IsNullOrWhiteSpace(x.code)).Select(x => x.code.GetStringValue()).Distinct().ToList().Join(","));
            param.Add("@colorIDs", d.colors.Where(x => x.id.HasValue).Select(x => x.id).Distinct().ToList().Join(","));
            param.Add("@colorGroupDes", d.description.GetStringValue());
            
            param.Add("@empID", empID);

            var res = QuerySP<ProductColorGroupSearch>(transac, "SP_ProductColorGroup_Import", param, logger).ToList();

            return res;
        }

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", d.ids.Join(","));
            param.Add("@status", d.status.GetStringValue());
            param.Add("@tableName", "sxsProductColorGroup");
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_Update_Status", param, logger).ToList();
        }

    }
}
