using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ProformaInvoiceCopareForecast
    {

        public int Year;
        public int Month;
        public int zoneID { get; set; }
        public string zoneCode { get; set; }
        public string zoneDes { get; set; }

        public int countryID { get; set; }
        public string countryCode { get; set; }
        public string countryDes { get; set; }

        public int customerID { get; set; }
        public string customerCode { get; set; }
        public string customerDes { get; set; }
        public int productTypeID { get; set; }
        public string productTypeCode { get; set; }
        public string productTypeDes { get; set; }
        public string diameter { get; set; }

        public int colorID { get; set; }
        public string colorCode { get; set; }
        public string colorDes { get; set; }

        public decimal forecastWeight { get; set; }
        public decimal forecastValue { get; set; }
        public decimal actualWeight { get; set; }
        public decimal actualValue { get; set; }

        public decimal lastYearWeight { get; set; }
        public decimal lastYearValue { get; set; }

        public string Quality_Code;
        public string diameterLB;

        public string MeshSizeLB;
        public string MeshDepthLB;
        public string LengthLB;

        public int? KnotTypeID;
        public string KnotTypeDes;

        public int? StretchingID;
        public string StretchingDes;

        public int? LabelID;
        public string LabelCode;
        public string LabelDes;

    }
}
