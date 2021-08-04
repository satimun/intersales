using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class ZoneAccountSearchAPI : BaseAPIEngine<ZoneAccountSearchRequest, ZoneAccountSearchResponse>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(ZoneAccountSearchRequest dataRequest, ZoneAccountSearchResponse dataResponse)
        {
            var res = ADO.ZoneAccountADO.GetInstant().Search(dataRequest.search, dataRequest.status, this.Logger);
            dataResponse.zoneAccounts = new List<ZoneAccountSearchResponse.ZoneAccount>();
            res.ForEach(x => dataResponse.zoneAccounts.Add(new ZoneAccountSearchResponse.ZoneAccount()
            {
                id = x.ID,
                code = x.Code,
                description = x.Description,
                create = null,
                modify = null
            }));
        }
    }
}
