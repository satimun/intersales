using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxlAPILog
    {
        public int ID { get; set; }
        public string RefID { get; set; }
        public string Token { get; set; }
        public string APIName { get; set; }
        public string StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public string TechnicalMessage { get; set; }
        public int? Employee_ID { get; set; }
        public string Employee_Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ServerName { get; set; }
        public string Input { get; set; }
        public string Output { get; set; }
        public string Remark1 { get; set; }
        public string Remark2 { get; set; }
        public string Remark3 { get; set; }
    }
}
