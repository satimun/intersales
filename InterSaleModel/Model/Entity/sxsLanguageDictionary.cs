using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity
{
    public class sxsLanguageDictionary
    {
        public int ID { get; set; }
        public int Language_ID { get; set; }
        public int LanguageTemplate_ID { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
