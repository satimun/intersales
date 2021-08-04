using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ShipmentPlanMarkBookingTransportReq : IRequestModel
    {
        public List<Response.ShipmentPlanBookingTransportRes.BookingTransport> bookings { get; set; }
    }
}
