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
    public class ProductStretchingADO : BaseADO
    {
        private static ProductStretchingADO instant;
        public static ProductStretchingADO GetInstant()
        {
            if (instant == null)
                instant = new ProductStretchingADO();
            return instant;
        }
        private ProductStretchingADO() { }

        public List<sxsProductStretching> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductStretching>("SP_ProductStretching_Search", param, logger).ToList();
        }

        public List<sxsProductStretching> GetById(int id, Logger logger = null)
        {
            string cmd = "exec SP_ProductStretching_GetById @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsProductStretching>(cmd, param, logger).ToList();
        }

        public List<sxsProductStretching> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductStretching_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductStretching>(cmd, param, logger).ToList();
        }
    }
}
