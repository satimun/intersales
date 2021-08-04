using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Request
{
    public class GetTwineSizeBetweenRequest
    {
        public int MainID { get; set; }
        public DateTime effectiveDateFrom { get; set; }
        public DateTime effectiveDateTo { get; set; }

        public int? ProductKnot_ID { get; set; }
	    public int? ProductStretching_ID { get; set; }
        public int? UnitType_ID { get; set; }
        public int? ProductSelvageWovenType_ID { get; set; }
        public int? ProductColorGroup_ID { get; set; }

        public decimal MinFilamentSize { get; set; }
        public decimal MinFilamentAmount { get; set; }
        public string MinFilamentWord { get; set; }
        public decimal MaxFilamentSize { get; set; }
        public decimal MaxFilamentAmount { get; set; }
        public string MaxFilamentWord { get; set; }
    }
}
