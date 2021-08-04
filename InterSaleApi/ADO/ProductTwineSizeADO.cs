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
    public class ProductTwineSizeADO : BaseADO
    {
        private static ProductTwineSizeADO instant;
        public static ProductTwineSizeADO GetInstant()
        {
            if (instant == null)
                instant = new ProductTwineSizeADO();
            return instant;
        }
        private ProductTwineSizeADO() { }

        public List<sxsProductTwineSize> GetByCode(string code, int ProductGroup_ID, Logger logger = null)
        {
            string cmd = "exec SP_ProductTwineSize_GetByCode @code, @ProductGroup_ID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);
            param.Add("@ProductGroup_ID", ProductGroup_ID);

            return Query<sxsProductTwineSize>(cmd, param, logger).ToList();
        }

        public List<sxsProductTwineSize> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@productGroupIDs", StringUtil.Join(",", d.ids1));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductTwineSize>("SP_ProductTwineSize_Search", param, logger).ToList();
        }
    }
}
