using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanAutoPlanRequest : IRequestModel
    {
        public int planMonth { get; set; }
        public int planYear { get; set; }
        public List<int> customerIDs { get; set; }
        public List<int> limitContainerPerWeeks { get; set; }
        public List<string> containerCodeOfWeek { get; set; }
        public List<decimal> containerVolumeOfWeek { get; set; }

        //public List<decimal> containerWeightOfWeek { get; set; }

        public List<string> containerCalcTypeOfWeek { get; set; }

        public List<containerCofig> containerConfig { get; set; }
        public int option { get; set; }
        public bool merge { get; set; }

        public class containerCofig
        {
            public int week { get; set; }
            public int containerAmount { get; set; }
            public int containerSize { get; set; }
            public int containerVolume { get; set; }
        }

        
    }
}
