using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class RemarkSearchGroupAPI : BaseAPIEngine<RemarkSearchReq, RemarkGroupRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(RemarkSearchReq dataReq, RemarkGroupRes dataRes)
        {
            RemarkADO.GetInstant().SearchGroup(dataReq, this.Logger).ForEach(x => {
                dataRes.remarkGroups.Add(new RemarkGetDataRes.RemarkGroup {
                    id = x.RemarkGroup_ID
                    , code = x.RemarkGroup_Code
                    , description = x.RemarkGroup_Description
                    , groupType = x.RemarkGroup_GroupType
                    , status = x.RemarkGroup_Status
                    , lastUpdate = BaseValidate.GetByDateTime(x.RemarkGroup_LastUpdateBy, x.RemarkGroup_LastUpdateDate)
                });
            });
        }
    }
}
