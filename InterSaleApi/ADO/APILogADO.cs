using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class APILogADO : BaseADO
    {
        private static APILogADO instant;
        public static APILogADO GetInstant()
        {
            if (instant == null)
                instant = new APILogADO();
            return instant;
        }
        private APILogADO() { }

        public int Insert(string refID, string token, string apiName, int employee_ID, string employee_Name, string serverName, string input)
        {
            string cmd = "exec SP_APILog_Insert @refID, @token, @apiName, @employee_ID, @employee_Name, @serverName, @input";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@refID", refID);
            param.Add("@token", token);
            param.Add("@apiName", apiName);
            param.Add("@apiName", apiName);
            param.Add("@employee_ID", employee_ID);
            param.Add("@employee_Name", employee_Name);
            param.Add("@serverName", serverName);
            param.Add("@input", input);

            return ExecuteScalar<int>(cmd, param);
        }

        public int Update(int id, string statusCode, string statusMessage, string output, string technicalMessage = "", string remark1 = "", string remark2 = "", string remark3 = "" )
        {
            string cmd = "exec SP_APILog_Update @id, @statusCode, @statusMessage, @output, @technicalMessage, @remark1, @remark2, @remark3";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", id);
            param.Add("@statusCode", statusCode);
            param.Add("@statusMessage", statusMessage);
            param.Add("@output", output);
            param.Add("@technicalMessage", technicalMessage);
            param.Add("@remark1", remark1);
            param.Add("@remark2", remark2);
            param.Add("@remark3", remark3);

            return ExecuteNonQuery(cmd, param);
        }

        //public List<sxsDiscountStdMain> Search(int customerID)
        //{
        //    string cmd = "exec SP_DiscountStd_SearchMain @customerID";
        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@customerID", customerID);

        //    return Query<sxsDiscountStdMain>(cmd, param).ToList();
        //}
    }
}
