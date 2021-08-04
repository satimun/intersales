using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity.Response;
using Microsoft.AspNetCore.Mvc.Formatters.Xml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanGetForecastReportAPI : BaseAPIEngine<ShipmentPlanGetForecastReportReq, ShipmentPlanGetForecastReportResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        private static object _lockObj = new object();

        protected override void ExecuteChild(ShipmentPlanGetForecastReportReq dataReq, ShipmentPlanGetForecastReportResponse dataRes)
        {


            var data = ShipmentPlanADO.GetInstant().GetForecastReport(dataReq, Logger).GroupBy(x => new { 
                zone = x.zoneID, country = x.countryID, customer = x.customerID, month = x.Month, product = x.productTypeID, 
                quality = x.Quality_Code,
                diameter = x.diameter, diamertLB = x.diameterLB, meshSize = x.MeshSizeLB, meshDepth = x.MeshDepthLB, length = x.LengthLB,
                stretching = x.StretchingID, knotType = x.KnotTypeID, label = x.LabelID,
                color = x.colorID
            }).ToList();
            
            Parallel.ForEach(data, x => {
                var tmp = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast()
                {
                    zone = new INTIdCodeDescriptionModel() { id = x.First().zoneID, code = x.First().zoneCode, description = x.First().zoneDes },
                    country = new INTIdCodeDescriptionModel() { id = x.First().countryID, code = x.First().countryCode, description = x.First().countryDes },
                    customer = new INTIdCodeDescriptionModel() { id = x.First().customerID, code = x.First().customerCode, description = x.First().customerDes },
                    month = x.First().Month,
                    years = x.Select(d => new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.YearModel()
                    {
                        year = d.Year,
                        forecast = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = d.forecastWeight, value = d.forecastValue },
                        actual = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = d.actualWeight, value = d.actualValue },
                        shipmentPlan = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = d.shipmentWeight, value = d.shipmentValue }
                    }).ToList(),
                    diameter = x.First().diameter,
                    color = new INTIdCodeDescriptionModel() { id = x.First().colorID, code = x.First().colorCode, description = x.First().colorDes },
                    productType = new INTIdCodeDescriptionModel() { id = x.First().productTypeID, code = x.First().productTypeCode, description = x.First().productTypeDes },
                    lastYear = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = x.Sum(v => v.lastYearWeight), value = x.Sum(v => v.lastYearValue) },
                };

                tmp.forecast = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = tmp.years.Sum(d => d.forecast.weight), value = tmp.years.Sum(d => d.forecast.value) };
                tmp.actual = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = tmp.years.Sum(d => d.actual.weight), value = tmp.years.Sum(d => d.actual.value) };
                tmp.shipmentPlan = new ShipmentPlanGetForecastReportResponse.ShipmentPlanForecast.WeightValue() { weight = tmp.years.Sum(d => d.shipmentPlan.weight), value = tmp.years.Sum(d => d.shipmentPlan.value) };

                tmp.diameterLB = x.First().diameterLB;
                tmp.Quality = x.First().Quality_Code;
                tmp.MeshSizeLB = x.First().MeshSizeLB;
                tmp.MeshDepthLB = x.First().MeshDepthLB;
                tmp.LengthLB = x.First().LengthLB;

                tmp.StretchingLB = x.First().StretchingDes;
                tmp.KnotTypeLB = x.First().KnotTypeDes;

                tmp.Label = new INTIdCodeDescriptionModel()
                {
                    id = x.First().LabelID,
                    code = x.First().LabelCode,
                    description = x.First().LabelDes
                };

                lock (_lockObj)
                {
                    dataRes.shipmentPlanForecasts.Add(tmp);
                }     
            });
        }
        
    }
}
