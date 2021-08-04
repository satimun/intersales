using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanBookingTransportAPI : BaseAPIEngine<ShipmentPlanGetReportRequest, ShipmentPlanBookingTransportRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ShipmentPlanGetReportRequest dataReq, ShipmentPlanBookingTransportRes dataRes)
        {

            var db = ADO.ShipmentPlanADO.GetInstant().BookingTransport(dataReq, this.Logger);

            var payAmounts = ShipmentPlanADO.GetInstant().GetPayAmount(db.GroupBy(x => x.Pi_Code).Select(x => x.Key).ToList());

            var res = db.GroupBy(x => x.PlanHID).ToList();
            res.ForEach(
                m =>  {
                    var x = m.ToList();
                    var customer = new List<INTIdCodeDescriptionModel>();
                    x.GroupBy(y => y.Customer_ID).Select(y => new { id = y.Key }).ToList().ForEach(
                        c => {
                            customer.Add(StaticValueManager.GetInstant().sxsCustomers.Where(f => f.ID == c.id).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.CompanyName }).FirstOrDefault());
                        }
                    );

                    List<CurrencyModel> payAmountTmp = new List<CurrencyModel>();
                    x.GroupBy(p => p.Pi_Code).Select(p => p.Key).ToList().ForEach(p => {

                        payAmountTmp = payAmounts.Where(z => z.PiCode == p).Select(z => new CurrencyModel() { num = z.PayAmount, code = z.CurrencyCode }).ToList();
                    });

                    List<CurrencyModel> payAmountTmp2 = new List<CurrencyModel>();
                    payAmountTmp.ForEach(p => {
                        var chk = true;
                        payAmountTmp2.ForEach(c => {
                            if (c.code == p.code)
                            {
                                c.num += p.num;
                                chk = false;
                                return;
                            }
                        });
                        if (chk) { payAmountTmp2.Add(p); }
                    });

                    dataRes.bookings.Add(new ShipmentPlanBookingTransportRes.BookingTransport()
                    {
                        planHID = x.First().PlanHID
                        , planWeek = x.First().PlanWeek
                        , planDate = DateTimeUtil.GetDateString(x.First().PlanDate)
                        , customers = customer
                        , portLoading = StaticValueManager.GetInstant().sxsPortLoading.Where(z => z.ID == x.First().PortLoading_ID).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.Description }).FirstOrDefault()
                        , portLoadingUpdate = BaseValidate.GetByDateTime(x.First().PortLoadingBy, x.First().PortLoadingDate)
                        , paymentTerm = x.GroupBy(p => p.PaymentTerm).Select(p => p.Key).ToList()
                        , payAmount = payAmountTmp2
                        , ports = x.GroupBy(z => new { code = z.Port_Code, description = z.Port_Description }).Select(z => new INTIdCodeDescriptionModel() { id = null, code = z.Key.code, description = z.Key.description }).ToList()
                        , planAmount = x.Sum(y => y.PlanAmount)
                        , stockAmount = x.Sum(y => y.StockAmount)
                        , containerCode = x.First().Container_Code
                        , packListCode = x.First().PackList_Code
                    });
                    dataRes.bookings.Last().productComplete = dataRes.bookings.Last().stockAmount == 0 ? 0 : (dataRes.bookings.Last().stockAmount / dataRes.bookings.Last().planAmount) * 100;
                }
            );
        }
    }
}
