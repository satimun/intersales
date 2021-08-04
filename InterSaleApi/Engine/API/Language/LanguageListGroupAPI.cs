using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Language
{
    public class LanguageListGroupAPI : BaseAPIEngine<NullRequest, LanguageListGroupResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, LanguageListGroupResponse dataRes)
        {
             
            LanguageGroupADO.GetInstant().ListGroup(new List<string> { "A", "I" }, this.Logger)
               .ForEach(x =>
               {
                   ListGroupRes tmp = new ListGroupRes();
                   tmp.id = x.ID;                   
                   tmp.code = x.Code;
                   tmp.description = x.Description;
                   tmp.status = x.Status;

                   tmp.create.by = BaseValidate.GetEmpName(x.CreateBy);
                   tmp.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                   tmp.modify.by = BaseValidate.GetEmpName(x.ModifyBy);
                   tmp.modify.datetime = BaseValidate.GetDateTimeString(x.ModifyDate);

                   dataRes.languageGroups.Add(tmp);
               });


        }


    }
}
