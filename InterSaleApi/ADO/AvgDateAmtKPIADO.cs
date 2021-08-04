using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class AvgDateAmtKPIADO : BaseADO
    {
        private static AvgDateAmtKPIADO instant;
        public static AvgDateAmtKPIADO GetInstant()
        {
            if (instant == null)
                instant = new AvgDateAmtKPIADO();
            return instant;
        }
        private AvgDateAmtKPIADO() { }

        public List<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI> List(Logger logger = null)
        {
            return Query<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI>("SELECT * FROM sxsAvgDateAmtKPI", null, logger).ToList();
        }

        public List<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@year", String.Join(",", d.ids));
            param.Add("@zoneAccountIDs", String.Join(",", d.ids1));
            param.Add("@status", String.Join(",", d.status));

            return QuerySP<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI>("SP_AvgDateAmtKPI_Search", param, logger).ToList();
        }

        public List<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI> Save(SqlTransaction transac, AvgDayAmtKPIRes.AvgDay d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Year", d.year);
            param.Add("@ZoneAccount_ID", d.zone.id);
            param.Add("@AvgPeriodDay", d.avgPeriodDay);
            param.Add("@Status", StringUtil.GetStringValue(d.status));
            param.Add("@empID", empID);

            var res = QuerySP<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI>(transac, "SP_AvgDateAmtKPI_Save", param, logger).ToList();
            return res;
        }

        public List<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI> UpdataStatus(SqlTransaction transac, InterSaleModel.Model.Entity.sxsAvgDateAmtKPI d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Year", d.Year);
            param.Add("@ZoneAccount_ID", d.ZoneAccount_ID);
            param.Add("@status", StringUtil.GetStringValue(d.Status));
            param.Add("@empID", empID);

            return QuerySP<InterSaleModel.Model.Entity.sxsAvgDateAmtKPI>(transac, "SP_AvgDateAmtKPI_UpdateStatus", param, logger).ToList();
        }
    }
}
