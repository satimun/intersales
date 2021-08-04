using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENShipmentPlanMonthlyStatus
    {
        [DisplayAttribute(Name = "None", Order = 0)]
        NONE = 'N',

        [DisplayAttribute(Name = "Work In Progress", Order = 1)]
        WORK_IN_PROGRESS = 'P',

        [DisplayAttribute(Name = "Auto Processing", Order = 2)]
        AUTO_PROCESSING = 'O',

        [DisplayAttribute(Name = "Pending for Approval", Order = 3)]
        PENDING_FOR_APPROVAL = 'W',

        [DisplayAttribute(Name = "Approved", Order = 4)]
        APPROVED = 'A',

        [DisplayAttribute(Name = "Remove", Order = 5)]
        REMOVE = 'C'

    }
}
