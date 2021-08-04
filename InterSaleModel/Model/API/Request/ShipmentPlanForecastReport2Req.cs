using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanForecastReport2Req : IRequestModel
    {
        public string dateFrom;
        public string dateTo;
        public List<string> customerIDs;
        public List<string> zoneAccountIDs;
        public List<string> regionalZoneIDs;
        public List<string> countryIDs;
        public int? saleEmployeeID;
        public int costID;

        public List<string> customerCodes;
        public bool MaterialGroup;
        public bool ProductTypeCode;
        public bool DiameterGroup;
        public bool Diameter;
        public bool DiameterLB;
        public bool MeshSizeLB;
        public bool MeshDepthLB;
        public bool LengthLB;
        public bool KnotTypeCode;
        public bool StretchingCode;
        public bool QualityCode;
        public bool LabelCode;
        public bool ColorCode;

        public bool OtherProduct;
    }
}
