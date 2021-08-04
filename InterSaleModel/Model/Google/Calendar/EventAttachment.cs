using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Google.Calendar
{
    public class EventAttachment
    {
        public virtual string FileId { get; set; }
        public virtual string FileUrl { get; set; }
        public virtual string IconLink { get; set; }
        public virtual string MimeType { get; set; }
        public virtual string Title { get; set; }
        public virtual string ETag { get; set; }
    }
}
