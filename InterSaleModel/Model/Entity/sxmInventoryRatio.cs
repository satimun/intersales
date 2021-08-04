using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxmInventoryRatio
    {
        public int Year;
        public int Month;
        public int Customer_ID;
        public int Product_ID;
        public int ProductGrade_ID;
        public decimal SalesWeight;
        public decimal SalesCost;
        public decimal QuotedWeight;
        public decimal QuotedCost;
        public decimal ForwardWeight;
        public decimal ForwardCost;
        public decimal AvgPeriodDay;
    }
}
