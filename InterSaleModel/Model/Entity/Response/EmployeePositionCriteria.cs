using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class EmployeePositionCriteria : sxsEmployee
    {
        public int PositionID { get; set; }
        public string PositionCode { get; set; }
        public string PositionDescription { get; set; }
    }
}
