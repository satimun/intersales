using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ShipmentPlanBookingTransportRes : IResponseModel
    {
        public List<BookingTransport> bookings = new List<BookingTransport>();
        public class BookingTransport
        {
            public int planHID { get; set; }
            public List<INTIdCodeDescriptionModel> customers = new List<INTIdCodeDescriptionModel>();
            public int planWeek { get; set; }
            public string planDate { get; set; }
            public List<string> paymentTerm { get; set; }
            public List<CurrencyModel> payAmount { get; set; }
            public INTIdCodeDescriptionModel portLoading = new INTIdCodeDescriptionModel();
            public ByDateTimeModel portLoadingUpdate = new ByDateTimeModel();
            public List<INTIdCodeDescriptionModel> ports = new List<INTIdCodeDescriptionModel>();
            public decimal stockAmount { get; set; }
            public decimal planAmount { get; set; }
            public decimal productComplete { get; set; }
            public string containerCode { get; set; }
            public ResultModel _result = new ResultModel();
            public string packListCode { get; set; }

        }
    }
}
