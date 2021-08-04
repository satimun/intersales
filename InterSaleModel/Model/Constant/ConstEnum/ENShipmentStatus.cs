using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace InterSaleModel.Model.Constant.ConstEnum
{
    public enum ENShipmentStatus
    {
        [DisplayAttribute(Name = "All Status", GroupName = "3", Order = 0)]
        ALL = 0,

        [DisplayAttribute(Name = "Work In Progress", GroupName = "1", Order = 1)]
        WORK_IN_PROGRESS = 'P',

        [DisplayAttribute(Name = "Pending for Approval by RG.MNG", GroupName = "2", Order = 2)]
        SEND_TO_APPROVE = 'S',

        [DisplayAttribute(Name = "Pending for Approval by MNG", GroupName = "3", Order = 3)]
        PENDING_FOR_APPROVAL = 'W',

        [DisplayAttribute(Name = "Approved", GroupName = "3", Order = 4)]
        APPROVED = 'A',

        [DisplayAttribute(Name = "Not Approved", GroupName = "3", Order = 5)]
        NOT_APPROVED = 'N'
    }
}
