using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleApi.Engine.Validate;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanMainInsertMonthlyInitAPI :
        BaseAPIEngine<
            InterSaleModel.Model.API.Request.ShipmentPlanMainInsertMonthlyInitRequest,
            InterSaleModel.Model.API.Response.ShipmentPlanMainInsertMonthlyInitResponse>
    {
        protected override string PermissionKey {
            get { return "PRIVATE_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanMainInsertMonthlyInitRequest dataRequest, ShipmentPlanMainInsertMonthlyInitResponse dataResponse)
        {
            var res = ADO.ShipmentPlanMainADO.GetInstant().InsertMonthlyInit(
                dataRequest.customerID,
                dataRequest.planMonth,
                dataRequest.planYear,
                employeeID);
            dataResponse.shipmentPlanMain = new ShipmentPlanMainInsertMonthlyInitResponse.ShipmentPlanMain()
            {
                id = res.ID,
                code = res.Code,
                customerID = res.Customer_ID,
                planMonth = res.PlanMonth,
                planType = res.PlanType,
                //revision = res.Revision,
                status = res.Status,
                planYear = res.PlanYear,
                //approve = BaseValidate.GetByDateTime(res.ApproveBy, res.ApproveDate),
                create = BaseValidate.GetByDateTime(res.CreateBy, res.CreateDate),
                modify = BaseValidate.GetByDateTime(res.ModifyBy, res.ModifyDate),
            };
        }
    }
}
