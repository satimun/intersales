using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsDiscountStdRangeD
    {
        public int ID { get; set; }
        public int? DiscountStdRangeH_ID { get; set; }
        public int? ProductTwineSeries_ID { get; set; }
        public decimal? MinMeshSize { get; set; }
        public decimal? MaxMeshSize { get; set; }
        public decimal? MinMeshDepth { get; set; }
        public decimal? MaxMeshDepth { get; set; }
        public decimal? MinLength { get; set; }
        public decimal? MaxLength { get; set; }
        public string TagDescription { get; set; }
        public string SalesDescription { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }

        public int? discountEffectiveDateID { get; set; }

    }
}
