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

namespace InterSaleApi.Engine.API.CommercialInvoice
{
    public class CommercialInvoiceItemsReport : BaseAPIEngine<CommercialInvoiceItemsReportReq, CommercialInvoiceItemsReportRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        private static object _lockObj = new object();

        protected override void ExecuteChild(CommercialInvoiceItemsReportReq dataReq, CommercialInvoiceItemsReportRes dataRes)
        {
            var customerFilter = ADO.CustomerADO.GetInstant().ForFilter(new ShipmentPlanForecastReport2Req()
            {
                customerIDs = dataReq.CustomerID,
                zoneAccountIDs = dataReq.ZoneID,
                countryIDs = dataReq.CountryID,
                regionalZoneIDs = dataReq.RegionalZoneID                
            });
            dataReq.customerCodes = customerFilter.Select(x => x.code).ToList();

            var dateFrom = DateTimeUtil.GetDate(dataReq.DateFrom).Value;
            var dateTo = DateTimeUtil.GetDate(dataReq.DateTo).Value;

            List<INTIdCodeDescriptionModel> label = new List<INTIdCodeDescriptionModel>();
            List<sxsProductKnot> knotType = new List<sxsProductKnot>();
            List<sxsProductStretching> stretching = new List<sxsProductStretching>();
            List<sxvCustomer> customer = new List<sxvCustomer>();

            List<CommercialInvoiceRes> actual = new List<CommercialInvoiceRes>();

            bool IsLastYear = dateFrom.Year == dateTo.Year || dateFrom.Year + 1 == dateTo.Year;

            List<int> loop = new List<int>() { 1, 2, 3, 4, 5 };
            Parallel.ForEach(loop, l =>
            {
                if (l == 1) // actual
                {
                    actual = ADO.CommercialInvoiceADO.GetInstant().Search(dataReq);
                }
                else if (l == 2) // label
                {
                    label = dataReq.ShowDes ? ADO.Label.GetInstant().List() : new List<INTIdCodeDescriptionModel>();
                }
                else if (l == 3) // knotType
                {
                    knotType = dataReq.ShowSpec ? ADO.ProductKnotADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } }) : new List<sxsProductKnot>();
                }
                else if (l == 4) // Stretching
                {
                    stretching = dataReq.ShowSpec ? ADO.ProductStretchingADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } }) : new List<sxsProductStretching>();
                }
                else if (l == 5) // customer list
                {
                    customer = dataReq.ShowCountry || dataReq.ShowCustomer || dataReq.ShowZone ? ADO.CustomerADO.GetInstant().ListByCode(dataReq.customerCodes) : new List<sxvCustomer>();
                }
            });

            var data = actual.GroupBy(x => new
            {
                ProductCode = x.ProductCode,
                CustomerCode = x.CustomerCode,
                SalesUnitCode = x.SalesUnitCode,
                CINO = x.CINO,
                OrderNo = x.OrderNo
            });

            List<int> quarters = new List<int>() { 1, 2, 3, 4 };

            Parallel.ForEach(data, x =>
            {
                var customerTmp = customer.Find(v => v.Code == x.Key.CustomerCode);
                var tmp = new CommercialInvoiceItemsReportRes.cimodel()
                {
                    zone = dataReq.ShowZone ? new INTIdCodeDescriptionModel() { id = customerTmp?.Zone_ID, code = customerTmp?.Zone_Code, description = customerTmp?.Zone_Des } : null,
                    country = dataReq.ShowCountry ? new INTIdCodeDescriptionModel() { id = customerTmp?.Country_ID, code = customerTmp?.Country_Code, description = customerTmp?.Country_Des } : null,
                    customer = dataReq.ShowCustomer ? new INTIdCodeDescriptionModel() { id = customerTmp?.ID, code = x.First().CustomerCode, description = customerTmp?.Description } : null,
                    Product = new CodeDescModel()
                    {
                        code = x.Key.ProductCode,
                        description = x.First().ProductDes
                    },
                    ProductTypeCode = x.First().ProductTypeCode,
                    QualityCode = x.First().QualityCode,
                    ProductTwineNo = x.First().ProductTwineNo,
                    DiameterLabel = x.First().DiameterLabel,
                    MeshSizeProd = x.First().MeshSizeProd,
                    MeshDepthProd = x.First().MeshDepthProd,
                    LengthProd = x.First().LengthProd,
                    ColorCode = x.First().ColorCode,
                    SalesUnitCode = x.Key.SalesUnitCode,
                    cino = x.First().CINO,
                    OrderNo = x.First().OrderNo,
                    Selvage = new CodeDescModel()
                    {
                        code = x.First().SelvageCode,
                        description = x.First().SelvageDes
                    }
                };

                tmp.Stretching = stretching.Find(v => v.Code == x.First().StretchingCode)?.Description;
                tmp.KnotType = knotType.Find(v => v.Code2 == x.First().KnotTypeCode)?.Code2;

                var labelTmp = label.Find(v => v.code == x.First().LabelCode);
                tmp.Label = new CodeDescModel()
                {
                    code = x.First().LabelCode,
                    description = labelTmp?.description
                };

                if (dataReq.Mode == "Y")
                {
                    tmp.Years = new List<CommercialInvoiceItemsReportRes.cimodel.YearModel>();
                    x.GroupBy(v => v.Year).ToList().ForEach(y =>
                    {
                        tmp.Years.Add(new CommercialInvoiceItemsReportRes.cimodel.YearModel()
                        {
                            Year = y.Key,
                            Amount = y.Sum(v => v.AmountPC),
                            Weight = y.Sum(v => v.WeightKG),
                            Value = y.Sum(v => v.Value),
                            ValueTHB = y.Sum(v => v.ValueTHB)
                        });
                    });
                }
                else if (dataReq.Mode == "Q")
                {
                    tmp.Quarters = new List<CommercialInvoiceItemsReportRes.cimodel.QuarterModel>();
                    Parallel.ForEach(quarters, quarter =>
                    {
                        if(quarter == 1)
                        {
                            var q1 = x.Where(v => v.Month >= 1 && v.Month <= 3).ToList();
                            if (q1.Count > 0)
                            {
                                var q = new CommercialInvoiceItemsReportRes.cimodel.QuarterModel()
                                {
                                    Quarter = quarter,
                                    Amount = q1.Sum(v => v.AmountPC),
                                    Weight = q1.Sum(v => v.WeightKG),
                                    Value = q1.Sum(v => v.Value),
                                    ValueTHB = q1.Sum(v => v.ValueTHB)
                                };
                                lock (_lockObj)
                                {
                                    tmp.Quarters.Add(q);
                                }                                
                            }
                        }
                        else if (quarter == 2)
                        {
                            var q2 = x.Where(v => v.Month >= 4 && v.Month <= 6).ToList();
                            if (q2.Count > 0)
                            {
                                var q = new CommercialInvoiceItemsReportRes.cimodel.QuarterModel()
                                {
                                    Quarter = quarter,
                                    Amount = q2.Sum(v => v.AmountPC),
                                    Weight = q2.Sum(v => v.WeightKG),
                                    Value = q2.Sum(v => v.Value),
                                    ValueTHB = q2.Sum(v => v.ValueTHB)
                                };
                                lock (_lockObj)
                                {
                                    tmp.Quarters.Add(q);
                                }                                
                            }
                        }
                        else if (quarter == 3)
                        {
                            var q3 = x.Where(v => v.Month >= 7 && v.Month <= 9).ToList();
                            if (q3.Count > 0)
                            {
                                var q = new CommercialInvoiceItemsReportRes.cimodel.QuarterModel()
                                {
                                    Quarter = quarter,
                                    Amount = q3.Sum(v => v.AmountPC),
                                    Weight = q3.Sum(v => v.WeightKG),
                                    Value = q3.Sum(v => v.Value),
                                    ValueTHB = q3.Sum(v => v.ValueTHB)
                                };
                                lock (_lockObj)
                                {
                                    tmp.Quarters.Add(q);
                                }                                
                            }
                        }
                        else
                        {
                            var q4 = x.Where(v => v.Month >= 10 && v.Month <= 12).ToList();
                            if (q4.Count > 0)
                            {
                                var q = new CommercialInvoiceItemsReportRes.cimodel.QuarterModel()
                                {
                                    Quarter = quarter,
                                    Amount = q4.Sum(v => v.AmountPC),
                                    Weight = q4.Sum(v => v.WeightKG),
                                    Value = q4.Sum(v => v.Value),
                                    ValueTHB = q4.Sum(v => v.ValueTHB)
                                };
                                lock (_lockObj)
                                {
                                    tmp.Quarters.Add(q);
                                }
                            }
                        }                        
                    });                    
                }
                else
                {
                    tmp.Months = new List<CommercialInvoiceItemsReportRes.cimodel.MonthModel>();
                    x.GroupBy(v => v.Month).ToList().ForEach(y =>
                    {
                        tmp.Months.Add(new CommercialInvoiceItemsReportRes.cimodel.MonthModel()
                        {
                            Month = y.Key,
                            Amount = y.Sum(v => v.AmountPC),
                            Weight = y.Sum(v => v.WeightKG),
                            Value = y.Sum(v => v.Value),
                            ValueTHB = y.Sum(v => v.ValueTHB)
                        });
                    });
                }

                tmp.Total = new CommercialInvoiceItemsReportRes.cimodel.TotalModel()
                {
                    Amount = x.Sum(v => v.AmountPC),
                    Weight = x.Sum(v => v.WeightKG),
                    Value = x.Sum(v => v.Value),
                    ValueTHB = x.Sum(v => v.ValueTHB)
                };

                tmp._key = string.Concat(tmp.zone?.code, '_', tmp.customer?.code, '_', tmp.Product.code, '_', tmp.ProductTypeCode);

                lock (_lockObj)
                {
                    dataRes.comercialInvoice.Add(tmp);
                }
            });

            dataRes.comercialInvoice = dataRes.comercialInvoice.OrderBy(v => v._key).ThenBy(v => v.ProductTwineNo).ToList();
            Parallel.ForEach(dataRes.comercialInvoice, x => x._key = null);
        }
    }
}
