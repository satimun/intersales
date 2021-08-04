using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ProductColorADO : BaseADO
    {
        private static ProductColorADO instant;
        public static ProductColorADO GetInstant()
        {
            if (instant == null)
                instant = new ProductColorADO();
            return instant;
        }
        private ProductColorADO() { }

        public List<sxsProductColor> GetByGroupId(int id, Logger logger = null)
        {
            string cmd = "exec SP_ProductColor_GetByGroupId @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsProductColor>(cmd, param, logger).ToList();
        }

        public List<sxsProductColor> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductColor_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductColor>(cmd, param, logger).ToList();
        }

        public List<sxsProductColor> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductColor>("SP_ProductColor_Search", param, logger).ToList();
        }
    }
}
