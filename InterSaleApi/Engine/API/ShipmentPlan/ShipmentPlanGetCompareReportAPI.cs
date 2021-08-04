using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanGetCompareReportAPI : BaseAPIEngine<ShipmentPlanGetReportRequest, ShipmentPlanGetCompareReportResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ShipmentPlanGetReportRequest dataRequest, ShipmentPlanGetCompareReportResponse dataResponse)
        {
            this.ExecutePlan(dataRequest, dataResponse);
        }

        private void ExecutePlan(ShipmentPlanGetReportRequest dataRequest, ShipmentPlanGetCompareReportResponse dataResponse)
        {
            List<ShipmentPlanGetReportCriteria> report = ADO.ShipmentPlanADO.GetInstant().GetReport(
                dataRequest.planType,
                dataRequest.planMonth,
                dataRequest.planYear,
                dataRequest.saleEmployeeID ?? 0,
                dataRequest.zoneAccountIDs,
                dataRequest.regionalZoneIDs,
                dataRequest.weeks,
                this.Logger);
            List<ShipmentPlanGetReportCriteria> reportComp = null;
            if (!string.IsNullOrWhiteSpace(dataRequest.planTypeCompare) && !"N".Equals(dataRequest.planTypeCompare))
                reportComp = ADO.ShipmentPlanADO.GetInstant().GetReport(
                dataRequest.planTypeCompare,
                dataRequest.planMonth,
                dataRequest.planYear,
                dataRequest.saleEmployeeID ?? 0,
                dataRequest.zoneAccountIDs,
                dataRequest.regionalZoneIDs,
                dataRequest.weeks,
                this.Logger);

            // get container
            var containerList = ShipmentPlanADO.GetInstant().ListContainerSize(null);

            var planHs01 = this.ConvertPlanHs(report, containerList);
            var planHsOrg = JsonConvert.DeserializeObject<List<ShipmentPlanGetCompareReportResponse.PlanH>>(JsonConvert.SerializeObject(planHs01));
            //planHsOrg.ForEach(x => x.status = "");
            dataResponse.shipmentOrg.planHs = planHsOrg.OrderBy(x => KKFCoreEngine.Util.DateTimeUtil.GetDate(x.planDate)).ToList();

            if (reportComp != null)
            {
                var planHs02 = this.ConvertPlanHs(reportComp, containerList);
                var planHsCompare = this.GetReportCompareHeader(planHs01, planHs02, containerList);

                //planHsCompare.Where(x => KKFCoreEngine.Util.DateTimeUtil.GetDate(x.planDate) > DateTime.Now.Date).ToList().ForEach(x => x.status = "P");

                //planHsCompare.Where(x => x.status == null).ToList().ForEach(x => { planHsCompare.Remove(x); });

                if (/*planHsCompare.Where(x => x.status == "R").ToList().Count != 0 &&*/ dataRequest.planTypeCompare == "A")
                {
                    var planHsTmp1 = new List<ShipmentPlanGetCompareReportResponse.PlanH>();
                    planHsCompare.Where(x => x.status == "R" || x.status == null).ToList().ForEach(x =>
                    {
                        planHsTmp1.Add(JsonConvert.DeserializeObject<ShipmentPlanGetCompareReportResponse.PlanH>(JsonConvert.SerializeObject(x)));
                        planHsCompare.Remove(x);
                    });
                    var planP = this.ConvertPlanHs(ADO.ShipmentPlanADO.GetInstant().GetReport("P", dataRequest.planMonth, dataRequest.planYear, dataRequest.saleEmployeeID ?? 0, dataRequest.zoneAccountIDs, dataRequest.regionalZoneIDs, dataRequest.weeks, this.Logger), containerList);
                    var planHsTmp2 = new List<ShipmentPlanGetCompareReportResponse.PlanH>();
                    planP.GroupBy(x => x.CIMAIN).ToList().ForEach(x =>
                    {
                        var tmp = x.Where(z => z.id.Split("-").Length <= 2).FirstOrDefault();
                        if(tmp != null)planHsTmp2.Add(tmp);
                    });

                    this.GetReportCompareHeader(planHsTmp1, planHsTmp2, containerList).ForEach(x =>
                    {
                        /*if (x.status != "N" && DateTimeUtil.GetDate(x.planDate).Ticks <= DateTime.Today.Ticks)*/ planHsCompare.Add(x);
                    });

                    //planHsCompare2.Where(x => KKFCoreEngine.Util.DateTimeUtil.GetDate(x.planDate) > DateTime.Today && x.status == null).ToList().ForEach(x => { planHsCompare2.Remove(x); });
                    //dataResponse.shipmentCompare.planHs = planHsCompare2.OrderBy(x => KKFCoreEngine.Util.DateTimeUtil.GetDate(x.planDate)).ToList();

                }

                planHsCompare.Where(x => DateTimeUtil.GetDate(x.planDate) >= DateTime.Today && x.status == null).ToList().ForEach(x => { planHsCompare.Remove(x); });

                dataResponse.shipmentCompare.planHs = planHsCompare.OrderBy(x => KKFCoreEngine.Util.DateTimeUtil.GetDate(x.planDate)).ToList();
            }

        }

        private List<ShipmentPlanGetCompareReportResponse.PlanH> GetReportCompareHeader(List<ShipmentPlanGetCompareReportResponse.PlanH> planHs01, List<ShipmentPlanGetCompareReportResponse.PlanH> planHs02, List<sxsFreightContainer> containerList)
        {
            

            var planHs = new List<ShipmentPlanGetCompareReportResponse.PlanH>();
            foreach(var h1 in planHs01)
            {
                var h2 = planHs02.FirstOrDefault(x => x.customers.TrueForAll(y => h1.customers.Any(z => z.code == y.code)) &&
                                    h1.customers.TrueForAll(y => x.customers.Any(z => z.code == y.code)) &&
                                    x.planWeek == h1.planWeek && 
                                    x.planMonth == h1.planMonth && 
                                    x.planYear == h1.planYear );
                if (h2 != null)
                {
                    h2.status = "S";
                    h2.remark = (h1.remark.code == null ? h2.remark : h2.remark.code == null ? h1.remark : h1.remark.code != h2.remark.code ? h2.remark : h1.remark);
                    h2.refID = h1.refID != "" ? h1.refID : h2.refID;

                    /*SoMRuk*/
                    if (!String.IsNullOrWhiteSpace(h1.containerCode) && !String.IsNullOrWhiteSpace(h2.containerCode))
                    {
                        if (containerList.Where(x => x.Code.Equals(h1.containerCode)).Select(x => x.GroupType).FirstOrDefault() 
                            != containerList.Where(x => x.Code.Equals(h2.containerCode)).Select(x => x.GroupType).FirstOrDefault()) { h2.status = "C"; }
                    }                    
                    /*SoMRuk*/
                    planHs.Add(h2);
                    planHs02.Remove(h2);
                }
                else
                {
                    h1.status = "RR";
                    planHs.Add(h1);
                }
            }

            foreach(var h2 in planHs02)
            {
                var h1 = planHs01.FirstOrDefault(x => x.status == "RR" &&
                                    x.customers.TrueForAll(y => h2.customers.Any(z => z.code == y.code)) &&
                                    h2.customers.TrueForAll(y => x.customers.Any(z => z.code == y.code)) &&
                                    x.planMonth == h2.planMonth &&
                                    x.planYear == h2.planYear);
                if(h1 != null)
                {
                    h1.status = "P";
                    h2.status = "M";
                    /*SoMRuk*/
                    if (!String.IsNullOrWhiteSpace(h1.containerCode) && !String.IsNullOrWhiteSpace(h2.containerCode))
                    {
                        if (containerList.Where(x => x.Code.Equals(h1.containerCode)).Select(x => x.GroupType).FirstOrDefault()
                            != containerList.Where(x => x.Code.Equals(h2.containerCode)).Select(x => x.GroupType).FirstOrDefault()) {  h2.status = "C"; }
                    }
                    /*SoMRuk*/
                    //h2.refID = h1.refID != "" ? h1.refID : h2.refID;
                    h2.remark = (h1.remark.code == null ? h2.remark : h2.remark.code == null ? h1.remark : h1.remark.code != h2.remark.code ? h2.remark : h1.remark);
                    planHs.Add(h2);
                }
                else
                {
                    h2.status = "N";
                    planHs.Add(h2);
                }
            }

            planHs.Where(x => x.status == "RR").ToList().ForEach(x => x.status = (DateTime.Today <= BaseValidate.GetDate(x.planDate)) ? null : "R");

            return planHs;
        }

        private List<ShipmentPlanGetCompareReportResponse.PlanH> ConvertPlanHs(List<ShipmentPlanGetReportCriteria> reports, List<sxsFreightContainer> containerList)
        {
            var planHs = new List<ShipmentPlanGetCompareReportResponse.PlanH>();
            string[] HIDs = reports.GroupBy(x => x.HID).Select(x => x.Key).ToArray();
            foreach (var hid in HIDs)
            {
                var reportH = reports.Where(x => x.HID == hid);
                ShipmentPlanGetCompareReportResponse.PlanH h = new ShipmentPlanGetCompareReportResponse.PlanH()
                {
                    id = hid,
                    containerCode = reportH.First().Container_Code,
                    planDate = BaseValidate.GetDateString(reportH.First().PlanDate),
                    planWeek = reportH.First().PlanWeek,
                    refID = reportH.First().HRefID,
                    PlanType = reportH.First().PlanType,
                    planMonth = reportH.First().PlanDate.Month,
                    planYear = reportH.First().PlanDate.Year,
                    countrys = reportH
                                    .GroupBy(x => new { code = x.Country_Code.Trim(), description = x.Country_Description.Trim() })
                                    .Select(x => new CodeDescModel { code = x.Key.code.Trim(), description = x.Key.description.Trim() })
                                    .ToList(),
                    ciCodes = GetCiCode(reportH.ToList()),
                    piCodes = reportH
                                    .GroupBy(x => x.PI_Code)
                                    .Select(x => x.Key)
                                    .ToList(),
                    customers = reportH
                                    .GroupBy(x => new { code = x.Customer_Code.Trim(), description = x.Customer_Description.Trim() })
                                    .Select(x => new CodeDescModel { code = x.Key.code.Trim(), description = x.Key.description.Trim() })
                                    .ToList(),
                    planBalance = new ShipmentPlanGetCompareReportResponse.PlanBalance()
                    {
                        bale = reportH.Sum(x => x.PlanBale),
                        quantity = reportH.Sum(x => x.PlanQuatity),
                        weight = reportH.Sum(x => x.PlanWeightKG),
                        valueTHB = reportH.Sum(x => x.PlanValueTHB),
                        values = reportH.GroupBy(x => x.Currency_Code)
                                    .Select(x => new ShipmentPlanGetCompareReportResponse.Values() { num = x.Sum(y => y.PlanValue), code = x.Key.Trim() }) /*trim by SoMRuk*/
                                    .ToList()
                    },
                    ports = reportH.GroupBy(x=> new { code = x.Port_Code, description = x.Port_Description })
                                    .Select(x=> new CodeDescModel() { code = x.Key.code, description = x.Key.description })
                                    .ToList(),
                    lastAdmitDate = BaseValidate.GetDateString(reportH.Max(x => x.AdmitDate)),
                    status = null,
                    remark = new INTIdCodeDescriptionModel() { id = reportH.First().Remark_ID, code = reportH.First().Remark_Code, description = reportH.First().Remark_Description }
                    , CIMAIN = reportH.First().CIMAIN
                    , paymentTerm = reportH.First().PaymentTerm
                    , paymentTerms = reportH.GroupBy(z => z.PaymentTerm).Select(z => z.Key).ToList()
                    , payAmount = reportH.First().PayAmount
                    , portLoading = StaticValueManager.GetInstant().sxsPortLoading.Where(z => z.ID == reportH.First().PortLoading_ID).Select(z => new INTIdCodeDescriptionModel() { id = z.ID, code = z.Code, description = z.Description }).FirstOrDefault()
                };

                if (string.IsNullOrWhiteSpace(h.containerCode))
                {
                    var ContainerTmp = new List<sxsFreightContainer>();
                    var wn = h.planBalance.weight == 0 ? 1 : h.planBalance.weight;
                    containerList.ForEach(y =>
                    {
                        ContainerTmp.Add(new sxsFreightContainer() { ID = y.ID, Code = y.Code, WeightKg = (Math.Abs(y.MaxWeightKg - wn) / wn) * 100 });
                    });
                    h.containerCode = ContainerTmp.OrderBy(y => y.WeightKg).ToList().First().Code;
                }

                planHs.Add(h);
            }

            return planHs;
        }

        private List<string> GetCiCode(List<ShipmentPlanGetReportCriteria> reportH)
        {
            var tmp = reportH.GroupBy(x => x.CI_Code).Select(x => x.Key).ToList();
            if(tmp.Count == 0 || tmp[tmp.Count-1] == "")
            {
                tmp.Remove("");
                var pi = reportH.GroupBy(x => x.PI_Code).Select(x => x.Key).ToList();
                if(pi.Count == 1) { tmp.Add(pi[0]); }
                else if(pi.Count > 1) { tmp.Add("Collected"); }
            }
            return tmp;
        }
    }
}
