using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class UnitConvertADO : BaseADO
    {
        private static UnitConvertADO instant;
        public static UnitConvertADO GetInstant()
        {
            if (instant == null)
                instant = new UnitConvertADO();
            return instant;
        }
        private UnitConvertADO() { }

        public List<UnitConvertSearch> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@unitTypeIDs", d.ids.Join(","));
            param.Add("@unitTypeIDs2", d.ids1.Join(","));
            param.Add("@search", d.search);
            param.Add("@status", d.status.Join(","));

            return QuerySP<UnitConvertSearch>("SP_UnitConvert_Search", param, logger).ToList();
        }
    }
}
