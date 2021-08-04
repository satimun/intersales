using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanOutstandingGet
    {
        public int id { get; set; }
        public string Order_Code { get; set; }
        public string PI_Code { get; set; }
        public int ItemNo { get; set; }
        public string Product_Code { get; set; }
        public string ProductGrade_Code { get; set; }
    }
}
