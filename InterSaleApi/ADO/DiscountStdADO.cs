using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class DiscountStdADO : BaseADO
    {
        private static DiscountStdADO instant;
        public static DiscountStdADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountStdADO();
            return instant;
        }
        private DiscountStdADO() { }

        public List<sxsDiscountStdMain> Search(int customerID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerID", customerID);

            return QuerySP<sxsDiscountStdMain>("SP_DiscountStd_SearchMain", param, logger).ToList();
        }

        public List<DiscountStdSearchMain> SearchMain(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerIDs", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.Join(",", d.status));
            param.Add("@productTypeIDs", StringUtil.Join(",", d.ids1));
            param.Add("@productGradeIDs", StringUtil.Join(",", d.ids2));

            return QuerySP<DiscountStdSearchMain>("SP_DiscountStd_SearchMain", param, logger).ToList();
        }

        public List<DiscountStdSearchEffectiveDate> SearchEffectiveDate(SearchEffectiveDateReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            param.Add("@discountStdMainIDs", StringUtil.Join(",", d.ids));
            param.Add("@dateFrom", DateTimeUtil.GetDate(d.dateFrom));
            param.Add("@dateTo", DateTimeUtil.GetDate(d.dateTo));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<DiscountStdSearchEffectiveDate>("SP_DiscountStd_SearchEffectiveDate", param, logger).ToList();
        }
        
        public List<DiscountStdSearchRangeH> SearchRangeH(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<DiscountStdSearchRangeH>("SP_DiscountStd_SearchRangeH", param, logger).ToList();
        }

        public List<DiscountStdSearchProdValue> SearchProdValue(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<DiscountStdSearchProdValue>("SP_DiscountStd_SearchProdValue", param, logger).ToList();
        }

        public List<DiscountStdSearchRangeValue> SearchRangeValue(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", StringUtil.Join(",", d.ids));
            param.Add("@discountRangeHID", StringUtil.Join(",", d.ids1));
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<DiscountStdSearchRangeValue>("SP_DiscountStd_SearchRangeValue", param, logger).ToList();
        }

        public List<DiscountStdCloneSearch> CloneSearch(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerID", d.id);
            param.Add("@effectiveDate", d.search.GetDate());
            param.Add("@productTypeIDs", d.ids.Join(","));

            return QuerySP<DiscountStdCloneSearch>("SP_DiscountStd_CloneSearch", param, logger).ToList();
        }

        public int CloneSave(SqlTransaction transac, DiscountStdCloneSearchRes.DiscountCloneSearh d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@mainID", d.id);
            param.Add("@effectiveDateID", d.discountStdEffectiveDate.id);
            param.Add("@customerID", d.customer.id);
            param.Add("@dateFrom", d.effectiveDateFrom.GetDate());
            param.Add("@dateTo", d.effectiveDateTo.GetDate());
            param.Add("@empID", empID);

            return ExecuteScalarSP<int>(transac, "SP_DiscountStd_CloneSave", param, logger);
        }

        public List<DiscountStdSearchHeader> SearchHeader(SearchEffectiveDateReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerIDs", d.ids.Join(","));
            param.Add("@dateFrom", d.dateFrom.GetDate());
            param.Add("@dateTo", d.dateTo.GetDate());
            param.Add("@status", d.status.Join(","));

            return QuerySP<DiscountStdSearchHeader>("SP_DiscountStd_SearchHeader", param, logger).ToList();
        }

        public List<DiscountStdSearchDetail> SearchDetail(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@mainID", d.ids.First());
            param.Add("@effectiveID", d.ids1.First());
            param.Add("@status", d.status.Join(","));

            return QuerySP<DiscountStdSearchDetail>("SP_DiscountStd_SearchDetail", param, logger).ToList();
        }

        public string Approval(SqlTransaction transac, int valueID, string actionFlag, int updateFlagID, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@valueID", valueID);
            param.Add("@actionFlag", actionFlag);
            param.Add("@updateFlagID", updateFlagID);
            param.Add("@empID", empID);

            return ExecuteScalarSP<string>(transac, "SP_DiscountStd_Approval", param, logger);
        }

        public List<DiscountStdSearchDiscountForPrice> SearchDiscountForPrice(DiscountStdSearchDiscountForPriceReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", d.effectiveDateFrom);
            param.Add("@dateTo", d.effectiveDateTo);

            param.Add("@countryGroupID", d.countryGroupID);

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

            return QuerySP<DiscountStdSearchDiscountForPrice>("SP_DiscountStd_SearchDiscountForPrice", param, logger).ToList();
        }

        public List<DiscountListCustomer> DiscountListCustomer(int mainID, int effectiveID)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@mainID", mainID);
            param.Add("@effectiveID", effectiveID);

            string cmd = "SELECT " +
            "dsm.ID, " +
            "dsd.ID 'DiscountStdEffectiveDate_ID', " +
            "dsd.EffectiveDateFrom, " +
            "dsd.EffectiveDateTo, " +
            "cm.Code 'Customer_Code' " +
            "FROM ( " +
                "SELECT * FROM sxsDiscountStdMain dsm WHERE dsm.ID = @mainID " +
            ") dsm " +
            "INNER JOIN sxsDiscountStdEffectiveDate dsd ON dsd.DiscountStdMain_ID = dsm.ID AND dsd.ID = @effectiveID " +
            "INNER JOIN sxsCustomer cm ON cm.ID = dsm.Customer_ID";

            return Query<DiscountListCustomer>(cmd, param).ToList();
        }

    }
}
