using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class LanguageDictionaryADO : BaseADO
    {
        private static LanguageDictionaryADO instant;
        public static LanguageDictionaryADO GetInstant()
        {
            if (instant == null)
                instant = new LanguageDictionaryADO();
            return instant;
        }
        private LanguageDictionaryADO() { }

        public List<LanguageDictionary> Search(string lang, string group, Logger logger = null)
        {
            string cmd = "exec SP_LanguageDictionary_Search @lang, @group";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@lang", lang);
            param.Add("@group", group);

            return Query<LanguageDictionary>(cmd, param, logger).ToList();
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
