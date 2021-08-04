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
    public class ProductKnotADO : BaseADO
    {
        private static ProductKnotADO instant;
        public static ProductKnotADO GetInstant()
        {
            if (instant == null)
                instant = new ProductKnotADO();
            return instant;
        }
        private ProductKnotADO() { }

        public List<sxsProductKnot> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductKnot>("SP_ProductKnot_Search", param, logger).ToList();
        }

        public List<sxsProductKnot> GetById(int id, Logger logger = null)
        {
            string cmd = "exec SP_ProductKnot_GetById @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsProductKnot>(cmd, param, logger).ToList();
        }

        public List<sxsProductKnot> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductKnot_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductKnot>(cmd, param, logger).ToList();
        }
    }
}
