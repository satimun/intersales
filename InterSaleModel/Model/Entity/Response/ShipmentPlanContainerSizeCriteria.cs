using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanContainerSizeCriteria
    {
        public string code { get; set; }
        public decimal maxSizeKg { get; set; }
        public decimal maxSizeVolume { get; set; }
        public decimal sizeKg { get; set; }
        public decimal minSizeKg { get; set; }
    }
}
