using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanListContainerSizeAPI : BaseAPIEngine<NullRequest, ShipmentPlanListContainerSizeResponse>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(NullRequest dataRequest, ShipmentPlanListContainerSizeResponse dataResponse)
        {
            dataResponse.containers = new List<InterSaleModel.Model.Entity.Response.ShipmentPlanContainerSizeCriteria>();
            ADO.ShipmentPlanADO.GetInstant().ListContainerSize(this.Logger).ForEach(
                x => dataResponse.containers.Add(new InterSaleModel.Model.Entity.Response.ShipmentPlanContainerSizeCriteria()
                {
                    code = x.Code,
                    maxSizeKg = x.MaxWeightKg,
                    maxSizeVolume = x.Volume
                    , minSizeKg = x.MinWeightKg
                    , sizeKg = x.WeightKg
                }));
        }
    }
}
