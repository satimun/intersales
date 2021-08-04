using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CountrySearchAPI : BaseAPIEngine<CountrySearchRequest, CountrySearchResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(CountrySearchRequest dataReq, CountrySearchResponse dataRes)
        {
            CountryADO.GetInstant().Search(dataReq.countryGroupID, this.Logger).ForEach(
                    x =>
                    {
                        INTIdCodeDescriptionModel tmp = new INTIdCodeDescriptionModel();
                        tmp.id = x.ID;
                        tmp.code = x.Code;
                        tmp.description = x.Description;
                        dataRes.countrys.Add(tmp);
                    }
                );
        }
    }
}
