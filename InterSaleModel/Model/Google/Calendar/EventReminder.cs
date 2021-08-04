using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Google.Calendar
{
    public class EventReminder
    {
        public virtual string Method { get; set; }
        public virtual int? Minutes { get; set; }
        public virtual string ETag { get; set; }
    }
}
