using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Google.Calendar
{
    public class EventDateTime
    {
        public virtual string Date { get; set; }
        public virtual string DateTimeRaw { get; set; }
        public virtual DateTime? DateTime { get; set; }
        public virtual string TimeZone { get; set; }
        public virtual string ETag { get; set; }
    }
}
