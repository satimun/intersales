using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsEmployee
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Password { get; set; }
        public string SoftPassword { get; set; }
        public string Name { get; set; }
        public int Position_ID { get; set; }
        public string Status { get; set; }
    }
}
