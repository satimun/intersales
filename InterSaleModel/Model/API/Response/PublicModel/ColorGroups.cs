using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response.PublicModel
{
    public class ColorGroups
    {
        public int? id { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public List<INTIdCodeDescriptionModel> colors = new List<INTIdCodeDescriptionModel>();
    }
}
