using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response.PublicModel;
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
    public class CountryGroupADO : BaseADO
    {
        private static CountryGroupADO instant;
        public static CountryGroupADO GetInstant()
        {
            if (instant == null)
                instant = new CountryGroupADO();
            return instant;
        }
        private CountryGroupADO() {}

        public List<sxsCountryGroup> List(Logger logger = null)
        {
            return Query<sxsCountryGroup>("exec SP_CountryGroup_List", null, logger).ToList();
        }

        public List<sxsCountryGroup> GetByCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);
            return Query<sxsCountryGroup>(cmd, param, logger).ToList();
        }

        public List<sxsCountryGroup> GetByCustomerCode(string code, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_GetByCustomerCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);
            return Query<sxsCountryGroup>(cmd, param, logger).ToList();
        }
        
        public List<sxsCountryGroup> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@countryIDs", StringUtil.Join(",", d.ids1));
            param.Add("@customerIDs", StringUtil.Join(",", d.ids2));
            param.Add("@groupTypes", StringUtil.Join(",", d.groupTypes));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<sxsCountryGroup>("SP_CountryGroup_Search", param, logger).ToList();
        }

        public List<CountryGroupSearchCountry> SearchCountry(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@countryIDs", StringUtil.Join(",", d.ids1));
            param.Add("@groupTypes", StringUtil.Join(",", d.groupTypes));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);
            param.Add("@status", StringUtil.Join(",", d.status));

            return QuerySP<CountryGroupSearchCountry>("SP_CountryGroup_SearchCountry", param, logger).ToList();
        }

        public List<sxsCountryGroup> Save(SqlTransaction transac, SearchResModel d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", d.id);
            param.Add("@groupType", d.groupType.GetStringValue());
            param.Add("@code", d.code.GetStringValue());
            param.Add("@description", d.description.GetStringValue());
            param.Add("@status", d.status.GetStringValue());
            param.Add("@empID", empID);

            return QuerySP<sxsCountryGroup>(transac, "SP_CountryGroup_Save", param, logger).ToList();
        }

        public List<CountryGroupSearchCountry> MoveCountry(SqlTransaction transac, CountryGroupMoveCountryReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@countryGroupID", d.countryGroupID);
            param.Add("@countryIDs", StringUtil.Join(",", d.countryIDs));
            param.Add("@groupType", d.groupType);
            param.Add("@empID", empID);

            return QuerySP<CountryGroupSearchCountry>(transac, "SP_CountryGroup_MoveCountry", param, logger).ToList();
        }

        public List<sxsCountryGroup> UpdateStatus(SqlTransaction transac, int ID, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_UpdateStatus @ID, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@status", status);
            param.Add("@empID", empID);

            return Query<sxsCountryGroup>(transac, cmd, param, logger).ToList();
        }

        public List<sxsCountryGroup> ListByType(string GroupType, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_ListByType  @GroupType";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@GroupType", GroupType);

            return Query<sxsCountryGroup>(cmd, param, logger).ToList();
        }

        public List<sxsCountryGroup> SaveGroup(SqlTransaction transac,
            int ID, string GroupType, string Code, string Description, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_SaveGroup @ID, @GroupType, @Code, @Description, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@GroupType", GroupType);
            param.Add("@Code", Code);
            param.Add("@Description", Description);
            param.Add("@status", status);
            param.Add("@empID", empID);

            return Query<sxsCountryGroup>(transac, cmd, param, logger).ToList();
        }

        public List<GetCountryGroupMoveCountryMapping> MoveCountryMapping(SqlTransaction transac, int countryGroupID, int countryID, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_MoveCountryMapping   @CountryGroupID, @CountryID , @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@CountryGroupID", countryGroupID);
            param.Add("@CountryID", countryID);
            param.Add("@empID", empID);
            return Query<GetCountryGroupMoveCountryMapping>(cmd, param, logger).ToList();
        }

        public List<GetCountryGroupMoveCountryMapping>CancelCountryMapping(SqlTransaction transac, int countryGroupID, int countryID, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CountryGroup_CancelCustomerMapping   @CountryGroupID, @CountryID , @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@CountryGroupID", countryGroupID);
            param.Add("@CountryID", countryID);
            param.Add("@empID", empID);
            return Query<GetCountryGroupMoveCountryMapping>(cmd, param, logger).ToList();
        }
    }
}
