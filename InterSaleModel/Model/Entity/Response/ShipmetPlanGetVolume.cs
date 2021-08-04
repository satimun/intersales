using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmetPlanGetVolume
    {
        public string CUSCOD { get; set; }
        public string PRODCODE { get; set; }
        public string PQGRADECD { get; set; }
        public string FLAG { get; set; }
        public decimal VOLUME { get; set; }
        public decimal? WIDTH { get; set; }
        public decimal? LENGTH { get; set; }
        public decimal? HIGH { get; set; }
        public decimal FOUND_VOLUME { get; set; }
        public string REMARK { get; set; }
        public decimal PCPERBALE { get; set; }
        public decimal WEIPERBALE { get; set; }
    }
}
