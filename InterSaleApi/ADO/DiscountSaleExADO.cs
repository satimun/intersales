using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class DiscountSaleExADO : BaseADO
    {
        private static DiscountSaleExADO instant;
        public static DiscountSaleExADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountSaleExADO();
            return instant;
        }
        private DiscountSaleExADO() { }

        public List<DiscountSaleExGetDistcount> GetDiscount(string customerCode, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerCode", customerCode.GetStringValue());
            return QuerySP<DiscountSaleExGetDistcount>("SP_DiscountSaleEx_GetDiscount", null, logger).ToList();
        }

        public List<DiscountSaleExColorGroup> ColorGroup(Logger logger = null)
        {
            return QuerySP<DiscountSaleExColorGroup>("SP_DiscountSaleEx_ColorGroup", null, logger).ToList();
        }
    }
}
