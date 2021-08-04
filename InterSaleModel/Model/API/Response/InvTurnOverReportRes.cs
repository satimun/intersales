using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class InvTurnOverReportRes : IResponseModel
    {
        public List<InventoryTurnOver> invTurnOvers = new List<InventoryTurnOver>();
        public class InventoryTurnOver
        {
            public INTIdCodeDescriptionModel zone { get; set; }
            public INTIdCodeDescriptionModel country { get; set; }
            public INTIdCodeDescriptionModel customer { get; set; }
            public INTIdCodeDescriptionModel productType { get; set; }
            public string diameter { get; set; }
            public INTIdCodeDescriptionModel color { get; set; }

            public decimal salesCost { get; set; }
            public decimal salesWeight { get; set; }

            public decimal quotedWeight { get; set; }
            public decimal quotedCost { get; set; }

            public decimal forwardWeight { get; set; }
            public decimal forwardCost { get; set; }

            public int day { get; set; }

            public decimal salesCostLast { get; set; }
            public decimal salesWeightLast { get; set; }

            public decimal quotedWeightLast { get; set; }
            public decimal quotedCostLast { get; set; }

            public decimal forwardWeightLast { get; set; }
            public decimal forwardCostLast { get; set; }

            public int dayLast { get; set; }

            public decimal avgPeriodDayKPI { get; set; }

            
            /// <summary>(quotedCost + forwardCost) / 2</summary>
            public decimal invAvg { get { return Math.Round((this.quotedCost + this.forwardCost) / 2, 2); }}

            /// <summary>salesCost / InvAvg</summary>
            public decimal invTurnoverRatio { get { return this.invAvg == 0 ? 0 : Math.Round(this.salesCost / this.invAvg, 2); } }

            /// <summary>day / invTurnoverRatio</summary>
            public decimal avgPeriodDay { get { return this.invTurnoverRatio == 0 ? 0 : Math.Round(this.day / this.invTurnoverRatio,2); } }

            /// <summary>(quotedCostLast + forwardCostLast) / 2</summary>
            public decimal invAvgLast { get { return Math.Round((this.quotedCostLast + this.forwardCostLast) / 2,2); } }

            /// <summary>salesCost / InvAvg</summary>
            public decimal invTurnoverRatioLast { get { return this.invAvgLast == 0 ? 0 : Math.Round(this.salesCostLast / this.invAvgLast,2); } }

            /// <summary>dayLast / invTurnoverRatioLast</summary>
            public decimal? avgPeriodDayLastYear { get { return this.invTurnoverRatioLast == 0 ? 0 : Math.Round(this.dayLast / this.invTurnoverRatioLast,2); } }
            
        }
    }
}
