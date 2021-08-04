using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENDefualtStatus
    {
        [DisplayAttribute(Name = "All Status", Order = 0)]
        ALL = 0,

        [DisplayAttribute(Name = "Active", Order = 1)]
        ACTIVE = 'A',

        [DisplayAttribute(Name = "Inactive", Order = 2)]
        INACTIVE = 'I',

        [DisplayAttribute(Name = "Remove", Order = 3)]
        REMOVE = 'C'
    }
}
