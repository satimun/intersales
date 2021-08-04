using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENDiscountStdMainType
    {
        [DisplayAttribute(Name = "Range", Order = 1)]
        RANGE = 'R',

        [DisplayAttribute(Name = "Product Code", Order = 2)]
        PRODUCT_CODE = 'C',
    }
}
