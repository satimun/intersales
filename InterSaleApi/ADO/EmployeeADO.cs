using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class EmployeeADO : BaseADO
    {
        private static EmployeeADO instant;
        public static EmployeeADO GetInstant()
        {
            if (instant == null)
                instant = new EmployeeADO();
            return instant;
        }
        private EmployeeADO() { }

        public List<sxsEmployee> GetByID(int id)
        {
            string cmd = "exec SP_Employee_GetByID @id";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);

            return Query<sxsEmployee>(cmd, param).ToList();
        }
        public List<sxsEmployee> List()
        {
            string cmd = "exec SP_Employee_List";
            return Query<sxsEmployee>(cmd).ToList();
        }

        public sxsEmployee Get(string Code)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@Code", Code);

            string cmd = "SELECT * FROM sxsEmployee " +
                "WHERE Code=@Code;";

            return Query<sxsEmployee>(cmd, param).FirstOrDefault();
        }

        public int Sync(string code)
        {
            string cmd = "SP_JOB_UPDATE_Employee";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return ExecuteNonQuerySP(cmd, param);
            
        }

        public List<sxsEmployee> GetByCode(string code)
        {
            string cmd = "exec SP_Employee_GetByCode @code";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);

            return Query<sxsEmployee>(cmd, param).ToList();
        }

        public List<sxsEmployee> GetByToken(string token)
        {
            string cmd = "exec SP_Employee_GetByToken @token";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@token", token);

            return Query<sxsEmployee>(cmd, param).ToList();
        }

        public List<EmployeePositionCriteria> Search(string search, List<string> positionCodes, List<string> status, Logger logger = null)
        {
            string cmd = "exec SP_Employee_Search @search,@positionCodes,@status";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@search", search);
            param.Add("@positionCodes", string.Join(',', positionCodes));
            param.Add("@status", string.Join(',', status));

            return Query<EmployeePositionCriteria>(cmd, param, logger).ToList();
        }

        public List<EmployeePositionCriteria> SearchSale(string search, List<string> status, Logger logger = null)
        {
            string cmd = "exec SP_Employee_SearchSale @search, @status";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@search", search);
            param.Add("@status", string.Join(',', status));

            return Query<EmployeePositionCriteria>(cmd, param, logger).ToList();
        }

        public List<sxsCustomer> ListOption(List<int> positionID, List<int> departmentID, List<string> status, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@positionIDs", string.Join(',', positionID));
            param.Add("@departmentIDs", string.Join(',', departmentID));
            param.Add("@status", string.Join(',', status));
            var res = QuerySP<sxsCustomer>("SP_Customer_ListOption", param, logger).ToList();
            return res;
        }

        public int ChangePassword(string oldPass, string newPass, string matchPass, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@oldPass", oldPass);
            param.Add("@newPass", newPass);
            param.Add("@matchPass", matchPass);
            param.Add("@empID", empID);
            var res = ExecuteScalarSP<int>("SP_Employee_ChangePass", param, logger);
            return res;
        }
    }
        
}
