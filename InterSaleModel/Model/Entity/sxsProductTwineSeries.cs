using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsProductTwineSeries
    {
        public int ID { get; set; }
        public int ProductType_ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public decimal AmountUnitPerPackage { get; set; }
        public int UnitType_ID { get; set; }
        public decimal AmountPackage { get; set; }
        public int PackageType_ID { get; set; }
        public int Revision { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
