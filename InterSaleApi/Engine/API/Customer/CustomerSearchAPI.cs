using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CustomerSearchAPI : BaseAPIEngine<SearchRequest, CustomerSearchResponse>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(SearchRequest dataReq, CustomerSearchResponse dataRes)
        {
            var res = ADO.CustomerADO.GetInstant().Search(dataReq, this.Logger);
            dataRes.customers = new List<CustomerSearchResponse.Customer>();
            res.ForEach(x => dataRes.customers.Add(new CustomerSearchResponse.Customer()
            {
                id = x.ID
                , code = x.Code
                , description = x.CompanyName
                , country = new INTIdCodeDescriptionModel() { id = x.Country_ID, code = x.Country_Code, description = x.Country_Des }
                , countryGroup = new INTIdCodeDescriptionModel() { id = x.CountryGroup_ID, code = x.CountryGroup_Code, description = x.CountryGroup_Des }
                , status = x.Status
            }));
        }
    }
}
