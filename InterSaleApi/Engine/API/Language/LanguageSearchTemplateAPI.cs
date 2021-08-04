using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Language
{
    public class LanguageSearchTemplateAPI : BaseAPIEngine<LanguageSearchTemplateRequest, LanguageSearchTemplateResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(LanguageSearchTemplateRequest dataReq, LanguageSearchTemplateResponse dataRes)
        {
            int ct = 0;
            for (int i = 0; i < dataReq.languageGroupIDs.Count; i++)
            {
                LanguageSearchTemplateRes tmp = new LanguageSearchTemplateRes();  
                
                    LanguageADO.GetInstant().SearchTemplate(  dataReq.languageGroupIDs[i], dataReq.languageIDs, dataReq.status, this.Logger)
                    .ForEach(x =>
                    {
                        ct++;
                        LanguageDictionaryRes obj = new LanguageDictionaryRes();

                        if ( (tmp.id != x.LanguageTemplate_ID) && (ct > 1) )
                        {
                            dataRes.languageTemplates.Add(tmp);
                            tmp = new LanguageSearchTemplateRes();
                        }

                        tmp.id = x.LanguageTemplate_ID;
                        tmp.code = x.LanguageTemplate_Code; 
                        tmp.status = x.LanguageTemplate_Status;

                        tmp.create.by = BaseValidate.GetEmpName(x.LanguageTemplate_CreateBy );
                        tmp.create.datetime = BaseValidate.GetDateTimeString(x.LanguageTemplate_CreateDate );

                        tmp.modify.by = BaseValidate.GetEmpName(x.LanguageTemplate_ModifyBy);
                        tmp.modify.datetime = BaseValidate.GetDateTimeString(x.LanguageTemplate_ModifyDate);
                        
                        obj.id = x.LanguageDictionary_ID  ;
                        obj.message  = x.LanguageDictionary_Message ;

                        obj.Language.id  = x.Language_ID ;
                        obj.Language.code = x.Language_Code;
                        obj.Language.description = x.Language_Description;

                        tmp.LanguageDictionarys.Add(obj);
                    }
                    ); 

                dataRes.languageTemplates.Add(tmp);
            }             

        }
    }
}
