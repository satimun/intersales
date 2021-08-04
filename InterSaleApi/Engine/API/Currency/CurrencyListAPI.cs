using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleApi.ADO;

namespace InterSaleApi.Engine.API
{
    public class CurrencyListAPI : BaseAPIEngine<NullRequest, CurrencyListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, CurrencyListResponse dataRes)
        {
            var db = CurrencyADO.GetInstant().List();
            db.ForEach(
                    x =>
                    {
                        INTIdCodeDescriptionModel tmp = new INTIdCodeDescriptionModel();
                        tmp.id = x.ID;
                        tmp.code = x.Code;
                        tmp.description = x.Description;
                        dataRes.currencys.Add(tmp);
                    }
                );
        }
    }
}
