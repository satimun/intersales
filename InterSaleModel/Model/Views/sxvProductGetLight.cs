using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Views
{
    public class sxvProductGetLight
    {
        public dynamic ID { get; set; }
        public dynamic Code { get; set; }
        public dynamic Description { get; set; }
        public dynamic DescriptionSale { get; set; }

        public dynamic ProductType_ID { get; set; }
        public dynamic ProductType_Code { get; set; }
        public dynamic ProductType_Description { get; set; }

        //public dynamic ProductGrade_ID { get; set; }
        //public dynamic ProductGrade_Code { get; set; }
        //public dynamic ProductGrade_Description { get; set; }

        public dynamic ProductRumType_ID { get; set; }
        public dynamic ProductRumType_Code { get; set; }
        public dynamic ProductRumType_Description { get; set; }
    }
}
