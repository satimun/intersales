using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanGetCustomerGroupAPI : BaseAPIEngine<IntArrayIDRequest, ShipmentPlanGetCustomerGroupRes>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(IntArrayIDRequest dataReq, ShipmentPlanGetCustomerGroupRes dataRes)
        {

            var res = ADO.ShipmentPlanADO.GetInstant().GetCustomerGroup(dataReq.id, this.Logger);
            res.ForEach(x => {
                dataRes.customerGroups.Add(new ShipmentPlanGetCustomerGroupRes.CustomerGroup()
                {
                    customerGroup = new INTIdCodeDescriptionModel() { id = x.CustomerGroupID, code = x.CustomerGroupCode, description = x.CustomerGroupDes } 
                    , customers = new INTIdCodeDescriptionModel() { id = x.CustomerID, code = x.CustomerCode, description = x.CustomerDes }
                });
            });
        }
    }
}
