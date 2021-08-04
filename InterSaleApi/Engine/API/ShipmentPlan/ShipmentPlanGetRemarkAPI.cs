using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
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
    public class ShipmentPlanGetRemarkAPI: BaseAPIEngine<ShipmentPlanGetReportRequest, ShipmentPlanGetRemarkRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        private List<ShipmentPlanGetPayAmount> payAmounts;
        private List<sxsFreightContainer> containerList;

        protected override void ExecuteChild(ShipmentPlanGetReportRequest dataReq, ShipmentPlanGetRemarkRes dataRes)
        {

            var db = ShipmentPlanADO.GetInstant().GetData(dataReq, this.Logger);

            payAmounts = ShipmentPlanADO.GetInstant().GetPayAmount(db.GroupBy(x => x.PI_Code).Select(x => x.Key).ToList());

            // get container
            containerList = ShipmentPlanADO.GetInstant().ListContainerSize(null);

            dataReq.planType = "A";
            var db2 = ShipmentPlanADO.GetInstant().GetData(dataReq, this.Logger);

            var plan = ConvertData(db);
            var actual = ConvertData(db2);

            dataRes.planRemarks = GetReportCompareHeader(plan, actual);
        }

        public class PlanH
        {
            public string ID;
            public List<string> CI_Code;
            public int PlanWeek;
            public DateTime PlanDate;
            public string Container_Code;
            public INTIdCodeDescriptionModel remark;
            public List<INTIdCodeDescriptionModel> Customers;
            public List<string> PaymentTerms;
            public List<CurrencyModel> PayAmounts { get; set; }
            public decimal PlanAmount;
            public decimal StockAmount;
            public decimal ProductComplete;
            public string status;
        }

        private List<PlanH> ConvertData(List<ShipmentPlanGetData> data)
        {
            var planHs = new List<PlanH>();

            data.GroupBy(x => x.ID).ToList().ForEach( m =>
            {
                var x = m.ToList();
                List<CurrencyModel> payAmountTmp = new List<CurrencyModel>();
                x.GroupBy(p => p.PI_Code).Select(p => p.Key).ToList().ForEach(p => {
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

                planHs.Add(new PlanH()
                {
                    ID = x.First().ID
                    , PlanWeek = x.First().PlanWeek
                    , PlanDate = x.First().PlanDate
                    , Customers = customers
                    , CI_Code = GetCiCode(x)
                    , Container_Code = x.First().Container_Code
                    , PaymentTerms = x.GroupBy(p => p.PaymentTerm).Select(p => p.Key).ToList()
                    , PayAmounts = payAmountTmp2
                    , remark = new INTIdCodeDescriptionModel() { id = x.First().Remark_ID, code = x.First().Remark_Code, description = x.First().Remark_Des }
                    , PlanAmount = x.Sum(z => z.PlanAmount)
                    , StockAmount = x.Sum(z => z.StockAmount)
                });
                planHs.Last().ProductComplete = planHs.Last().StockAmount == 0 ? 0 : (planHs.Last().StockAmount / planHs.Last().PlanAmount) * 100;

                if (string.IsNullOrWhiteSpace(x.First().Container_Code))
                {
                    var ContainerTmp = new List<sxsFreightContainer>();
                    var wn = x.Sum(y => y.Weight) == 0 ? 1 : x.Sum(y => y.Weight);
                    containerList.ForEach(y =>
                    {
                        ContainerTmp.Add(new sxsFreightContainer() { ID = y.ID, Code = y.Code, WeightKg = (Math.Abs(y.MaxWeightKg - wn) / wn) * 100 });
                    });
                    planHs.Last().Container_Code = ContainerTmp.OrderBy(y => y.WeightKg).ToList().First().Code;
                }
            });

            return planHs;
        }

        private List<string> GetCiCode(List<ShipmentPlanGetData> data)
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

        private List<ShipmentPlanGetRemarkRes.PlanRemark> GetReportCompareHeader(List<PlanH> plan, List<PlanH> actual)
        {
            var planHs = new List<ShipmentPlanGetRemarkRes.PlanRemark>();
            foreach (var h1 in plan)
            {
                var h2 = actual.FirstOrDefault(x => x.Customers.TrueForAll(y => h1.Customers.Any(z => z.code == y.code)) &&
                                    h1.Customers.TrueForAll(y => x.Customers.Any(z => z.code == y.code)) &&
                                    x.PlanWeek == h1.PlanWeek &&
                                    x.PlanDate.Month == h1.PlanDate.Month &&
                                    x.PlanDate.Year == h1.PlanDate.Year);
                if (h2 != null)
                {
                    h1.status = "S";
                    h2.status = "S";
                    if (!String.IsNullOrWhiteSpace(h1.Container_Code) && !String.IsNullOrWhiteSpace(h2.Container_Code))
                    {
                        if (containerList.Where(x => x.Code.Equals(h1.Container_Code)).Select(x => x.GroupType).FirstOrDefault()
                            != containerList.Where(x => x.Code.Equals(h2.Container_Code)).Select(x => x.GroupType).FirstOrDefault()) { h2.status = "C"; }
                    }
                    h2.remark = (h1.remark.code == null ? h2.remark : h2.remark.code == null ? h1.remark : h1.remark.code != h2.remark.code ? h2.remark : h1.remark);
                    planHs.Add(new ShipmentPlanGetRemarkRes.PlanRemark
                    {
                        //planHID = Convert.ToInt32(h1.ID)
                        planWeek = h2.PlanWeek
                        , planDate = h2.PlanDate
                        , customers = h1.Customers
                        , ciCode = h2.CI_Code
                        , plan = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() { id = h1.ID, date = BaseValidate.GetDateString(h1.PlanDate), containerCode = h1.Container_Code }
                        , actual = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() { id = h2.ID, date = BaseValidate.GetDateString(h2.PlanDate), containerCode = h2.Container_Code }
                        , paymentTerms = h1.PaymentTerms
                        , payAmounts = h1.PayAmounts
                        , planAmount = h1.PlanAmount
                        , stockAmount = h1.StockAmount
                        , productComplete = h1.ProductComplete
                        , remark = h2.remark
                        , status = h2.status
                    });
                    actual.Remove(h2);
                }
                else
                {
                    h1.status = "RR";
                }
            }

            foreach (var h2 in actual)
            {
                var h1 = plan.FirstOrDefault(x => x.status == "RR" &&
                                    x.Customers.TrueForAll(y => h2.Customers.Any(z => z.code == y.code)) &&
                                    h2.Customers.TrueForAll(y => x.Customers.Any(z => z.code == y.code)) &&
                                    x.PlanDate.Month == h2.PlanDate.Month &&
                                    x.PlanDate.Year == h2.PlanDate.Year);
                if (h1 != null)
                {
                    h2.status = "M";
                    if (!String.IsNullOrWhiteSpace(h1.Container_Code) && !String.IsNullOrWhiteSpace(h2.Container_Code))
                    {
                        if (containerList.Where(x => x.Code.Equals(h1.Container_Code)).Select(x => x.GroupType).FirstOrDefault()
                            != containerList.Where(x => x.Code.Equals(h2.Container_Code)).Select(x => x.GroupType).FirstOrDefault()) { h2.status = "C"; }
                    }
                    h2.remark = (h1.remark.code == null ? h2.remark : h2.remark.code == null ? h1.remark : h1.remark.code != h2.remark.code ? h2.remark : h1.remark);
                    planHs.Add(new ShipmentPlanGetRemarkRes.PlanRemark()
                    {
                        //planHID = Convert.ToInt32(h1.ID)
                        planWeek = h2.PlanWeek
                        , planDate = h2.PlanDate
                        , customers = h1.Customers
                        , ciCode = h2.CI_Code
                        , plan = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() { id = h1.ID, date = BaseValidate.GetDateString(h1.PlanDate), containerCode = h1.Container_Code }
                        , actual = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() { id = h2.ID, date = BaseValidate.GetDateString(h2.PlanDate), containerCode = h2.Container_Code }
                        , paymentTerms = h1.PaymentTerms
                        , payAmounts = h1.PayAmounts
                        , planAmount = h1.PlanAmount
                        , stockAmount = h1.StockAmount
                        , productComplete = h1.ProductComplete
                        , remark = h2.remark
                        , status = h2.status
                    });
                    plan.Remove(h1);
                }
                else
                {
                    planHs.Add(new ShipmentPlanGetRemarkRes.PlanRemark()
                    {
                        //planHID = null
                        planWeek = h2.PlanWeek
                        , planDate = h2.PlanDate
                        , customers = h2.Customers
                        , ciCode = h2.CI_Code
                        , plan = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA()
                        , actual = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() { id = h2.ID, date = BaseValidate.GetDateString(h2.PlanDate), containerCode = h2.Container_Code }
                        , paymentTerms = h2.PaymentTerms
                        , payAmounts = h2.PayAmounts
                        , planAmount = h2.PlanAmount
                        , stockAmount = h2.StockAmount
                        , productComplete = h2.ProductComplete
                        , remark = h2.remark
                        , status = "N"
                    });
                }
            }

            plan.Where(x => x.status == "RR").ToList().ForEach(x => 
            {
                if(DateTime.Today >= x.PlanDate)
                {
                    planHs.Add(new ShipmentPlanGetRemarkRes.PlanRemark()
                    {
                        //planHID = Convert.ToInt32(x.ID)
                        planWeek = x.PlanWeek
                        , planDate = x.PlanDate
                        , customers = x.Customers
                        , ciCode = x.CI_Code
                        , plan = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() { id = x.ID, date = BaseValidate.GetDateString(x.PlanDate), containerCode = x.Container_Code }
                        , actual = new ShipmentPlanGetRemarkRes.PlanRemark.DataPA() 
                        , paymentTerms = x.PaymentTerms
                        , payAmounts = x.PayAmounts
                        , planAmount = x.PlanAmount
                        , stockAmount = x.StockAmount
                        , productComplete = x.ProductComplete
                        , remark = x.remark
                        , status = "R"
                    });
                }
            });

            planHs = planHs.OrderBy(x => x.planWeek).ThenBy(x => x.planDate).ToList();

            return planHs;
        }
    }
}
