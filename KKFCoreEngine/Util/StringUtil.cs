using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine.Util
{
    public static class StringUtil
    {
        //public static string GetStringValue(string val)
        //{
        //    if(val != "") { return val; }
        //    return null;
        //}

        public static string GetStringValue(this string val)
        {
            if(val != null && val != "") {
                val = val.Trim();
                if (val != "") { return val; }
            }
            return null;
        }

        public static string GetValue(this string val)
        {
            if (val != null && val != "")
            {
                val = val.Trim();
                if (val != "") { return val; }
            }
            return "";
        }

        public static string Join(string sp, List<string> val)
        {
            if (val != null) { return string.Join(sp, val); }
            return null;
        }

        public static string Join(this List<string> val, string sp)
        {
            if (val != null) { return string.Join(sp, val); }
            return null;
        }

        public static string Join(string sp, List<int> val)
        {
            if (val != null) { return string.Join(sp, val); }
            return null;
        }

        public static string Join(this List<int> val, string sp)
        {
            if (val != null) { return string.Join(sp, val); }
            return null;
        }
        public static string Join(this List<int?> val, string sp)
        {
            if (val.TrueForAll(x => !x.HasValue)) return null;
            if (val != null) { return string.Join(sp, val); }
            return null;
        }

    }
}
