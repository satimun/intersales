﻿using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class PortLoadingSaveReq : IRequestModel
    {
        public List<PortLoadingRes.PortLoading> portLoadings { get; set; }
    }
}
