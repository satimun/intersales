using InterSaleModel.Model.API.Request;
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
    public class RemarkADO : BaseADO
    {
        private static RemarkADO instant;
        public static RemarkADO GetInstant()
        {
            if (instant == null)
                instant = new RemarkADO();
            return instant;
        }
        private RemarkADO() { }

        public List<RemarkGetData> GetData(GetDataReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@groupTypes", String.Join(",", d.groupTypes));
            param.Add("@status", String.Join(",", d.status));

            return QuerySP<RemarkGetData>("SP_Remark_GetData", param, logger).ToList();
        }

        public List<RemarkGetData> SaveGroup(SqlTransaction transac, RemarkGetDataRes.RemarkGroup d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", d.id);
            param.Add("@code", StringUtil.GetStringValue(d.code));
            param.Add("@description", StringUtil.GetStringValue(d.description));
            param.Add("@groupType", d.groupType);
            param.Add("@status", d.status);
            param.Add("@empID", empID);

            return QuerySP<RemarkGetData>(transac, "SP_RemarkGroup_Save", param, logger).ToList();
        }

        public List<RemarkGetData> SaveText(SqlTransaction transac, RemarkGetDataRes.RemarkGroup.Remark d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", d.id);
            param.Add("@code", StringUtil.GetStringValue(d.code));
            param.Add("@description", StringUtil.GetStringValue(d.description));
            param.Add("@remarkGroupID", d.remarkGroupID);
            param.Add("@status", d.status);
            param.Add("@empID", empID);

            return QuerySP<RemarkGetData>(transac, "SP_Remark_Save", param, logger).ToList();
        }

        public List<RemarkGetData> UpdateGroupStatus(SqlTransaction transac, UpdateStatusReq d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", String.Join(",", d.ids));
            param.Add("@status", d.status);
            param.Add("@empID", empID);

            return QuerySP<RemarkGetData>(transac, "SP_RemarkGroup_UpdateStatus", param, logger).ToList();
        }

        public List<RemarkGetData> UpdateTextStatus(SqlTransaction transac, UpdateStatusReq d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", String.Join(",", d.ids));
            param.Add("@status", d.status);
            param.Add("@empID", empID);

            return QuerySP<RemarkGetData>(transac, "SP_Remark_UpdateStatus", param, logger).ToList();
        }

        public List<RemarkGetData> SearchGroup(RemarkSearchReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", String.Join(",", d.ids));
            param.Add("@groupTypes", String.Join(",", d.groupTypes));
            param.Add("@status", String.Join(",", d.status));

            return QuerySP<RemarkGetData>("SP_RemarkGroup_Search", param, logger).ToList();
        }

        public List<RemarkGetData> Search(RemarkSearchReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", String.Join(",", d.ids));
            param.Add("@groupTypes", String.Join(",", d.groupTypes));
            param.Add("@remarkGroupIDs", String.Join(",", d.remarkGroupIDs));
            param.Add("@status", String.Join(",", d.status));

            return QuerySP<RemarkGetData>("SP_Remark_Search", param, logger).ToList();
        }

    }
}
