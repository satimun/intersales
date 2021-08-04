using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Request
{
    public class GetProductRangeRequest
    {
        public int productTypeID { get; set; }
        public int? productGradeID { get; set; }
        
        public int customerID { get; set; }

        public string mintwine { get; set; }
        public string maxtwine { get; set; }

        
        public int? knotID { get; set; }
        public int? stretchingID { get; set; }
        public int? twineseriesID { get; set; }
        public int? selvageWovenTypeID { get; set; }
        public int? colorGroupID { get; set; }
        
        public decimal? minMeshSize { get; set; }
        public decimal? maxMeshSize { get; set; }
        public decimal? minMeshDepth { get; set; }
        public decimal? maxMeshDepth { get; set; }
        public decimal? minLength { get; set; }
        public decimal? maxLength { get; set; }
    }
}
