using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class STKTRNInventoryCriteria
    {
        public string ORDERNO { get; set; }
        public int PIITEMNO { get; set; }
        public decimal qty { get; set; }
        public decimal wei { get; set; }
        public decimal bale { get; set; }
        public string IsInv { get; set; }
        public DateTime? PKDT { get; set; }
        public DateTime? CIDT { get; set; }
    }
}
