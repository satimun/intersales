using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxtShipmentPlanOutstandProcess
    {
        public int Customer_ID;
        public int Currency_ID;
        public int CloseByCI;
        public decimal OutstandQuantity;
        public decimal OutstandWeight;
        public decimal OutstandBale;
        public decimal OutstandVolume;
        public decimal OutstandValue;
        public decimal InvQuantity;
        public decimal InvWeight;
        public decimal InvBale;
        public decimal InvVolume;
        public decimal InvValue;
        public DateTime LastUpdate;
    }
}
