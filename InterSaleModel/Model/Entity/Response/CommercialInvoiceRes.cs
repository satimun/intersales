
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class CommercialInvoiceRes
    {
        public int Year;
        public int Month;
        public string CustomerCode;

        public decimal WeightKG;
        public int AmountPC;
        public decimal Value;
        public decimal ValueTHB;

        public string ProductCode;
        public string ProductDes;

        public string OrderNo;
        public string CINO;

        public string ProductTypeCode;
        public string QualityCode;
        public string ProductTwineNo;
        public string DiameterLabel;

        public decimal? MeshSizeProd;
        public decimal? MeshDepthProd;
        public decimal? LengthProd;

        public string KnotTypeCode;
        public string StretchingCode;
        public string LabelCode;
        public string ColorCode;
        public string SelvageCode;
        public string SelvageDes;
        public string SalesUnitCode;
    }
}
