using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENShipmentPlanDeliveryType
    {
        [DisplayAttribute(Name = "Lot", Order = 1)]
        LOT = 'L',

        [DisplayAttribute(Name = "Compile", Order = 2)]
        COMPILE = 'C'
    }
}
