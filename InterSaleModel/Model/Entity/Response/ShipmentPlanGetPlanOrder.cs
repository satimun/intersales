using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanGetPlanOrder
    {
        public string Order_Code;
        public string Product_Code;
        public string ProductGrade_Code;
        public string PI_Code;
        public int ItemNo;
        public decimal Quatity;
        public DateTime PlanDate;
        //public decimal Weight;
        //public decimal Bale;
        //public decimal Volume;
    }
}
