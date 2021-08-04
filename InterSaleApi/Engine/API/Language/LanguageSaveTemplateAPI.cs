using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Language
{
    public class LanguageSaveTemplateAPI : BaseAPIEngine<LanguageSaveTemplateRequest, LanguageSaveTemplateResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }
        protected override void ExecuteChild(LanguageSaveTemplateRequest dataReq, LanguageSaveTemplateResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.languageTemplates.Count; i++)
            {
                LanguageSaveTemplateRes tmp = new LanguageSaveTemplateRes();

                for (int j = 0; j < dataReq.languageTemplates[i].dictionarys.Count; j++)
                {
                    LanguageDictionarySaveTemplateRes obj = new LanguageDictionarySaveTemplateRes();

                    try
                    {

                        LanguageTemplateADO.GetInstant().SaveTemplate(transac, dataReq.languageTemplates[i].id, dataReq.languageTemplates[i].code, dataReq.languageTemplates[i].languageGroupID, dataReq.languageTemplates[i].dictionarys[j].id, dataReq.languageTemplates[i].dictionarys[j].message, dataReq.languageTemplates[i].dictionarys[j].languageID, "A", this.employeeID, this.Logger)
                        .ForEach(x => {
                            tmp.id = x.LanguageTemplate_ID;
                            tmp.code = x.LanguageTemplate_Code;                             
                            tmp.status = x.LanguageTemplate_Status;

                            tmp.create.by = BaseValidate.GetEmpName(x.LanguageTemplate_CreateBy);
                            tmp.create.datetime = BaseValidate.GetDateTimeString(x.LanguageTemplate_CreateDate);

                            tmp.modify.by = BaseValidate.GetEmpName(x.LanguageTemplate_ModifyBy);
                            tmp.modify.datetime = BaseValidate.GetDateTimeString(x.LanguageTemplate_ModifyDate);

                            tmp.languageGroup.id = x.LanguageGroup_ID;
                            tmp.languageGroup.code = x.LanguageGroup_Code;
                            tmp.languageGroup.description  = x.LanguageGroup_Description;

                            obj.id = x.LanguageDictionary_ID;
                            obj.message = x.LanguageDictionary_Message;

                            obj.Language.id = x.Language_ID;
                            obj.Language.code = x.Language_Code;
                            obj.Language.description = x.Language_Description ;

                            tmp.dictionarys.Add(obj);

                        }
                        );

                    }
                    catch (Exception ex)
                    {
                        tmp._result._status = "F";
                        tmp._result._message = ex.Message;
                        isSuccess = false;
                    }
                    finally
                    {
                        if (tmp.id == 0)
                        {
                            tmp._result._status = "F";
                            tmp._result._message = "NOT LanguageTemplates_code : " + dataReq.languageTemplates[i].code + ", LanguageGroup_ID : " + dataReq.languageTemplates[i].languageGroupID + "Dictionary_message :" + dataReq.languageTemplates[i].dictionarys[j].message+ " ,language_ID:" + dataReq.languageTemplates[i].dictionarys[j].languageID;
                        }
                        else
                        {
                            tmp._result._status = "S";
                            tmp._result._message = "SUCCESS";
                        }                        
                    }
                    dataRes.languageTemplates.Add(tmp);
                }                
            }

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "การอัปเดตไม่สำเร็จ");
            }
            else { transac.Commit(); }

            conn.Close();
        }
    }
}
