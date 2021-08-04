using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Views;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PriceStdADO : BaseADO
    {
        private static PriceStdADO instant;
        public static PriceStdADO GetInstant()
        {
            if (instant == null)
                instant = new PriceStdADO();
            return instant;
        }
        private PriceStdADO() { }

        public List<GetPrice> GetPriceTableR(GetPriceRequest data, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@priceType", "R");
            param.Add("@productGradeID", data.productGradeID);
            param.Add("@productTypeID", data.productTypeID);
            param.Add("@currencyID", data.currencyID);
            param.Add("@customerID", data.customerID);
            param.Add("@effectiveDateFrom", data.effectiveDateFrom);
            param.Add("@effectiveDateTo", data.effectiveDateTo);
            param.Add("@productID", data.productID);
            param.Add("@unitTypeID", data.unitTypeID);

            return QuerySP<GetPrice>("SP_PriceStd_GetPrice", param, logger).ToList();
        }
        public List<GetPrice> GetPriceTableC(GetPriceRequest data, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@priceType", "C");
            param.Add("@productGradeID", data.productGradeID);
            param.Add("@productTypeID", data.productTypeID);
            param.Add("@currencyID", data.currencyID);
            param.Add("@customerID", data.customerID);
            param.Add("@effectiveDateFrom", data.effectiveDateFrom);
            param.Add("@effectiveDateTo", data.effectiveDateTo);
            param.Add("@productID", data.productID);
            param.Add("@unitTypeID", data.unitTypeID);

            return QuerySP<GetPrice>("SP_PriceStd_GetPrice", param, logger).ToList();
        }

        public List<GetPriceForDiscount> SearchByCodeForDiscount(PriceStdSearchByCodeForDiscountRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            param.Add("@effectiveDateFrom", d.effectiveDateFrom);
            param.Add("@effectiveDateTo", d.effectiveDateTo);
            param.Add("@productID", d.productID);
            param.Add("@currencyID", d.currencyID);
            param.Add("@customerID", d.customerID);
            param.Add("@unitTypeID", d.unitTypeID);

            return QuerySP<GetPriceForDiscount>("SP_PriceStd_SearchByCodeForDiscount", param, logger).ToList();
        }

        public List<GetPriceForDiscount> SearchByRangeForDiscount(PriceStdSearchByRangeForDiscountRequest data, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@effectiveDateFrom", data.effectiveDateFrom);
            param.Add("@effectiveDateTo", data.effectiveDateTo);

            param.Add("@productGradeID", data.productGradeID);
            param.Add("@productTypeID", data.productTypeID);
            param.Add("@currencyID", data.currencyID);
            param.Add("@customerID", data.customerID);
            param.Add("@unitTypeID", data.unitTypeID);

            param.Add("@knotID", data.knotID);
            param.Add("@stretchingID", data.stretchingID);
            param.Add("@twineseriesID", data.twineseriesID);
            param.Add("@selvageWovenTypeID", data.selvageWovenTypeID);
            param.Add("@colorgroupID", data.colorGroupID);
            param.Add("@minTwineSizeCode", data.minTwineSizeCode);
            param.Add("@maxTwineSizeCode", data.maxTwineSizeCode);
            param.Add("@minMeshSize", data.minMeshSize);
            param.Add("@maxMeshSize", data.maxMeshSize);
            param.Add("@minMeshDepth", data.minMeshDepth);
            param.Add("@maxMeshDepth", data.maxMeshDepth);
            param.Add("@minLength", data.minLength);
            param.Add("@maxLength", data.maxLength);

            return QuerySP<GetPriceForDiscount>("SP_PriceStd_SearchByRangeForDiscount", param, logger).ToList();
        }

        public List<PriceStdSearchMain> SearchMain(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@countryGroupIDs", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.Join(",", d.status));
            param.Add("@productTypeIDs", StringUtil.Join(",", d.ids1));
            param.Add("@productGradeIDs", StringUtil.Join(",", d.ids2));
            param.Add("@currencyIDs", StringUtil.Join(",", d.ids3));

            return QuerySP<PriceStdSearchMain>("SP_PriceStd_SearchMain", param, logger).ToList();
        }

        public List<PriceStdSearchEffectiveDate> SearchEffectiveDate(SearchEffectiveDateReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            
            param.Add("@priceStdMainIDs", StringUtil.Join(",", d.ids));
            param.Add("@dateFrom", DateTimeUtil.GetDate(d.dateFrom));
            param.Add("@dateTo", DateTimeUtil.GetDate(d.dateTo));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<PriceStdSearchEffectiveDate>("SP_PriceStd_SearchEffectiveDate", param, logger).ToList();
        }

        public List<PriceStdSearchPriceRangeH> SearchPriceRangeH(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@priceEffectiveDateID", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<PriceStdSearchPriceRangeH>("SP_PriceStd_SearchPriceRangeH", param, logger).ToList();
        }

        public List<PriceStdSearchPriceProd> SearchPriceStdProd(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@priceEffectiveDateID", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.Join(",", d.status));
            
            return QuerySP<PriceStdSearchPriceProd>("SP_PriceStd_SearchPriceProd", param, logger).ToList();
        }

        public List<PriceStdSearchPriceRangeValue> SearchPriceStdRangeValue(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@priceEffectiveDateID", StringUtil.Join(",", d.ids));
            param.Add("@priceRangeHID", StringUtil.Join(",", d.ids1));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<PriceStdSearchPriceRangeValue>("SP_PriceStd_SearchPriceRangeValue", param, logger).ToList();
        }
        
        public List<PriceStdSearchPriceForDiscount> SearchPriceForDiscount(PriceStdSearchPriceForDiscountReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", d.effectiveDateFrom);
            param.Add("@dateTo", d.effectiveDateTo);

            param.Add("@customerID", d.customerID);

            param.Add("@productID", d.productID);
            param.Add("@productTypeID", d.productTypeID);
            param.Add("@productGradeID", d.productGradeID);
            param.Add("@currencyID", d.currencyID);
            param.Add("@unitTypeID", d.unitTypeID);

            param.Add("@knotID", d.knotID);
            param.Add("@stretchingID", d.stretchingID);
            param.Add("@selvageWovenTypeID", d.selvageWovenTypeID);
            param.Add("@colorGroupID", d.colorGroupID);

            param.Add("@minTwineSizeCode", d.minTwineSizeCode);
            param.Add("@maxTwineSizeCode", d.maxTwineSizeCode);

            param.Add("@twineseriesID", d.twineseriesID);

            param.Add("@minMeshSize", d.minMeshSize);
            param.Add("@maxMeshSize", d.maxMeshSize);
            param.Add("@minMeshDepth", d.minMeshDepth);
            param.Add("@maxMeshDepth", d.maxMeshDepth);
            param.Add("@minLength", d.minLength);
            param.Add("@maxLength", d.maxLength);
            param.Add("@approvedFlag", d.approvedFlag.GetStringValue());

            return QuerySP<PriceStdSearchPriceForDiscount>("SP_PriceStd_SearchPriceForDiscount", param, logger).ToList();
        }

        public List<PriceStdCloneSearch> CloneSearch(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@countryGroupID", d.id);
            param.Add("@effectiveDate", d.search.GetDate());
            param.Add("@productTypeIDs", d.ids.Join(","));

            return QuerySP<PriceStdCloneSearch>("SP_PriceStd_CloneSearch", param, logger).ToList();
        }

        public int CloneSave(SqlTransaction transac, PriceStdCloneSearchRes.PriceCloneSearh d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@mainID", d.id);
            param.Add("@effectiveDateID", d.priceStdEffectiveDate.id);
            param.Add("@dateFrom", d.effectiveDateFrom.GetDate());
            param.Add("@dateTo", d.effectiveDateTo.GetDate());
            param.Add("@empID", empID);
            return ExecuteScalarSP<int>(transac, "SP_PriceStd_CloneSave", param, logger);
        }

        public List<PriceStdSearchHeader> SearchHeader(SearchEffectiveDateReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@countryGroupIDs", d.ids.Join(","));
            param.Add("@dateFrom", d.dateFrom.GetDate());
            param.Add("@dateTo", d.dateTo.GetDate());
            param.Add("@status", d.status.Join(","));

            return QuerySP<PriceStdSearchHeader>("SP_PriceStd_SearchHeader", param, logger).ToList();
        }

        public List<PriceStdSearchDetail> SearchDetail(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@mainID", d.ids.First());
            param.Add("@effectiveID", d.ids1.First());
            param.Add("@status", d.status.Join(","));

            return QuerySP<PriceStdSearchDetail>("SP_PriceStd_SearchDetail", param, logger).ToList();
        }

        public string Approval(SqlTransaction transac, int valueID, string actionFlag, int updateFlagID, int empID , Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@valueID", valueID);
            param.Add("@actionFlag", actionFlag);
            param.Add("@updateFlagID", updateFlagID);
            param.Add("@empID", empID);

            return ExecuteScalarSP<string>(transac, "SP_PriceStd_Approval", param, logger);
        }

        public List<PridListCountry> PridListCountry(int mainID, int effectiveID)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@mainID", mainID);
            param.Add("@effectiveID", effectiveID);

            string cmd = "SELECT " +
            "psm.ID, " +
            "psd.ID 'PriceStdEffectiveDate_ID', " +
            "psd.EffectiveDateFrom, " +
            "psd.EffectiveDateTo, " +
            "ct.Code 'Country_Code' " +
            "FROM ( " +
                "SELECT * FROM sxsPriceStdMain psm WHERE psm.ID = @mainID " +
            ") psm " +
            "INNER JOIN sxsPriceStdEffectiveDate psd ON psd.PriceStdMain_ID = psm.ID AND psd.ID = @effectiveID " +
            "INNER JOIN sxsCountryGroupMapping cgm ON cgm.CountryGroup_ID = psm.CountryGroup_ID " +
            "INNER JOIN sxsCountry ct ON ct.ID = cgm.Country_ID";

            return Query<PridListCountry>(cmd, param).ToList();
        }

    }
}
