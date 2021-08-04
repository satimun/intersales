using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENPriceStdApproveStatus
    {
        [DisplayAttribute(Name = "Active", Order = 1)]
        ACTIVE = 'A',

        [DisplayAttribute(Name = "Inactive", Order = 2)]
        INACTIVE = 'I',

        [DisplayAttribute(Name = "Cancel", Order = 3)]
        CANCEL = 'C'
    }
}
