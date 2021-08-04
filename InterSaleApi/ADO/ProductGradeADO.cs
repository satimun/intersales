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
    public class ProductGradeADO : BaseADO
    {
        private static ProductGradeADO instant;
        public static ProductGradeADO GetInstant()
        {
            if (instant == null)
                instant = new ProductGradeADO();
            return instant;
        }
        private ProductGradeADO() { }

        public List<sxsProductGrade> List(Logger logger = null)
        {
            return Query<sxsProductGrade>("exec SP_ProductGrade_List").ToList();
        }

        public List<sxsProductGrade> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_ProductGrade_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsProductGrade>(cmd, param, logger).ToList();
        }

        public List<sxsProductGrade> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsProductGrade>("SP_ProductGrade_Search", param, logger).ToList();
        }
    }
}
