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
    public class CountryGroupPriceListAPI : BaseAPIEngine<NullRequest, CountryGroupListResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(NullRequest dataReq, CountryGroupListResponse dataRes)
        {

            StaticValueManager.GetInstant().sxsCountryGroups.Where(y => y.GroupType == "P").ToList().ForEach(
                    x =>
                    {
                        CountryGroupList tmp = new CountryGroupList();
                        tmp.id = x.ID;
                        tmp.code = x.Code;
                        tmp.description = x.Description;
                        
                        CountryADO.GetInstant().Search(x.ID, this.Logger).ForEach(
                            y =>
                            {
                                INTIdCodeDescriptionModel tmp2 = new INTIdCodeDescriptionModel();
                                tmp2.id = y.ID;
                                tmp2.code = y.Code;
                                tmp2.description = y.Description;
                                tmp.countrys.Add(tmp2);
                            }
                        );
                        
                        dataRes.countryGroups.Add(tmp);
                    }
                );

        }

    }
}
