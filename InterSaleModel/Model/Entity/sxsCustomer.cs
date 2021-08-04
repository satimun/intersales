using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsCustomer
    {
        public int ID { get; set; }
        public int Country_ID { get; set; }
        public int SaleEmployee_ID { get; set; }
        public int AssistantEmployee_ID { get; set; }
        public string Code { get; set; }
        public string CompanyName { get; set; }
        public string CompanyName2 { get; set; }
        public string ContactName { get; set; }
        public string ContactTel { get; set; }
        public string TradeFlag;
        public string FavoriteFlag;
        public string Status { get; set; }
    }
}
