using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanDateCircleGetAPI :
        BaseAPIEngine<ShipmentPlanDateCircleGetRequest, ShipmentPlanDateCircleGetResponse>
    {
        protected override string PermissionKey
        {
            get { return "PRIVATE_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanDateCircleGetRequest dataRequest, ShipmentPlanDateCircleGetResponse dataResponse)
        {
            var res = ADO.ShipmentPlanDateCircleADO.GetInstant().GetByCustomerID(dataRequest.customerID).FirstOrDefault();
            if (res != null)
            {
                var customer = StaticValueManager.GetInstant().sxsCustomers.FirstOrDefault(x => x.ID == dataRequest.customerID);
                dataResponse.shipmentPlanDateCircle = new ShipmentPlanDateCircleGetResponse.ShipmentPlanDateCircle()
                {
                    id = res.ID,
                    shippingDay = res.ShippingDay,
                    customer = new InterSaleModel.Model.API.Response.PublicModel.INTIdCodeDescriptionModel()
                    {
                        id = customer.ID,
                        code = customer.Code,
                        description = customer.CompanyName
                    },
                    create = BaseValidate.GetByDateTime(res.CreateBy, res.CreateDate),
                    modify = BaseValidate.GetByDateTime(res.CreateBy, res.CreateDate)
                };
            }
        }
    }
}
