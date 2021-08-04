using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine.Util
{
    public static class NumberUtil
    {
        public static int? GetID(this int val)
        {
            if (val == 0) return null;
            return val;
        }

        public static int? GetID(this int? val)
        {
            if (val == 0) return null;
            return val;
        }
    }
}
