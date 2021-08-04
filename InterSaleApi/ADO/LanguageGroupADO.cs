using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class LanguageGroupADO : BaseADO
    {
        private static LanguageGroupADO instant;
        public static LanguageGroupADO GetInstant()
        {
            if (instant == null)
                instant = new LanguageGroupADO();
            return instant;
        }
        private LanguageGroupADO() { }

        public List<sxsLanguageGroup> ListGroup(List<string> status, Logger logger = null)
        {
            string cmd = "exec SP_LanguageGroup_ListGroup  @status";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@status", string.Join(',', status));

            return Query<sxsLanguageGroup>(cmd, param, logger).ToList();
        }

        public List<sxsLanguageGroup> UpdateStatus(SqlTransaction transac, int ID, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_LanguageGroup_UpdateStatus @ID, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@status", status);
            param.Add("@empID", empID);
            return Query<sxsLanguageGroup>(transac, cmd, param, logger).ToList();
        }

        public List<sxsLanguage> SaveGroup(SqlTransaction transac,
           int ID , string Code, string Description, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_LanguageGroup_SaveGroup @ID , @Code, @Description, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);           
            param.Add("@Code", Code);
            param.Add("@Description", Description);
            param.Add("@status", status);
            param.Add("@empID", empID);

            return Query<sxsLanguage>(transac, cmd, param, logger).ToList();
        }

    }
}
