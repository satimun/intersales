using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanListRegionalZoneAPI : BaseAPIEngine<InterSaleModel.Model.API.Request.NullRequest, InterSaleModel.Model.API.Response.ShipmentPlanListRegionalZoneResponse>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(NullRequest dataRequest, ShipmentPlanListRegionalZoneResponse dataResponse)
        {
            dataResponse.regionalZones = ADO.ShipmentPlanADO.GetInstant().ListRegionalZone(this.Logger);
        }
    }
}
