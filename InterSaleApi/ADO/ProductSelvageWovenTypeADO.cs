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
    public class ProductSelvageWovenTypeADO : BaseADO
    {
        private static ProductSelvageWovenTypeADO instant;
        public static ProductSelvageWovenTypeADO GetInstant()
        {
            if (instant == null)
                instant = new ProductSelvageWovenTypeADO();
            return instant;
        }
        private ProductSelvageWovenTypeADO() { }

        public List<sxsProductSelvageWovenType> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductSelvageWovenType>("SP_ProductSelvageWovenType_Search", param, logger).ToList();
        }

        public List<sxsProductSelvageWovenType> GetById(int id, Logger logger = null)
        {
            string cmd = "exec SP_ProductSelvageWovenType_GetById @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsProductSelvageWovenType>(cmd, param, logger).ToList();
        }

        public List<sxsProductSelvageWovenType> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductSelvageWovenType_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductSelvageWovenType>(cmd, param, logger).ToList();
        }
    }
}
