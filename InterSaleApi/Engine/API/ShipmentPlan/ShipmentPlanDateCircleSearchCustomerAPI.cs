using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanDateCircleSearchCustomerAPI : BaseAPIEngine<ShipmentPlanDateCircleSearchCustomerRequest, ShipmentPlanDateCircleSearchCustomerResponse>
    {
        protected override string PermissionKey
        {
            get { return "PRIVATE_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanDateCircleSearchCustomerRequest dataReq, ShipmentPlanDateCircleSearchCustomerResponse dataRes)
        {
            
            ShipmentPlanDateCircleADO.GetInstant().SearchCustomer(dataReq.search, dataReq.status, this.Logger).OrderByDescending(x => x.Favorite_Flag).ThenBy(x => x.CustomerCode).ToList().ForEach(
                x => {
                    var tmp = new ShipmentPlanDateCircleSearchCustomerResponse.ShipmentPlanDateCircles();
                    tmp.id = x.DateCircleID;
                    tmp.shippingDay = x.DateCircleShippingDay;
                    tmp.customer.id = x.CustomerID;
                    tmp.customer.code = x.CustomerCode;
                    tmp.customer.description = x.CustomerDescription;
                    tmp.saleEmployee.id = x.SaleID;
                    tmp.saleEmployee.code = x.SaleCode;
                    tmp.saleEmployee.description = x.SaleDescription;
                    tmp.create.by = BaseValidate.GetEmpName(x.DateCircleCreateBy);
                    tmp.create.datetime = BaseValidate.GetDateTimeString(x.DateCircleCreateDate);
                    tmp.modify.by = BaseValidate.GetEmpName(x.DateCircleModifyBy);
                    tmp.modify.datetime = BaseValidate.GetDateTimeString(x.DateCircleModifyDate);
                    dataRes.shipmentPlanDateCircles.Add(tmp);
                }
            );
        }
    }
}
