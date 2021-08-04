using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Google.Calendar
{
    public class Events
    {
        public virtual string AccessRole { get; set; }
        public virtual IList<EventReminder> DefaultReminders { get; set; }
        public virtual string Description { get; set; }
        public virtual string ETag { get; set; }
        public virtual IList<Event> Items { get; set; }
        public virtual string Kind { get; set; }
        public virtual string NextPageToken { get; set; }
        public virtual string NextSyncToken { get; set; }
        public virtual string Summary { get; set; }
        public virtual string TimeZone { get; set; }
        public virtual string UpdatedRaw { get; set; }
        public virtual DateTime? Updated { get; set; }
    }
}
