using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanSearchCostAPI : BaseAPIEngine<ShipmentPlanSearchCostRequest, ShipmentPlanSearchCostResponse>
    {
        protected override string PermissionKey
        {
            get { return "PRIVATE_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanSearchCostRequest dataRequest, ShipmentPlanSearchCostResponse dataResponse)
        {
            var res = ADO.ShipmentPlanADO.GetInstant().PlanCostID_ListByYear(dataRequest.year, this.Logger);
            dataResponse.costs = res.Select(x => new ShipmentPlanSearchCostResponse.Cost()
            {
                code = x.Code,
                id = x.ID,
                description = x.Description,
                defaultFlag = x.DefaultFlag
            }).ToList();
        }
    }
}
