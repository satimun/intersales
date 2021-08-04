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
    public class ProductTypeADO : BaseADO
    {
        private static ProductTypeADO instant;
        public static ProductTypeADO GetInstant()
        {
            if (instant == null)
                instant = new ProductTypeADO();
            return instant;
        }
        private ProductTypeADO() { }

        public List<sxsProductType> List(Logger logger = null)
        {
            return Query<sxsProductType>("exec SP_ProductType_List").ToList();
        }

        public List<sxsProductType> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductType_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductType>(cmd, param, logger).ToList();
        }

        public List<sxsProductType> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductType>("SP_ProductType_Search", param, logger).ToList();
        }
    }
}
