using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Currency
{
    public class CurrencySearchAPI : BaseAPIEngine<SearchRequest, CurrencyListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, CurrencyListResponse dataRes)
        {
            CurrencyADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.currencys.Add(new INTIdCodeDescriptionModel()
                {
                    id = x.ID
                    , code = x.Code
                    , description = x.Description
                });
            });
        }
    }
}
