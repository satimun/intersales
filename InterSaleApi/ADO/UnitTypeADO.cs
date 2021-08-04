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
    public class UnitTypeADO : BaseADO
    {
        private static UnitTypeADO instant;
        public static UnitTypeADO GetInstant()
        {
            if (instant == null)
                instant = new UnitTypeADO();
            return instant;
        }
        private UnitTypeADO() { }

        public List<sxsUnitType> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@groupTypes", StringUtil.Join(",", d.groupTypes));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsUnitType>("SP_UnitType_Search", param, logger).ToList();
        }

        public List<UnitTypeConvertList> ProductTypeList(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@productTypeID", d.id);

            return QuerySP<UnitTypeConvertList>("SP_UnitType_ProductTypeList", param, logger).ToList();
        }


        public List<sxsUnitType> List(Logger logger = null)
        {
            string cmd = "exec SP_UnitType_List";
            return Query<sxsUnitType>(cmd).ToList();
        }

        public List<sxsUnitType> GetByCode(string code, Logger logger = null, string @groupType = "S")
        {
            string cmd = "exec SP_UnitType_GetByCode @code, @groupType";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);
            param.Add("@groupType", @groupType);

            return Query<sxsUnitType>(cmd, param, logger).ToList();
        }
    }
}
