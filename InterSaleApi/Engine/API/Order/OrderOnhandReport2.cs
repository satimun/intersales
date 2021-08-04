using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using InterSaleModel.Model.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Order
{
    public class OrderOnhandReport2 : BaseAPIEngine<OrderOnhandReportReq, OrderOnhandReportRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        private static object _lockObj = new object();

        protected override void ExecuteChild(OrderOnhandReportReq dataReq, OrderOnhandReportRes dataRes)
        {
            dataRes.orders = new List<OrderOnhandReportRes.OrderOnhand>();

            var customerFilter = CustomerADO.GetInstant().ForFilter(new ShipmentPlanForecastReport2Req()
            {
                customerIDs = dataReq.customerIDs,
                regionalZoneIDs = dataReq.regionalZoneIDs,
                zoneAccountIDs = dataReq.zoneAccountIDs
            });
            dataReq.customerCodes = customerFilter.Select(x => x.code).ToList();

            dataReq.customerIDs = customerFilter.Select(v => v.id.ToString()).ToList();

            List<sxvCustomer> customer = new List<sxvCustomer>();
            List<sxsProductType> productType = new List<sxsProductType>();
            List<sxsProductColor> productColor = new List<sxsProductColor>();

            List<sxsMaterialGroup> materialGroup = new List<sxsMaterialGroup>();
            List<DiameterGroupList> diameterGroup = new List<DiameterGroupList>();
            List<OrderOnhandSearch2> order = new List<OrderOnhandSearch2>();

            List<int> loop = new List<int>() { 1, 2, 3, 4, 5, 6 };

            Parallel.ForEach(loop, l =>
            {
                if (l == 1) // customer list
                {
                    customer = ADO.CustomerADO.GetInstant().ListByCode(dataReq.customerCodes);
                }
                else if (l == 2) // data
                {
                    order = OrderOnhandADO.GetInstant().Search2(dataReq);
                }
                else if (l == 3) // product Type
                {
                    productType = ADO.ProductTypeADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
                }
                else if (l == 4) // product Color
                {
                    productColor = ADO.ProductColorADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
                }
                else if (l == 5 && dataReq.MaterialGroup)
                {
                    materialGroup = ADO.MaterialGroupADO.GetInstant().ListAll();
                    materialGroup.Add(new sxsMaterialGroup()
                    {
                        ID = 0,
                        Description = "OTHER"
                    });
                }
                else if (l == 6 && dataReq.DiameterGroup)
                {
                    diameterGroup = ADO.DiameterGroupADO.GetInstant().List();
                }
            });

            var data = order.GroupBy(x => new
            {
                customer = x.CustomerCode,
                productType = x.ProductTypeCode,
                diameter = x.Diameter,
                color = x.ColorCode,
                currency = x.CurrencyCode
            }).ToList();

            Parallel.ForEach(data, x =>
            {
                var customerTmp = customer.Find(v => v.Code == x.First().CustomerCode);
                var productTypeTmp = productType.Find(v => v.Code == x.First().ProductTypeCode);

                var productColorTmp = productColor.Find(v => v.CodeOld == x.First().ColorCode);
                var materialGroupTmp = materialGroup.Find(v => v.ID == productTypeTmp?.MaterialGroup_ID);

                var tmp = new OrderOnhandReportRes.OrderOnhand()
                {
                    zone = new INTIdCodeDescriptionModel() { id = customerTmp?.Zone_ID, code = customerTmp?.Zone_Code, description = customerTmp?.Zone_Des },
                    country = new INTIdCodeDescriptionModel() { id = customerTmp?.Country_ID, code = customerTmp?.Country_Code, description = customerTmp?.Country_Des },
                    customer = new INTIdCodeDescriptionModel() { id = customerTmp?.ID, code = x.First().CustomerCode, description = customerTmp?.Description },
                    productType = new INTIdCodeDescriptionModel() { id = productTypeTmp?.ID, code = x.First().ProductTypeCode, description = productTypeTmp?.Description },
                    color = new INTIdCodeDescriptionModel() { id = productColorTmp?.ID, code = x.First().ColorCode, description = productColorTmp?.Description },
                    materialGroup = materialGroupTmp?.Description,
                    diameter = x.First().Diameter,
                    currencyCode = x.First().CurrencyCode,
                    proforma = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Ord_quantity),
                        weight = x.Sum(z => z.Ord_weight),
                        bale = x.Sum(z => z.Ord_bale),
                        values = x.GroupBy(y => y.CurrencyCode).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().CurrencyCode, num = z.Sum(d => d.Ord_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Ord_valueTHB),
                    },

                    delivered = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Del_quantity),
                        weight = x.Sum(z => z.Del_weight),
                        bale = x.Sum(z => z.Del_bale),
                        values = x.GroupBy(y => y.CurrencyCode).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().CurrencyCode, num = z.Sum(d => d.Del_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Del_valueTHB),
                    },

                    outstanding = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Osd_quantity),
                        weight = x.Sum(z => z.Osd_weight),
                        bale = x.Sum(z => z.Osd_bale),
                        values = x.GroupBy(y => y.CurrencyCode).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().CurrencyCode, num = z.Sum(d => d.Osd_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Osd_valueTHB),
                    },

                    inventory = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Inv_quantity),
                        weight = x.Sum(z => z.Inv_weight),
                        bale = x.Sum(z => z.Inv_bale),
                        values = x.GroupBy(y => y.CurrencyCode).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().CurrencyCode, num = z.Sum(d => d.Inv_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Inv_valueTHB),
                    },

                    expecting = new OrderOnhandReportRes.OrderOnhand.Balance()
                    {
                        quantity = x.Sum(z => z.Exp_quantity),
                        weight = x.Sum(z => z.Exp_weight),
                        bale = x.Sum(z => z.Exp_bale),
                        values = x.GroupBy(y => y.CurrencyCode).Select(z => new OrderOnhandReportRes.OrderOnhand.Values() { code = z.First().CurrencyCode, num = z.Sum(d => d.Exp_value) }).ToList(),
                        valueTHB = x.Sum(z => z.Exp_valueTHB),
                    }
                };

                if (dataReq.DiameterGroup)
                {
                    var dimeterGroupTmp = diameterGroup.Find(v => v.ProductType_ID == productTypeTmp?.ID && v.ProductTwineSize_Code == tmp.diameter);
                    tmp.diameterGroup = dimeterGroupTmp?.Description;
                }

                tmp._key = string.Concat(tmp.zone.code, '_', tmp.customer.code, '_', tmp.materialGroup, '_', tmp.productType);

                lock (_lockObj)
                {
                    dataRes.orders.Add(tmp);
                }

            });

            dataRes.orders = dataRes.orders.OrderBy(v => v._key).ThenBy(v => v.diameter).ToList();
            Parallel.ForEach(dataRes.orders, x => x._key = null);
        }
    }
}
