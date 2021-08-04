using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class CustomerSearch : sxsCustomer
    {
        public string Country_Code;
        public string Country_Des;
        public int CountryGroup_ID;
        public string CountryGroup_Code;
        public string CountryGroup_Des;
    }
}
