using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.API.Response.StatusFlag;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.StatusFlag
{
    public class GetForApprovalAPI  : BaseAPIEngine<SearchRequest, GetForApprovalRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, GetForApprovalRes dataRes)
        {

            StatusFlagADO.GetInstant().GetForApproval(dataReq.id, employeeID, this.Logger).ForEach(x =>
            {
                dataRes.statusFlags.Add(new GetForApprovalRes.StatusFlag()
                {
                    id = x.ID
                    , code = x.Code
                    , description = x.Description
                    , groupFlag = x.GroupFlag
                    , updateFlag = new INTIdCodeDescriptionModel() { id = x.UpdateFlag_ID, code = x.UpdateFlag_Code, description = x.UpdateFlag_Des }
                });
            });
        }
    }
}
