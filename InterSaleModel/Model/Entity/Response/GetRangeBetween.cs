using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetRangeBetween
    {
        public dynamic ID { get; set; }
        public dynamic MinProductTwineSizeCode { get; set; }

        public dynamic MinFilamentSize { get; set; }
        public dynamic MinFilamentAmount { get; set; }
        public dynamic MinFilamentWord { get; set; }

        public dynamic MaxProductTwineSizeCode { get; set; }

        public dynamic MaxFilamentSize { get; set; }
        public dynamic MaxFilamentAmount { get; set; }
        public dynamic MaxFilamentWord { get; set; }

        public dynamic MinEyeSizeCM { get; set; }
        public dynamic MaxEyeSizeCM { get; set; }
        public dynamic MinEyeAmountMD { get; set; }
        public dynamic MaxEyeAmountMD { get; set; }
        public dynamic MinLengthM { get; set; }
        public dynamic MaxLengthM { get; set; }
    }
}
