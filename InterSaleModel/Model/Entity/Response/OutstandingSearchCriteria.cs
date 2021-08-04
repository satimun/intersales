using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class OutstandingSearchCriteria
    {
        public string CUSCOD;
        public string CUSNAME;
        public string ORDERNO;
        public string PINO;
        public DateTime ORDERDT;
        public string PRODCODE;
        public string PRODDESC;
        public string PQGRADECD;
        public int ITEMNO;
        public string TWINE;
        public string TWINETYPE;
        public string BRANCH;
        public string LABEL;

        public string GRADE;
        public decimal TWINE_NO;
        public decimal LINE_NO;
        public string WORD;
        public string PRODUCTTYPECODE;
        public string DESTPORT;
        public string DESTPORTDESC;
        public string DELIVERYTYPE;
        public string FREIGHTCODE;
        public string PAYCODE1;
        public string PAYCODE2;
        public decimal PERCEN_CLOSE;
        public DateTime ADMITDATE;
        public DateTime MAXIMUMADMITDATE;
        public string SALEUNIT;
        public string ISWEIGHT;
        public string CURRENCYCODE;
        public decimal EXCHRATE;
        public DateTime ORGADMITDATE;
        public decimal P_QUANTITY;
        public decimal P_WEIGHT;
        public decimal P_PACK;
        public decimal P_VALUE;
        public decimal P_VOLUME;

        public decimal D_QUANTITY;
        public decimal D_WEIGHT;
        public decimal D_PACK;
        public decimal D_VALUE;
        public decimal D_VOLUME;

        public decimal B_QUANTITY;
        public decimal B_WEIGHT;
        public decimal B_PACK;
        public decimal B_VALUE;
        public decimal B_VOLUME;

        public decimal INV_QUANTITY;
        public decimal INV_WEIGHT;
        public decimal INV_PACK;
        public decimal INV_VALUE;
        public decimal INV_VOLUME;


        public decimal PER_RECV;
        public decimal PER_OUT;
        public decimal PER_PEND;

        public string CUTPRODCODE;
        public string BARCODE;
        public string BRAND;

        //public DateTime ORGADMITDATE;
        public decimal OUTQTY;
        public decimal OUTWEIGHT;
        public decimal OUTPACK;
        public decimal OUTVOLUME;

        public decimal BPL;

        public string CSTAT;
        public string CLOSE_FLAG;

        public string PaymentTerm { get; set; }
        public decimal PayAmount { get; set; }

        public bool UrgentFlag { get; set; }

        public string TWINESIZELB;
        public string EYESIZELB;
        public string EYEAMOUNTLB;
        public string LENGTHLB;
        public string LABEL1;

    }
}
