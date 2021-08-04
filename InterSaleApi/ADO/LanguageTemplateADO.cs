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
    public class LanguageTemplateADO : BaseADO
    {
        private static LanguageTemplateADO instant;
        public static LanguageTemplateADO GetInstant()
        {
            if (instant == null)
                instant = new LanguageTemplateADO();
            return instant;
        }
        private LanguageTemplateADO() { }

        public List<sxsLanguageTemplate> UpdateStatus(SqlTransaction transac, int ID, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_LanguageTemplate_UpdateStatus @ID, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@status", status);
            param.Add("@empID", empID);
            return Query<sxsLanguageTemplate>(transac, cmd, param, logger).ToList();
        }

        public List<GetLanguageTemplates> SaveTemplate(SqlTransaction transac,
          int Templates_ID, string Templates_Code, int Group_id, int Dictionary_ID, string Dictionary_Message, int Language_ID,String  status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_LanguageTemplate_SaveTemplate @Templates_ID, @Templates_Code, @Group_id, @Dictionary_ID,@Dictionary_Message,@Language_ID, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Templates_ID", Templates_ID);
            param.Add("@Templates_Code", Templates_Code);
            param.Add("@Group_id", Group_id);
          
            param.Add("@Dictionary_ID", Dictionary_ID);
            param.Add("@Dictionary_Message", Dictionary_Message);
            param.Add("@Language_ID", Language_ID);

            param.Add("@status", status);
            param.Add("@empID", empID);

            return Query<GetLanguageTemplates>(transac, cmd, param, logger).ToList();
        }

    }
}
