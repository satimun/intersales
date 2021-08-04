using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class PortLoadingADO : BaseADO
    {
        private static PortLoadingADO instant;
        public static PortLoadingADO GetInstant()
        {
            if (instant == null)
                instant = new PortLoadingADO();
            return instant;
        }
        private PortLoadingADO() { }

        public List<sxsPortLoading> List(Logger logger = null)
        {
            //string cmd = "exec SP_ProductTwineSeries_GetByID @id";
            //Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            //param.Add("@id", id);

            return QuerySP<sxsPortLoading>("SP_PortLoading_List", null, logger).ToList();
        }

        public List<sxsPortLoading> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", String.Join(",", d.ids));
            param.Add("@search", d.search);
            param.Add("@status", String.Join(",", d.status));

            return QuerySP<sxsPortLoading>("SP_PortLoading_Search", param, logger).ToList();
        }

        public List<sxsPortLoading> Save(SqlTransaction transac, PortLoadingRes.PortLoading d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", d.id);
            param.Add("@code", StringUtil.GetStringValue(d.code));
            param.Add("@description", StringUtil.GetStringValue(d.description));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            var res = QuerySP<sxsPortLoading>(transac, "SP_PortLoading_Save", param, logger).ToList();
            //StaticValueManager.GetInstant().sxsPortLoading_load();
            return res;
        }

        public List<sxsPortLoading> UpdataStatus(SqlTransaction transac, UpdateStatusReq d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", String.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            var res = QuerySP<sxsPortLoading>(transac, "SP_PortLoading_UpdateStatus", param, logger).ToList();
            //StaticValueManager.GetInstant().sxsPortLoading_load();
            return res;
        }

    }
}
