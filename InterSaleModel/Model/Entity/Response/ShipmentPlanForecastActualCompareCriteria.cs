using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanForecastActualCompareCriteria
    {
        public int PickMonth { get; set; }
        public int PickYear { get; set; }

        public string ZoneCode { get; set; }
        public string ZoneDescription { get; set; }
        public string CountryCode { get; set; }
        public string CountryDescription { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerDescription { get; set; }

        public decimal ActualWeight { get; set; }
        public decimal ActualValue { get; set; }
        public decimal ActualBaseWeight { get; set; }
        public decimal ActualBaseValue { get; set; }
        public decimal ForecastWeight { get; set; }
        public decimal ForecastValue { get; set; }
        public decimal ForecastBaseWeight { get; set; }
        public decimal ForecastBaseValue { get; set; }
    }
}
