using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CommercialInvoiceItemsReportReq : IRequestModel
    {
        public string DateFrom;
        public string DateTo;
        public List<string> CustomerID;
        public List<string> CountryID;
        public List<string> RegionalZoneID;
        public List<string> ZoneID;
        public List<string> ProductTypeCode;
        public List<string> QualityCode;
        public List<string> ProductTwineNo;
        public string DiameterLabel;

        public decimal? MeshSizeProd;
        public decimal? MeshDepthProd;
        public decimal? LengthProd;

        public List<string> KnotType;
        public List<string> Stretching;
        public List<string> Color;
        public List<string> Label;
        public string Mode;
        public bool ShowZone;
        public bool ShowCountry;
        public bool ShowCustomer;
        public bool ShowDes;
        public bool ShowSpec;
        public bool ShowCI;
        public bool ShowOrder;
        public bool ShowSelvage;

        public List<string> customerCodes;
    }
}
