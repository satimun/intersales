using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Jobs.Request;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PriceSaleExADO : BaseADO
    {
        private static PriceSaleExADO instant;
        public static PriceSaleExADO GetInstant()
        {
            if (instant == null)
                instant = new PriceSaleExADO();
            return instant;
        }
        private PriceSaleExADO() { }

        public List<PridSaleExGetPrice> GetPrice(string countryGroupCode, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@countryGroupCode", countryGroupCode.GetStringValue());
            return QuerySP<PridSaleExGetPrice>("SP_PriceSaleEx_GetPrice", param, logger).ToList();
        }

        public List<PriceSaleExColorGroup> ColorGroup(Logger logger = null)
        {
            return QuerySP<PriceSaleExColorGroup>("SP_PriceSaleEx_ColorGroup", null, logger).ToList();
        }
    }
}
