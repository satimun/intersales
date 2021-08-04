using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class LanguageActiveLanguageRequest:IRequestModel
    {
        public List<int> ids = new List<int>();
    }
}
