using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductColorGroupSearchRes : IResponseModel
    {
        public List<ColorGroup> colorGroups = new List<ColorGroup>();
        public class ColorGroup : SearchResModel
        {
            public INTIdCodeDescriptionModel countryGroup { get; set; }
            public INTIdCodeDescriptionModel productType { get; set; }
            public INTIdCodeDescriptionModel productGrade { get; set; }
            public List<INTIdCodeDescriptionModel> colors { get; set; }
        }
    }
}
