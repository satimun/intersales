using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Views;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class CustomerADO : BaseADO
    {
        private static CustomerADO instant;
        public static CustomerADO GetInstant()
        {
            if (instant == null)
                instant = new CustomerADO();
            return instant;
        }
        private CustomerADO() { }

        public List<sxsCustomer> List()
        {
            string cmd = "exec SP_Customer_List";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            return Query<sxsCustomer>(cmd, param).ToList();
        }

        public List<sxsCustomer> GetByID(int id, Logger logger = null)
        {
            string cmd = "exec SP_Customer_GetByID @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsCustomer>(cmd, param, logger).ToList();
        }

        public List<sxsCustomer> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_Customer_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsCustomer>(cmd, param, logger).ToList();
        }
        //public List<sxsCustomer> Search(string search, List<string> status, Logger logger = null)
        //{
        //    string cmd = "exec SP_Customer_Search @search, @status";
        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@search", search);
        //    param.Add("@status", string.Join(',', status));

        //    return Query<sxsCustomer>(cmd, param, logger).ToList();
        //}

        public List<CustomerSearch> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<CustomerSearch>("SP_Customer_Search", param, logger).ToList();
        }

        public List<CustomerForFilter> ForFilter(ShipmentPlanForecastReport2Req d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerIDs", StringUtil.Join(",", d.customerIDs));
            param.Add("@zoneAccountIDs", StringUtil.Join(",", d.zoneAccountIDs));
            param.Add("@regionalZoneIDs", StringUtil.Join(",", d.regionalZoneIDs));
            param.Add("@countryIDs", StringUtil.Join(",", d.countryIDs));
            param.Add("@saleEmployeeID", d.saleEmployeeID);

            return QuerySP<CustomerForFilter>("SP_Customer_ForFilter", param, logger).ToList();
        }

        public List<sxvCustomer> ListByCode(List<string> Codes, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerNull", ListUtil.ListNull(Codes));

            string cmd = "SELECT * FROM sxvCustomer " +
                $"WHERE ( @customerNull IS NULL OR Code IN ('{Codes.Join("','")}') )";

            return Query<sxvCustomer>(cmd, param, logger).ToList();
        }
    }
}
