using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CustomerListAPI : BaseAPIEngine<NullRequest, CustomerListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, CustomerListResponse dataRes)
        {
            var db = CustomerADO.GetInstant().List();
            db.ForEach(
                   x =>
                   {
                       INTIdCodeDescriptionModel tmp = new INTIdCodeDescriptionModel();
                       tmp.id = x.ID;
                       tmp.code = x.Code;
                       tmp.description = x.CompanyName;

                       dataRes.customer.Add(tmp);
                   }
               );
        }
    }
}
