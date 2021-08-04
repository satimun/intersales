using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENDiscountStdEffectiveDateStatus
    {

        [DisplayAttribute(Name = "Active", Order = 2)]
        ACTIVE = 'A',

        [DisplayAttribute(Name = "Inactive", Order = 3)]
        INACTIVE = 'I',

        [DisplayAttribute(Name = "Advance", Order = 4)]
        ADVANE = 'V',

        [DisplayAttribute(Name = "Cancel", Order = 5)]
        CANCEL = 'C'
    }
}
