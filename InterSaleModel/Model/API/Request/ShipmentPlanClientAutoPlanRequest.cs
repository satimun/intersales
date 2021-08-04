using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanClientAutoPlanRequest : ShipmentPlanSavePlanRequest
    {
        public List<int> limitContainerOfWeeks { get; set; }
        public List<string> containerCodeOfWeek { get; set; }
        public List<decimal> containerVolumeOfWeek { get; set; }
        public List<string> containerCalcTypeOfWeek { get; set; }

        public int option { get; set; }
    }
}
