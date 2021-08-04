using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanGetReport2API : BaseAPIEngine<ShipmentPlanGetReport2Req, ShipmentPlanGetReport2Res>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        private List<sxsFreightContainer> containerList;

        protected override void ExecuteChild(ShipmentPlanGetReport2Req dataReq, ShipmentPlanGetReport2Res dataRes)
        {

            var db = ShipmentPlanADO.GetInstant().GetReport2(dataReq, this.Logger);

            // get container
            containerList = ShipmentPlanADO.GetInstant().ListContainerSize(null);

            var plan = ConvertData(db);

            if (!string.IsNullOrWhiteSpace(dataReq.compare) && dataReq.compare != "N")
            {
                dataReq.type = dataReq.compare;
                List<ShipmentPlanGetReport2> db2 = ShipmentPlanADO.GetInstant().GetReport2(dataReq, this.Logger);
                if (dataReq.option == 1)
                {
                    dataReq.type = "D";
                    db2.AddRange(ShipmentPlanADO.GetInstant().GetReport2(dataReq, this.Logger));
                }

                var compare = ConvertData(db2);
                dataRes.reports = GetReportCompareHeader(plan, compare);
            }
            else
            {
                dataRes.reports = GetReportCompareHeader(plan, new List<ShipmentPlanGetReport2Res.Shipment>());
            } 

            if(dataReq.weeks.Count != 0 && dataReq.weeks.First() != 0)
            {
                dataRes.reports.Where(x => !dataReq.weeks.Any(z => z == x.week)).ToList().ForEach(x => dataRes.reports.Remove(x));
            }
        }

        private List<ShipmentPlanGetReport2Res.Shipment> ConvertData(List<ShipmentPlanGetReport2> data)
        {
            var planHs = new List<ShipmentPlanGetReport2Res.Shipment>();

            data.GroupBy(x => x.HID).ToList().ForEach( m =>
            {
                var x = m.ToList();
                var customers = new List<INTIdCodeDescriptionModel>();
                x.GroupBy(y => y.Customer_ID).ToList().ForEach(y =>
                {
                    customers.Add(new INTIdCodeDescriptionModel()
                    {
                        id = y.First().Customer_ID
                        , code = y.First().Customer_Code
                        , description = y.First().Customer_Des
                    });
                });
                
                planHs.Add(new ShipmentPlanGetReport2Res.Shipment()
                {
                    id = x.First().HID
                    , week = x.First().Week
                    , date = BaseValidate.GetDateString(x.First().Date)
                    , customers = customers
                    , country = new INTIdCodeDescriptionModel() { id = x.First().Country_ID, code = x.First().Country_Code, description = x.First().Country_Des }
                    , zoneAccount = new INTIdCodeDescriptionModel() { id = x.First().ZoneAccount_ID, code = x.First().ZoneAccount_Code, description = x.First().ZoneAccount_Des }
                    , regionalZone = new INTIdCodeDescriptionModel() { id = x.First().RegionalZone_ID, code = x.First().RegionalZone_Code, description = x.First().RegionalZone_Des }
                    , ciCodes = GetCiCode(x)
                    , piCodes = x.Select(z => z.PI_Code).Distinct().ToList()
                    , ports = x.GroupBy(y => new { code = y.Port_Code, description = y.Port_Des }).Select(y => new CodeDescModel() { code = y.Key.code, description = y.Key.description }).ToList()
                    , stockDate = BaseValidate.GetDateString(x.Max(z => z.AdmitDate))
                    , paymentTerms = x.GroupBy(p => p.PaymentTerm).Select(p => p.Key).ToList()
                    , containerCode = x.First().Container_Code
                    , balance = new ShipmentPlanGetReport2Res.PlanBalance()
                    {
                        bale = x.Sum(y => y.Bale)
                        , quantity = x.Sum(y => y.Quatity)
                        , weight = x.Sum(y => y.Weight)
                        , valueTHB = x.Sum(y => y.ValueTHB)
                        , values = x.GroupBy(y => y.Currency_Code).Select(y => new ShipmentPlanGetReport2Res.Values() { num = y.Sum(z => z.Value), code = y.Key.Trim() }).ToList()
                    }
                    , remark = new INTIdCodeDescriptionModel() { id = x.First().Remark_ID, code = x.First().Remark_Code, description = x.First().Remark_Des }
                    , remarkGroup = new INTIdCodeDescriptionModel() { id = x.First().RemarkGroup_ID, code = x.First().RemarkGroup_Code, description = x.First().RemarkGroup_Des }
                });

                if (string.IsNullOrWhiteSpace(planHs.Last().containerCode))
                {
                    var ContainerTmp = new List<sxsFreightContainer>();
                    var wn = x.Sum(y => y.Weight) == 0 ? 1 : x.Sum(y => y.Weight);
                    containerList.ForEach(y =>
                    {
                        ContainerTmp.Add(new sxsFreightContainer() { ID = y.ID, Code = y.Code, WeightKg = (Math.Abs(y.MaxWeightKg - wn) / wn) * 100 });
                    });
                    planHs.Last().containerCode = ContainerTmp.OrderBy(y => y.WeightKg).ToList().First().Code;
                }
            });

            return planHs;
        }

        private List<string> GetCiCode(List<ShipmentPlanGetReport2> data)
        {
            var tmp = data.GroupBy(x => x.CI_Code).Select(x => x.Key).ToList();
            if (tmp.Count == 0 || tmp[tmp.Count - 1] == "")
            {
                tmp.Remove("");
                var pi = data.GroupBy(x => x.PI_Code).Select(x => x.Key).ToList();
                if (pi.Count == 1) { tmp.Add(pi[0]); }
                else if (pi.Count > 1) { tmp.Add("Collected"); }
            }
            return tmp;
        }

        private List<ShipmentPlanGetReport2Res.Report> GetReportCompareHeader(List<ShipmentPlanGetReport2Res.Shipment> plan, List<ShipmentPlanGetReport2Res.Shipment> actual)
        {
            var planHs = new List<ShipmentPlanGetReport2Res.Report>();
            foreach (var h1 in plan)
            {
                var h2 = actual.FirstOrDefault(x => x.customers.TrueForAll(y => h1.customers.Any(z => z.code == y.code)) &&
                                    h1.customers.TrueForAll(y => x.customers.Any(z => z.code == y.code)) &&
                                    x.week == h1.week &&
                                    BaseValidate.GetDate(x.date).Month == BaseValidate.GetDate(h1.date).Month &&
                                    BaseValidate.GetDate(x.date).Year == BaseValidate.GetDate(h1.date).Year);
                if (h2 != null)
                {
                    h2.status = "S";
                    if (!String.IsNullOrWhiteSpace(h1.containerCode) && !String.IsNullOrWhiteSpace(h2.containerCode))
                    {
                        if (containerList.Where(x => x.Code.Equals(h1.containerCode)).Select(x => x.GroupType).FirstOrDefault()
                            != containerList.Where(x => x.Code.Equals(h2.containerCode)).Select(x => x.GroupType).FirstOrDefault()) { h2.status = "C"; }
                    }
                    h2.remark = (h1.remark.code == null ? h2.remark : h2.remark.code == null ? h1.remark : h1.remark.code != h2.remark.code ? h2.remark : h1.remark);
                    planHs.Add(new ShipmentPlanGetReport2Res.Report()
                    {
                        week = h2.week
                        , date = h2.date
                        , plan = h1
                        , actual = h2
                        , status = h2.status
                    });
                    actual.Remove(h2);
                }
                else
                {
                    h1.status = "RR";
                    planHs.Add(new ShipmentPlanGetReport2Res.Report()
                    {
                        week = h1.week
                        , date = h1.date
                        , plan = h1
                        , actual = h1
                    });
                }
            }

            foreach (var h2 in actual)
            {
                var h1 = plan.FirstOrDefault(x => x.status == "RR" &&
                                    x.customers.TrueForAll(y => h2.customers.Any(z => z.code == y.code)) &&
                                    h2.customers.TrueForAll(y => x.customers.Any(z => z.code == y.code)) &&
                                    BaseValidate.GetDate(x.date).Month == BaseValidate.GetDate(h2.date).Month &&
                                    BaseValidate.GetDate(x.date).Year == BaseValidate.GetDate(h2.date).Year);
                if (h1 != null)
                {
                    h1.status = "P";
                    h2.status = "M";
                    if (!String.IsNullOrWhiteSpace(h1.containerCode) && !String.IsNullOrWhiteSpace(h2.containerCode))
                    {
                        if (containerList.Where(x => x.Code.Equals(h1.containerCode)).Select(x => x.GroupType).FirstOrDefault()
                            != containerList.Where(x => x.Code.Equals(h2.containerCode)).Select(x => x.GroupType).FirstOrDefault()) { h2.status = "C"; }
                    }
                    h2.remark = (h1.remark.code == null ? h2.remark : h2.remark.code == null ? h1.remark : h1.remark.code != h2.remark.code ? h2.remark : h1.remark);
                    planHs.Where(z => z.plan != null && z.plan.id == h1.id).FirstOrDefault().status = h1.status;
                    planHs.Add(new ShipmentPlanGetReport2Res.Report()
                    {
                        week = h2.week
                        , date = h2.date
                        , plan = h1
                        , actual = h2
                        , status = h2.status
                    });
                    
                    plan.Remove(h1);
                }
                else
                {
                    h2.status = "N";
                    planHs.Add(new ShipmentPlanGetReport2Res.Report()
                    {
                        week = h2.week
                        , date = h2.date
                        , actual = h2
                        , status = h2.status
                    });
                }
            }
            plan.Where(x => x.status == "RR").ToList().ForEach(x =>
            {                
                x.status = (DateTime.Today < BaseValidate.GetDate(x.date)) ? null : "R";
                var tmp = planHs.Where(z => z.plan != null && z.plan.id == x.id).FirstOrDefault();
                tmp.status = x.status;
                if (x.status == null) tmp.actual = null;
            });

            return planHs.OrderBy(x => BaseValidate.GetDate(x.date)).ToList();
        }
    }
}
