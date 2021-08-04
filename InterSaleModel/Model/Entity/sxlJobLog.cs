using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxlJobLog
    {
        public int ID { get; set; }
        public string JobName { get; set; }
        public string StatusMessage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
