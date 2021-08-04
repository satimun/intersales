using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class BaseResponseModel : IResponseModel
    {
        public struct STICD
        {
            public int id;
            public string code;
            public string description;
        }
    }
}
