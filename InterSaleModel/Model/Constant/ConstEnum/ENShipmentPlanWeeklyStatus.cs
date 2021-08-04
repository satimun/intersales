using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENShipmentPlanWeeklyStatus
    {
        [DisplayAttribute(Name = "None", Order = 0)]
        NONE = 'N',

        [DisplayAttribute(Name = "Work In Progress", Order = 1)]
        WORK_IN_PROGRESS = 'P',

        [DisplayAttribute(Name = "Done", Order = 2)]
        DONE = 'D'
    }
}
