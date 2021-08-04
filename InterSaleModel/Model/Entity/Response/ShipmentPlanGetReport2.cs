using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetReport2
    {
        public string HID;
        public DateTime Date;
        public int Week;
        public string Container_Code;
        public int? Remark_ID;
        public string Remark_Code;
        public string Remark_Des;
        public int? RemarkGroup_ID;
        public string RemarkGroup_Code;
        public string RemarkGroup_Des;
        public int Customer_ID;
        public string Customer_Code;
        public string Customer_Des;
        public int Country_ID;
        public string Country_Code;
        public string Country_Des;
        public int ZoneAccount_ID;
        public string ZoneAccount_Code;
        public string ZoneAccount_Des;
        public int RegionalZone_ID;
        public string RegionalZone_Code;
        public string RegionalZone_Des;
        public decimal Quatity;
        public decimal Weight;
        public decimal Bale;
        public decimal Volume;
        public decimal Value;
        public decimal ValueTHB;
        public decimal CPB;
        public string PI_Code;
        public string CI_Code;
        public string PaymentTerm;
        public string Currency_Code;
        public DateTime AdmitDate;
        public string Port_Code;
        public string Port_Des;
    }
}
