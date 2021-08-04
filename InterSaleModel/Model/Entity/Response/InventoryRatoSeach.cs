using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class InventoryRatoSeach
    {
        public int Zone_ID;
        public string Zone_Code;
        public string Zone_Des;


        public int Country_ID;
        public string Country_Code;
        public string Country_Des;

        public int Customer_ID;
        public string Customer_Code;

        public string Customer_Des;


        public int ProductType_ID;
        public string ProductType_Code;
        public string ProductType_Des;

        public string Diameter;


        public int Color_ID;

        public string Color_Code;

        public string Color_Des;


        public decimal SalesCost;

        public decimal SalesWeight;


        public decimal QuotedCost;

        public decimal QuotedWeight;


        public decimal ForwardCost;

        public decimal ForwardWeight;


        public decimal SalesCost_Last;

        public decimal SalesWeight_Last;


        public decimal QuotedCost_Last;

        public decimal QuotedWeight_Last;


        public decimal ForwardCost_Last;

        public decimal ForwardWeight_Last;

        public int Day;
        public int Day_Last;
    }
}
