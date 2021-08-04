using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Util;
using System.Linq;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanGetActualAPI : BaseAPIEngine<ShipmentPlanGetActualReq, ShipmentPlanGetActualRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ShipmentPlanGetActualReq dataReq, ShipmentPlanGetActualRes dataRes)
        {
            //var df = new DateTime(dataReq.year, dataReq.monthFrom, 1);
            //var dt = (new DateTime(dataReq.year, dataReq.monthTo, 1)).AddMonths(1).AddDays(-1);

            ADO.ShipmentPlanADO.GetInstant().GetActual(DateTimeUtil.GetDate(dataReq.dateFrom).Value, DateTimeUtil.GetDate(dataReq.dateTo).Value, dataReq.zoneID, dataReq.countryID, dataReq.customerID, dataReq.productType, dataReq.diamerter, dataReq.color, dataReq.otherProduct, this.Logger).ForEach(
                x => {
                    dataRes.actuals.Add(new ShipmentPlanGetActualRes.Actual() {
                        ciCode = x.ciCode
                        , ciDate = DateTimeUtil.GetDateString(x.ciDate)
                        , customer = StaticValueManager.GetInstant().sxsCustomers.Where(z => z.Code == x.customerCode).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.CompanyName }).FirstOrDefault()
                        , actual = new ShipmentPlanGetActualRes.Actual.WeightValue() { weightKg = x.weightkg, amountpc = x.amountpc, value = x.value },
                        other = new ShipmentPlanGetActualRes.Actual.WeightValue() { weightKg = x.otherweightkg, amountpc = x.otheramountpc, value = x.othervalue }
                    });
                }
            );
        }
    }
}
