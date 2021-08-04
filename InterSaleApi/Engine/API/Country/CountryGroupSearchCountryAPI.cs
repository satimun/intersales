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
    public class CountryGroupSearchCountryAPI : BaseAPIEngine<SearchRequest, CountryGroupSearchCountryRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, CountryGroupSearchCountryRes dataRes)
        {
            ADO.CountryGroupADO.GetInstant().SearchCountry(dataReq,this.Logger).GroupBy(x => x.ID).ToList().ForEach(x =>
            {
                dataRes.countryGroups.Add(new CountryGroupSearchCountryRes.CountryGroups()
                {
                    id = x.First().ID
                    , code = x.First().Code
                    , description = x.First().Description
                    , groupType = x.First().GroupType
                    , status = x.First().Status
                    , countrys = ConvertCountry(x.ToList())
                    , lastUpdate = BaseValidate.GetByDateTime((x.First().ModifyBy.HasValue ? x.First().ModifyBy : x.First().CreateBy), (x.First().ModifyDate.HasValue ? x.First().ModifyDate : x.First().CreateDate))
                });
            });
        }

        private List<CountryGroupSearchCountryRes.CountryGroups.Countrys> ConvertCountry(List<CountryGroupSearchCountry> data)
        {
            var res = new  List<CountryGroupSearchCountryRes.CountryGroups.Countrys>();
            data.ForEach(x =>
            {
                if(x.Country_ID.HasValue)
                {
                    res.Add(new CountryGroupSearchCountryRes.CountryGroups.Countrys()
                    {
                        id = x.Country_ID
                        , code = x.Country_Code
                        , description = x.Country_Des
                        , lastUpdate = BaseValidate.GetByDateTime(x.UpdateBy, x.UpdateDate)
                        , regionalZone = new INTIdCodeDescriptionModel() { id = x.RegionalZone_ID, code = x.RegionalZone_Code, description = x.RegionalZone_Des }
                        , zone = new INTIdCodeDescriptionModel() { id = x.Zone_ID, code = x.Zone_Code, description = x.Zone_Des }
                    });
                }
            });

            return res;
        }
    }
}
