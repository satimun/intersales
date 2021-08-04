using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProformaInvoiceCompareForecastReportRes : IResponseModel
    {
        public List<pic> profomaInvoices = new List<pic>();
        public class pic
        {
            public string _key;
            public INTIdCodeDescriptionModel zone { get; set; }
            public INTIdCodeDescriptionModel country { get; set; }
            public INTIdCodeDescriptionModel customer { get; set; }
            public string materialGroup;
            public INTIdCodeDescriptionModel productType { get; set; }
            public string diameterGroup;
            public string diameter { get; set; }
            public string diameterLB;

            public string Quality;

            public string MeshSizeLB;
            public string MeshDepthLB;
            public string LengthLB;

            public string KnotTypeLB;

            public string StretchingLB;


            public INTIdCodeDescriptionModel Label;
            public INTIdCodeDescriptionModel color { get; set; }

            public int month;
            public List<YearModel> years;
            public WeightValue forecast { get; set; }
            public WeightValue actual { get; set; }
            public WeightValue lastYear { get; set; }

            //public WeightValue actualVsForecast
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = this.actual.weight - this.forecast.weight,
            //            value = this.actual.value - this.forecast.value
            //        };
            //    }
            //}

            //public WeightValue differentAcVsFore
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = this.forecast.weight == 0 ? 0 : (this.actualVsForecast.weight / this.forecast.weight) *100,
            //            value = this.forecast.value == 0 ? 0 : (this.actualVsForecast.value / this.forecast.value) *100
            //        };
            //    }
            //}

            //public WeightValue actualVsLastYear {
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = this.actual.weight - this.lastYear.weight,
            //            value = this.actual.value - this.lastYear.value
            //        };
            //    }
            //}

            //public WeightValue differentAcVsLastYear
            //{
            //    get
            //    {
            //        return new WeightValue()
            //        {
            //            weight = this.lastYear.weight == 0 ? 0 : (this.actualVsLastYear.weight / this.lastYear.weight) * 100,
            //            value = this.lastYear.value == 0 ? 0 : (this.actualVsLastYear.value / this.lastYear.value) * 100
            //        };
            //    }
            //}

            public class YearModel
            {
                public int year;

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
