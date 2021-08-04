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
    public class ProductTwineSeriesADO : BaseADO
    {
        private static ProductTwineSeriesADO instant;
        public static ProductTwineSeriesADO GetInstant()
        {
            if (instant == null)
                instant = new ProductTwineSeriesADO();
            return instant;
        }
        private ProductTwineSeriesADO() { }

        public List<sxsProductTwineSeries> Get(int UnitType_ID, int PackageType_ID, decimal AmountPackage, decimal AmountUnitPerPackage, Logger logger = null)
        {
            string cmd = "exec SP_ProductTwineSeries_Get @UnitType_ID, @PackageType_ID, @AmountPackage, @AmountUnitPerPackage";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@UnitType_ID", UnitType_ID);
            param.Add("@PackageType_ID", PackageType_ID);
            param.Add("@AmountPackage", AmountPackage);
            param.Add("@AmountUnitPerPackage", AmountUnitPerPackage);

            return Query<sxsProductTwineSeries>(cmd, param, logger).ToList();
        }

        public List<sxsProductTwineSeries> GetByID(int id, Logger logger = null)
        {
            string cmd = "exec SP_ProductTwineSeries_GetByID @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsProductTwineSeries>(cmd, param, logger).ToList();
        }

        public List<sxsProductTwineSeries> GetByCode(string code, int productTypeID, Logger logger = null)
        {
            string cmd = "exec SP_ProductTwineSeries_GetByCode @code, @productTypeID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);
            param.Add("@productTypeID", productTypeID);

            return Query<sxsProductTwineSeries>(cmd, param, logger).ToList();
        }

        public List<ProductTwineSeriesSearch> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@productTypeIDs", StringUtil.Join(",", d.ids1));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<ProductTwineSeriesSearch>("SP_ProductTwineSeries_Search", param, logger).ToList();
        }

        
    }
}
