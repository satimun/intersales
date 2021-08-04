using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Country
{
    public class CountrySearchCountryGroupAPI : BaseAPIEngine<SearchRequest, CountrySearchCountryGroupRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, CountrySearchCountryGroupRes dataRes)
        {
            ADO.CountryADO.GetInstant().SearchCountryGroup(dataReq,this.Logger).ForEach(x =>
            {
                dataRes.countrys.Add(new CountrySearchCountryGroupRes.Country()
                {
                    id = x.ID
                    , code = x.Code
                    , description = x.Description
                    , status = x.Status
                    , groupType = x.GroupType
                    , countryGroup = new INTIdCodeDescriptionModel() { id = x.CountryGroup_ID, code = x.CountryGroup_Code, description = x.CountryGroup_Des }
                    , regionalZone = new INTIdCodeDescriptionModel() { id = x.RegionalZone_ID, code = x.RegionalZone_Code, description = x.RegionalZone_Des }
                    , zone = new INTIdCodeDescriptionModel() { id = x.Zone_ID, code = x.Zone_Code, description = x.Zone_Des }
                    , lastUpdate = BaseValidate.GetByDateTime(x.UpdateBy, x.UpdateDate)
                });
            });
        }
    }
}
