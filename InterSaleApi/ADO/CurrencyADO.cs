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
    public class CurrencyADO : BaseADO
    {
        private static CurrencyADO instant;
        public static CurrencyADO GetInstant()
        {
            if (instant == null)
                instant = new CurrencyADO();
            return instant;
        }
        private CurrencyADO() { }

        public List<sxsCurrency> List()
        {
            return this.Query<sxsCurrency>("exec SP_Currency_List").ToList();
        }

        public List<sxsCurrency> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsCurrency>("SP_Currency_Search", param, logger).ToList();
        }

        public List<sxsCurrency> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_Currency_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsCurrency>(cmd, param, logger).ToList();
        }
    }
}
