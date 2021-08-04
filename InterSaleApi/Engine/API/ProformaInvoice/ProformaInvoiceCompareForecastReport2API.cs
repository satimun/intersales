using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Views;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ProformaInvoice
{
    public class ProformaInvoiceCompareForecastReport2API : BaseAPIEngine<ProformaInvoiceForecastReport2Req, ProformaInvoiceCompareForecastReportRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        private static object _lockObj = new object();

        protected override void ExecuteChild(ProformaInvoiceForecastReport2Req dataReq, ProformaInvoiceCompareForecastReportRes dataRes)
        {

            var customerFilter = ADO.CustomerADO.GetInstant().ForFilter(dataReq);
            dataReq.customerCodes = customerFilter.Select(x => x.code).ToList();

            var dateFrom = DateTimeUtil.GetDate(dataReq.dateFrom).Value;
            var dateTo = DateTimeUtil.GetDate(dataReq.dateTo).Value;

            if (dataReq.MaterialGroup)
            {
                dataReq.ProductTypeCode = true;
            }

            if (dataReq.DiameterGroup)
            {
                dataReq.ProductTypeCode = true;
                dataReq.Diameter = true;
            }

            List<sxvCustomer> customer = new List<sxvCustomer>();
            List<INTIdCodeDescriptionModel> label = new List<INTIdCodeDescriptionModel>();
            List<sxsProductKnot> knotType = new List<sxsProductKnot>();
            List<sxsProductStretching> stretching = new List<sxsProductStretching>();
            List<sxsProductType> productType = new List<sxsProductType>();
            List<sxsProductColor> productColor = new List<sxsProductColor>();

            List<ProformaInvoiceForecastReport> forecast = new List<ProformaInvoiceForecastReport>();
            List<ProformaInvoiceForecastReport> actual = new List<ProformaInvoiceForecastReport>();
            List<ProformaInvoiceForecastReport> lastyear = new List<ProformaInvoiceForecastReport>();
            List<ProformaInvoiceForecastReport> plan = new List<ProformaInvoiceForecastReport>();

            List<sxsMaterialGroup> materialGroup = new List<sxsMaterialGroup>();
            List<DiameterGroupList> diameterGroup = new List<DiameterGroupList>();

            bool IsLastYear = dateFrom.Year == dateTo.Year || dateFrom.Year + 1 == dateTo.Year;

            List<int> loop = new List<int>() { 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12 };
            Parallel.ForEach(loop, l =>
            {
                if (l == 1) // customer list
                {
                    customer = ADO.CustomerADO.GetInstant().ListByCode(dataReq.customerCodes);
                }
                else if (l == 2) // forecast
                {
                    forecast = ADO.ProformaInvoiceADO.GetInstant().GetReportForcast(dataReq);
                }
                else if (l == 3) // actual
                {
                    actual = ADO.ProformaInvoiceADO.GetInstant().GetReportActual(dataReq);
                }
                else if (l == 4) // last year
                {
                    if (IsLastYear)
                    {
                        lastyear = ADO.ProformaInvoiceADO.GetInstant().GetReportActual(dataReq, "L");
                    }
                }
                else if (l == 6) // label
                {
                    label = ADO.Label.GetInstant().List();
                }
                else if (l == 7) // knotType
                {
                    knotType = ADO.ProductKnotADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
                }
                else if (l == 8) // Stretching
                {
                    stretching = ADO.ProductStretchingADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
                }
                else if (l == 9) // product Type
                {
                    productType = ADO.ProductTypeADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
                }
                else if (l == 10) // product Color
                {
                    productColor = ADO.ProductColorADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
                }
                else if (l == 11 && dataReq.MaterialGroup)
                {
                    materialGroup = ADO.MaterialGroupADO.GetInstant().ListAll();
                    materialGroup.Add(new sxsMaterialGroup()
                    {
                        ID = 0,
                        Description = "OTHER"
                    });
                }
                else if (l == 12 && dataReq.DiameterGroup)
                {
                    diameterGroup = ADO.DiameterGroupADO.GetInstant().List();
                }
            });

            forecast.AddRange(actual);
            forecast.AddRange(lastyear);
            forecast.AddRange(plan);

            var data = forecast.GroupBy(x => new
            {
                customer = x.CustomerCode,
                month = x.Month,
                product = x.ProductTypeCode,
                quality = x.QualityCode,
                diameter = x.Diameter,
                diameterLB = x.DiameterLB,
                meshSize = x.MeshSizeLB,
                meshDepth = x.MeshDepthLB,
                length = x.LengthLB,
                stretching = x.StretchingCode,
                knotType = x.KnotTypeCode,
                label = x.LabelCode,
                color = x.ColorCode
            });

            Parallel.ForEach(data, x =>
            {
                var customerTmp = customer.Find(v => v.Code == x.First().CustomerCode);
                var productTypeTmp = productType.Find(v => v.Code == x.First().ProductTypeCode);
                if (productTypeTmp != null || (productTypeTmp?.Code == x.First().ProductTypeCode))
                {
                    var productColorTmp = productColor.Find(v => v.CodeOld == x.First().ColorCode);
                    var materialGroupTmp = materialGroup.Find(v => v.ID == productTypeTmp?.MaterialGroup_ID);

                    var tmp = new ProformaInvoiceCompareForecastReportRes.pic()
                    {
                        zone = new INTIdCodeDescriptionModel() { id = customerTmp?.Zone_ID, code = customerTmp?.Zone_Code, description = customerTmp?.Zone_Des },
                        country = new INTIdCodeDescriptionModel() { id = customerTmp?.Country_ID, code = customerTmp?.Country_Code, description = customerTmp?.Country_Des },
                        customer = new INTIdCodeDescriptionModel() { id = customerTmp?.ID, code = x.First().CustomerCode, description = customerTmp?.Description },
                        month = x.First().Month,
                        years = new List<ProformaInvoiceCompareForecastReportRes.pic.YearModel>(),
                        diameter = x.First().Diameter,
                        color = new INTIdCodeDescriptionModel() { id = productColorTmp?.ID, code = x.First().ColorCode, description = productColorTmp?.Description },
                        productType = new INTIdCodeDescriptionModel() { id = productTypeTmp?.ID, code = x.First().ProductTypeCode, description = productTypeTmp?.Description },
                        materialGroup = materialGroupTmp?.Description
                    };

                    if (IsLastYear)
                    {
                        var lastYearTmp = x.Where(d => d.CodeType == "L").ToList();
                        tmp.lastYear = new ProformaInvoiceCompareForecastReportRes.pic.WeightValue() { weight = lastYearTmp.Sum(v => v.Weightkg), amount = lastYearTmp.Sum(v => v.Amountpc), value = lastYearTmp.Sum(v => v.Value) };
                    }

                    x.GroupBy(v => v.Year).ToList().ForEach(v =>
                    {
                        var foreCastTmp = v.Where(d => d.CodeType == "F").ToList();
                        var actualTmp = v.Where(d => d.CodeType == "A").ToList();
                        var year = new ProformaInvoiceCompareForecastReportRes.pic.YearModel()
                        {
                            year = v.Key,
                            forecast = new ProformaInvoiceCompareForecastReportRes.pic.WeightValue() { weight = foreCastTmp.Sum(y => y.Weightkg), value = foreCastTmp.Sum(y => y.Value) },
                            actual = new ProformaInvoiceCompareForecastReportRes.pic.WeightValue() { weight = actualTmp.Sum(y => y.Weightkg), amount = actualTmp.Sum(y => y.Amountpc), value = actualTmp.Sum(y => y.Value) }
                        };
                        tmp.years.Add(year);
                    });

                    tmp.forecast = new ProformaInvoiceCompareForecastReportRes.pic.WeightValue() { weight = tmp.years.Sum(d => d.forecast.weight), value = tmp.years.Sum(d => d.forecast.value) };
                    tmp.actual = new ProformaInvoiceCompareForecastReportRes.pic.WeightValue() { weight = tmp.years.Sum(d => d.actual.weight), amount = tmp.years.Sum(d => d.actual.amount), value = tmp.years.Sum(d => d.actual.value) };

                    if (dataReq.DiameterGroup)
                    {
                        var dimeterGroupTmp = diameterGroup.Find(v => v.ProductType_ID == productTypeTmp?.ID && v.ProductTwineSize_Code == tmp.diameter);
                        tmp.diameterGroup = dimeterGroupTmp?.Description;
                    }

                    tmp.diameterLB = x.First().DiameterLB;
                    tmp.Quality = x.First().QualityCode;
                    tmp.MeshSizeLB = x.First().MeshSizeLB;
                    tmp.MeshDepthLB = x.First().MeshDepthLB;
                    tmp.LengthLB = x.First().LengthLB;

                    tmp.StretchingLB = stretching.Find(v => v.Code == x.First().StretchingCode)?.Description;
                    tmp.KnotTypeLB = knotType.Find(v => v.Code2 == x.First().KnotTypeCode)?.Code2;

                    var labelTmp = label.Find(v => v.code == x.First().LabelCode);
                    tmp.Label = new INTIdCodeDescriptionModel()
                    {
                        id = labelTmp?.id,
                        code = x.First().LabelCode,
                        description = labelTmp?.description
                    };

                    tmp._key = string.Concat(tmp.month, '_', tmp.zone.code, '_', tmp.customer.code, '_', tmp.materialGroup, '_', tmp.productType);

                    lock (_lockObj)
                    {
                        dataRes.profomaInvoices.Add(tmp);
                    }
                }
            });

            dataRes.profomaInvoices = dataRes.profomaInvoices.OrderBy(v => v._key).ThenBy(v => v.diameter).ToList();
            Parallel.ForEach(dataRes.profomaInvoices, x => x._key = null);
        }
    }
}
