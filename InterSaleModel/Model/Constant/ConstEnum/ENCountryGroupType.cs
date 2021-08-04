using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{

        public enum ENCountryGroupType
        {
            [DisplayAttribute(Name = "กลุ่มตารางราคากลาง &  ตารางส่วนลด", Order = 1)]
            ACTIVE = 'P'
        }
   
}
