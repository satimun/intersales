using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class LanguageADO : BaseADO
    {
        private static LanguageADO instant;
        public static LanguageADO GetInstant()
        {
            if (instant == null)
                instant = new LanguageADO();
            return instant;
        }
        private LanguageADO() { }

        public List<sxsLanguage> ListLanguage(Logger logger = null)
        {
            string cmd = "exec SP_Language_ListLanguage";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            return Query<sxsLanguage>(cmd, param, logger).ToList();
        }


        public List<sxsLanguage> UpdateStatus(SqlTransaction transac, int ID, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_Language_UpdateStatus @ID, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@status", status);
            param.Add("@empID", empID);
            return Query<sxsLanguage>(transac, cmd, param, logger).ToList();
        }

        public List<sxsLanguage> SaveLanguage(SqlTransaction transac,
           int ID, string IconURL, string Code, string Description, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_Language_SaveLanguage @ID, @IconURL, @Code, @Description, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@IconURL", IconURL);
            param.Add("@Code", Code);
            param.Add("@Description", Description);
            param.Add("@status", status);
            param.Add("@empID", empID);

            return Query<sxsLanguage>(transac, cmd, param, logger).ToList();
        }

        
        public List<GetLanguageTemplates> SearchTemplate(string languageGroupID , List<string> languageID, List<string> status, Logger logger = null)
        {
            string cmd = "exec SP_LanguageGroup_SearchTemplate @languageID,@languageGroupID,@status";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@languageID", string.Join(',', languageID));
            param.Add("@languageGroupID",  languageGroupID);
            param.Add("@status", string.Join(',', status));

            return Query<GetLanguageTemplates>(cmd, param, logger).ToList();
        }
    }
}
