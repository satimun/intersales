using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanGetForecastReportResponse : IResponseModel
    {
        public List<ShipmentPlanForecast> shipmentPlanForecasts = new List<ShipmentPlanForecast>();   
        public class ShipmentPlanForecast {

            public string _key;
            public INTIdCodeDescriptionModel zone { get; set; }
            public INTIdCodeDescriptionModel country { get; set; }            
            public INTIdCodeDescriptionModel customer { get; set; }
            public string materialGroup;
            public INTIdCodeDescriptionModel productType { get; set; }
            public string diameterGroup;
            public string diameter;
            public string diameterLB;

            public string Quality;

            public string MeshSizeLB;
            public string MeshDepthLB;
            public string LengthLB;

            public string KnotTypeLB;

            public string StretchingLB;

            public string shippingMark;
            public string dynamictext2;

            public INTIdCodeDescriptionModel Label;

            public INTIdCodeDescriptionModel color { get; set; }

            public int month;
            public List<YearModel> years;

            public WeightValue shipmentPlan { get; set; }
            public WeightValue forecast { get; set; }
            public WeightValue actual { get; set; }
            public WeightValue lastYear { get; set; }

            //public WeightValue actualVsForecast
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = actual.weight - forecast.weight,
            //            value = actual.value - forecast.value
            //        };
            //    }
            //}

            //public WeightValue differentAcVsFore
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = forecast.weight == 0 ? 0 : ((actual.weight - forecast.weight) / forecast.weight) * 100,
            //            value = forecast.value == 0 ? 0 : ((actual.value - forecast.value) / forecast.value) * 100
            //        };
            //    }
            //}

            //public WeightValue actualVsShipmentPlan
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = actual.weight - shipmentPlan.weight,
            //            value = actual.value - shipmentPlan.value
            //        };
            //    }
            //}
            //public WeightValue differentAcVsShipment
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = shipmentPlan.weight == 0 ? 0 : ((actual.weight - shipmentPlan.weight) / shipmentPlan.weight) * 100,
            //            value = shipmentPlan.value == 0 ? 0 : ((actual.value - shipmentPlan.value) / shipmentPlan.value) * 100
            //        };
            //    }
            //}

            //public WeightValue actualVsLastYear
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = actual.weight - lastYear.weight,
            //            value = actual.value - lastYear.value
            //        };
            //    }
            //}
            //public WeightValue differentAcVsLastYear
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = lastYear.weight == 0 ? 0 : ((actual.weight - lastYear.weight) / lastYear.weight) * 100,
            //            value = lastYear.value == 0 ? 0 : ((actual.value - lastYear.value) / lastYear.value) * 100
            //        };
            //    }
            //}

            public class YearModel
            {
                public int year;

                public WeightValue shipmentPlan { get; set; }
                public WeightValue forecast { get; set; }
                public WeightValue actual { get; set; }
            }

            public class WeightValue
            {
                public decimal weight { get; set; }
                public int amount { get; set; }
                public decimal value { get; set; }
            }

        }
    }
}
