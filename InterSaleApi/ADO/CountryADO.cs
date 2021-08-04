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
    public class CountryADO : BaseADO
    {
        private static CountryADO instant;
        public static CountryADO GetInstant()
        {
            if (instant == null)
                instant = new CountryADO();
            return instant;
        }
        private CountryADO() { }

        //public List<sxsCountry> List(Logger logger = null)
        //{
        //    return Query<sxsCountry>("exec SP_Country_List", null, logger).ToList();
        //}

        public List<sxsCountry> Search(int countryGroupID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", countryGroupID);

            return QuerySP<sxsCountry>("SP_Country_Search", param, logger).ToList();
        }

        public List<sxsCountry> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsCountry>("SP_Country_Search", param, logger).ToList();
        }

        public List<sxsCountry> List(Logger logger = null)
        {
            string cmd = "SP_Country_List";
            return QuerySP<sxsCountry>(cmd, null, logger).ToList();
        }

        public List<CountrySearchCountryGroup> SearchCountryGroup(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@countryGroupIDs", StringUtil.Join(",", d.ids1));
            param.Add("@groupTypes", StringUtil.Join(",", d.groupTypes));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<CountrySearchCountryGroup>("SP_Country_SearchCountryGroup", param, logger).ToList();
        }

        //public List<sxsCountry> GetByCode(string code, Logger logger = null)
        //{
        //    string cmd = "exec SP_CountryGroup_GetByCode @code";
        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@code", code);
        //    return Query<sxsCountry>(cmd, param, logger).ToList();
        //}
    }
}
