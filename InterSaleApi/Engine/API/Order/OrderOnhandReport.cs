using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Order
{
    public class OrderOnhandReport : BaseAPIEngine<OrderOnhandReportReq, OrderOnhandReportRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(OrderOnhandReportReq dataReq, OrderOnhandReportRes dataRes)
        {
            dataRes.orders = new List<OrderOnhandReportRes.OrderOnhand>();

            var customerFilter = CustomerADO.GetInstant().ForFilter(new ShipmentPlanForecastReport2Req()
            {
                customerIDs = dataReq.customerIDs,
                regionalZoneIDs = dataReq.regionalZoneIDs,
                zoneAccountIDs = dataReq.zoneAccountIDs
            });

            dataReq.customerIDs = customerFilter.Select(v => v.id.ToString()).ToList();

            OrderOnhandADO.GetInstant().Search(dataReq)
            .GroupBy(x => new { zone = x.Zone_ID, country = x.Country_ID, customer = x.Customer_ID, productType = x.ProductType_ID, diameter = x.Diameter, color = x.Color_ID, currency = x.Currency_Code })
            .ToList()
            .ForEach(x =>
            {
                dataRes.orders.Add(new OrderOnhandReportRes.OrderOnhand()
                {
                    zone = new INTIdCodeDescriptionModel() { id = x.First().Zone_ID, code = x.First().Zone_Code, description = x.First().Zone_Des },
                    country = new INTIdCodeDescriptionModel() { id = x.First().Country_ID, code = x.First().Country_Code, description = x.First().Country_Des },
                    customer = new INTIdCodeDescriptionModel() { id = x.First().Customer_ID, code = x.First().Customer_Code, description = x.First().Customer_Des },
                    productType = new INTIdCodeDescriptionModel() { id = x.First().ProductType_ID, code = x.First().ProductType_Code, description = x.First().ProductType_Des },
                    diameter = x.First().Diameter,
                    color = new INTIdCodeDescriptionModel() { id = x.First().Color_ID, code = x.First().Color_Code, description = x.First().Color_Des },
                    currencyCode = x.First().Currency_Code,
                    proforma = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Ord_quantity),
                        weight = x.Sum(z => z.Ord_weight),
                        bale = x.Sum(z => z.Ord_bale),
                        values = x.GroupBy(y => y.Currency_Code).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().Currency_Code, num = z.Sum(d => d.Ord_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Ord_valueTHB),
                    },

                    delivered = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Del_quantity),
                        weight = x.Sum(z => z.Del_weight),
                        bale = x.Sum(z => z.Del_bale),
                        values = x.GroupBy(y => y.Currency_Code).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().Currency_Code, num = z.Sum(d => d.Del_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Del_valueTHB),
                    },

                    outstanding = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Osd_quantity),
                        weight = x.Sum(z => z.Osd_weight),
                        bale = x.Sum(z => z.Osd_bale),
                        values = x.GroupBy(y => y.Currency_Code).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().Currency_Code, num = z.Sum(d => d.Osd_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Osd_valueTHB),
                    },

                    inventory = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Inv_quantity),
                        weight = x.Sum(z => z.Inv_weight),
                        bale = x.Sum(z => z.Inv_bale),
                        values = x.GroupBy(y => y.Currency_Code).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().Currency_Code, num = z.Sum(d => d.Inv_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Inv_valueTHB),
                    },

                    expecting = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Exp_quantity),
                        weight = x.Sum(z => z.Exp_weight),
                        bale = x.Sum(z => z.Exp_bale),
                        values = x.GroupBy(y => y.Currency_Code).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().Currency_Code, num = z.Sum(d => d.Exp_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Exp_valueTHB),
                    }

                });
            });

            //OrderOnhandADO.GetInstant().Search(dataReq)
            //.ForEach(x =>
            //{
            //    dataRes.orders.Add(new OrderOnhandReportRes.OrderOnhand()
            //    {
            //        zone = new INTIdCodeDescriptionModel() { id = x.Zone_ID, code = x.Zone_Code, description = x.Zone_Des },
            //        country = new INTIdCodeDescriptionModel() { id = x.Country_ID, code = x.Country_Code, description = x.Country_Des },
            //        customer = new INTIdCodeDescriptionModel() { id = x.Customer_ID, code = x.Customer_Code, description = x.Customer_Des },
            //        productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des },
            //        diameter = x.Diameter,
            //        color = new INTIdCodeDescriptionModel() { id = x.Color_ID, code = x.Color_Code, description = x.Color_Des },

            //        proforma = new OrderOnhandReportRes.OrderOnhand.Balance()
            //        {
            //            quantity = x.Ord_quantity,
            //            weight = x.Ord_weight,
            //            bale = x.Ord_bale,
            //            values = new List<OrderOnhandReportRes.OrderOnhand.Values>() { new OrderOnhandReportRes.OrderOnhand.Values() { code = x.Currency_Code, num = x.Ord_value } },
            //            valueTHB = x.Ord_valueTHB,
            //        },

            //        delivered = new OrderOnhandReportRes.OrderOnhand.Balance()
            //        {
            //            quantity = x.Del_quantity,
            //            weight = x.Del_weight,
            //            bale = x.Del_bale,
            //            values = new List<OrderOnhandReportRes.OrderOnhand.Values>() { new OrderOnhandReportRes.OrderOnhand.Values() { code = x.Currency_Code, num = x.Del_value } },
            //            valueTHB = x.Del_valueTHB,
            //        },

            //        outstanding = new OrderOnhandReportRes.OrderOnhand.Balance()
            //        {
            //            quantity = x.Osd_quantity,
            //            weight = x.Osd_weight,
            //            bale = x.Osd_bale,
            //            values = new List<OrderOnhandReportRes.OrderOnhand.Values>() { new OrderOnhandReportRes.OrderOnhand.Values() { code = x.Currency_Code, num = x.Osd_value } },
            //            valueTHB = x.Osd_valueTHB,
            //        },

            //        inventory = new OrderOnhandReportRes.OrderOnhand.Balance()
            //        {
            //            quantity = x.Inv_quantity,
            //            weight = x.Inv_weight,
            //            bale = x.Inv_bale,
            //            values = new List<OrderOnhandReportRes.OrderOnhand.Values>() { new OrderOnhandReportRes.OrderOnhand.Values() { code = x.Currency_Code, num = x.Inv_value } },
            //            valueTHB = x.Inv_valueTHB,
            //        },

            //        expecting = new OrderOnhandReportRes.OrderOnhand.Balance()
            //        {
            //            quantity = x.Exp_quantity,
            //            weight = x.Exp_weight,
            //            bale = x.Exp_bale,
            //            values = new List<OrderOnhandReportRes.OrderOnhand.Values>() { new OrderOnhandReportRes.OrderOnhand.Values() { code = x.Currency_Code, num = x.Exp_value } },
            //            valueTHB = x.Exp_valueTHB,
            //        }

            //    });
            //});

        }
    }
}
