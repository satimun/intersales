using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class RemarkGetDataAPI : BaseAPIEngine<GetDataReq, RemarkGetDataRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(GetDataReq dataReq, RemarkGetDataRes dataRes)
        {
            var data = RemarkADO.GetInstant().GetData(dataReq, this.Logger);//.GroupBy(x => x.RemarkGroup_ID).ToList();
            data.ForEach( 
                x => {
                    bool chk = true;
                    int ptr = 0;
                    for (var i = 0; i < dataRes.remarkGroups.Count; i++)
                    {
                        if(dataRes.remarkGroups[i].id == x.RemarkGroup_ID)
                        {
                            ptr = i; chk = false;
                            break;
                        }
                    }
                    if(chk)
                    {
                        dataRes.remarkGroups.Add(new RemarkGetDataRes.RemarkGroup {
                            id = x.RemarkGroup_ID
                            , code = x.RemarkGroup_Code
                            , description = x.RemarkGroup_Description
                            , groupType = x.RemarkGroup_GroupType
                            , lastUpdate = BaseValidate.GetByDateTime(x.RemarkGroup_LastUpdateBy, x.RemarkGroup_LastUpdateDate)
                            , status = x.RemarkGroup_Status
                        });
                        ptr = dataRes.remarkGroups.Count - 1;
                    }

                    if (x.Remark_ID.HasValue)
                    {
                        dataRes.remarkGroups[ptr].remarks.Add( new RemarkGetDataRes.RemarkGroup.Remark {
                            id = x.Remark_ID
                            , code = x.Remark_Code
                            , description = x.Remark_Description
                            , remarkGroupID = x.RemarkGroup_ID
                            , lastUpdate = BaseValidate.GetByDateTime(x.Remark_LastUpdateBy, x.Remark_LastUpdateDate)
                            , status = x.Remark_Status
                        });
                    }
                }
            );
        }
    }
}
