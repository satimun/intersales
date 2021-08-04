using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CommercialInvoiceItemsReportRes : IResponseModel
    {
        public List<cimodel> comercialInvoice = new List<cimodel>();
        public class cimodel
        {
            public string _key;
            public INTIdCodeDescriptionModel zone;
            public INTIdCodeDescriptionModel country;
            public INTIdCodeDescriptionModel customer;
            public CodeDescModel Product;
            public string ProductTypeCode;
            public string QualityCode;
            public string ProductTwineNo;
            public string DiameterLabel;
            public decimal? MeshSizeProd;
            public decimal? MeshDepthProd;
            public decimal? LengthProd;
            public string KnotType;
            public string Stretching;
            public string ColorCode;
            public CodeDescModel Label;
            public string SalesUnitCode;
            public string cino;
            public string OrderNo;
            public CodeDescModel Selvage;

            public List<YearModel> Years;
            public List<QuarterModel> Quarters;
            public List<MonthModel> Months;
            public TotalModel Total;

            public class YearModel : TotalModel
            {
                public int Year;
            }

            public class QuarterModel : TotalModel
            {
                public int Quarter;
            }

            public class MonthModel : TotalModel
            {
                public int Month;
            }

            public class TotalModel
            {
                public int Amount;
                public decimal Weight;
                public decimal Value;
                public decimal ValueTHB;
            }
        }       

    }
}
