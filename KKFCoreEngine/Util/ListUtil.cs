using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine.Util
{
    public static class ListUtil
    {
        public static bool? ListNull(this List<string> val)
        {
            if (val != null)
            {
                if (val.TrueForAll(x => string.IsNullOrWhiteSpace(x))) return null;
                else return false;
            }
            return null;
        }

        public static bool? ListNull(this List<int> val)
        {
            if (val != null)
            {
                if (val.TrueForAll(x => x == 0)) return null;
                else return false;
            }
            return null;
        }

        public static bool? ListNull(this List<int?> val)
        {
            if (val != null)
            {
                if (val.TrueForAll(x => !x.HasValue)) return null;
                else return false;
            }
            return null;
        }
    }
}
