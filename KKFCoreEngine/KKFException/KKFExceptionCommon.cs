using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine.KKFException
{
    public class KKFExceptionCommon : KKFException
    {
        public KKFExceptionCommon(string message) : base(null, message) { }
    }
}
