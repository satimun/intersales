using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class ShipmentPlanDateCircleSearchCustomer
    {
        public dynamic CustomerID { get; set; }
        public dynamic CustomerCode { get; set; }
        public dynamic CustomerDescription { get; set; }
        public dynamic SaleID { get; set; }
        public dynamic SaleCode { get; set; }
        public dynamic SaleDescription { get; set; }
        public int? DateCircleID { get; set; }
        public dynamic DateCircleShippingDay { get; set; }
        public dynamic DateCircleCreateBy { get; set; }
        public DateTime? DateCircleCreateDate { get; set; }
        public dynamic DateCircleModifyBy { get; set; }
        public DateTime? DateCircleModifyDate { get; set; }
        public dynamic Favorite_Flag { get; set; }
    }
}
