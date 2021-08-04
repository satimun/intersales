using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class OrderOnhandSearch
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

        public string Currency_Code;

        public decimal Ord_quantity;
        public decimal Ord_weight;
        public decimal Ord_bale;
        public decimal Ord_value;
        public decimal Ord_valueTHB;

        public decimal Del_quantity;
        public decimal Del_weight;
        public decimal Del_bale;
        public decimal Del_value;
        public decimal Del_valueTHB;

        public decimal Inv_quantity;
        public decimal Inv_weight;
        public decimal Inv_bale;
        public decimal Inv_value;
        public decimal Inv_valueTHB;

        public decimal Inv_quantity2;
        public decimal Inv_weight2;
        public decimal Inv_bale2;
        public decimal Inv_value2;
        public decimal Inv_valueTHB2;

        public decimal Osd_quantity;
        public decimal Osd_weight;
        public decimal Osd_bale;
        public decimal Osd_value;
        public decimal Osd_valueTHB;

        public decimal Exp_quantity;
        public decimal Exp_weight;
        public decimal Exp_bale;
        public decimal Exp_value;
        public decimal Exp_valueTHB;


    }
}
