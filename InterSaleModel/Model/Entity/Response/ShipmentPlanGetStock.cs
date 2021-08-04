using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetStock
    {
        public string PINO;
        public int PIITEMNO;
        public string ORDERNO;
        public string PRODCODE;
        public string PQGRADECD;
        public decimal RECVQTY;
        public decimal WEIGHT;
        public decimal VOLUME;
        public DateTime? PKDT;
        public DateTime? CIDT;
    }
}
