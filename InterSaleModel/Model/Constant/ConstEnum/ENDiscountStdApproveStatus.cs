using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENDiscountStdApproveStatus
    {

        [DisplayAttribute(Name = "Active", Order = 4)]
        ACTIVE = 'A',

        [DisplayAttribute(Name = "Inactive", Order = 5)]
        INACTIVE = 'I',

        [DisplayAttribute(Name = "Cancel", Order = 6)]
        CANCEL = 'C',
        
    }
}
