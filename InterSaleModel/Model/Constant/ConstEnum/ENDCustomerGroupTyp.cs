using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENDCustomerGroupTyp
    {
        [DisplayAttribute(Name = "กลุ่มลูกค้าที่จัด Shipment Plan ร่วมกันได้", Order = 4)]
        VALUE = 'T',
    }
}
