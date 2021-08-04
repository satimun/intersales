using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class PortLoadingSearchAPI : BaseAPIEngine<SearchRequest, PortLoadingRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, PortLoadingRes dataRes)
        {

           // var tmp = StaticValueManager.GetInstant().sxsPortLoading.Where(x => x.Status == ENDefualtStatus.ACTIVE.GetValueString()).ToList();
            var tmp  = ADO.PortLoadingADO.GetInstant().Search(dataReq, this.Logger);
            tmp.ForEach( 
                x =>  {
                    dataRes.portLoadings.Add(new PortLoadingRes.PortLoading()
                    {
                        id = x.ID
                        , code = x.Code
                        , description = x.Description
                        , status = x.Status
                        , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy) , (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                    });
            });
        }
    }
}
