﻿using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class CustomerSearchRequest : IRequestModel
    {
        public string search { get; set; }
        public List<string> status { get; set; }
    }
}
