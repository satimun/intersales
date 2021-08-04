using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request.PublicRequest
{
    public class SearchRequest : IRequestModel
    {
        public int id { get; set; }
        public List<string> ids { get; set; }
        public List<string> codes { get; set; }
        public List<string> groupTypes { get; set; }
        public string search { get; set; }
        public List<string> status { get; set; }

        public List<string> ids1 { get; set; }
        public List<string> ids2 { get; set; }
        public List<string> ids3 { get; set; }
        public List<string> ids4 { get; set; }
        public List<string> ids5 { get; set; }
        public List<string> ids6 { get; set; }
        public List<string> ids7 { get; set; }
        public List<string> ids8 { get; set; }
        public List<string> ids9 { get; set; }
        public List<string> ids10 { get; set; }
    }
}
