using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ProformaInvoiceGetActual
    {
        public string piCode { get; set; }
        public DateTime piDate { get; set; }
        public string customerCode { get; set; }
        public decimal weightkg { get; set; }
        public int amountpc { get; set; }
        public decimal value { get; set; }
    }
}
