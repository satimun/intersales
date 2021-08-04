using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Request
{
    public class GetRangeBetweenRequest
    {
        public int MainID { get; set; }
        public int RangDID { get; set; }

        public DateTime effectiveDateFrom { get; set; }
        public DateTime effectiveDateTo { get; set; }

        public int? ProductKnot_ID { get; set; }
        public int? ProductStretching_ID { get; set; }
        public int? UnitType_ID { get; set; }
        public int? ProductSelvageWovenType_ID { get; set; }
        public int? ProductColorGroup_ID { get; set; }

        //public string MinProductTwineSizeCode { get; set; }
        //public string MaxProductTwineSizeCode { get; set; }

        public decimal MinFilamentSize { get; set; }
        public decimal MinFilamentAmount { get; set; }
        public string MinFilamentWord { get; set; }
        public decimal MaxFilamentSize { get; set; }
        public decimal MaxFilamentAmount { get; set; }
        public string MaxFilamentWord { get; set; }

        public decimal? MinMeshSize { get; set; }
        public decimal? MaxMeshSize { get; set; }
        public decimal? MinMeshDepth { get; set; }
        public decimal? MaxMeshDepth { get; set; }
        public decimal? MinLength { get; set; }
        public decimal? MaxLength { get; set; }
    }
}
