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
    public class RemarkSearchAPI: BaseAPIEngine<RemarkSearchReq, RemarkRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(RemarkSearchReq dataReq, RemarkRes dataRes)
        {
            RemarkADO.GetInstant().Search(dataReq, this.Logger).ForEach(x => {
                dataRes.remarks.Add(new RemarkGetDataRes.RemarkGroup.Remark {
                    id = x.Remark_ID
                    , code = x.Remark_Code
                    , description = x.Remark_Description
                    , remarkGroupID = x.RemarkGroup_ID
                    , lastUpdate = BaseValidate.GetByDateTime(x.Remark_LastUpdateBy, x.Remark_LastUpdateDate)
                    , status = x.Remark_Status
                });
            });
        }
    }
}
