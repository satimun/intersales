using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.PublicModel
{

    public class BalanceModel
    {
        public decimal quantity { get; set; }
        public decimal weight { get; set; }
        public decimal bale { get; set; }
        public decimal value { get; set; }
        public decimal volume { get; set; }
    }
}
