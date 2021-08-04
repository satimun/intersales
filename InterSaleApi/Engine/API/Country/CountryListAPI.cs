using InterSaleApi.ADO;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CountryListAPI : BaseAPIEngine<NullRequest, CountrySearchResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, CountrySearchResponse dataRes)
        {
            var countrys = StaticValueManager.GetInstant().sxsCountrys
                    .Where(x => x.Status != "C")
                    .Select(x => new INTIdCodeDescriptionModel() { id = x.ID, code = x.Code, description = x.Description }).ToList();
            dataRes.countrys = countrys;
        }
    }
}
