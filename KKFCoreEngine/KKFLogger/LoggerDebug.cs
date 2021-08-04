using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine.KKFLogger
{
    public class LoggerDebug : ILogger, IDisposable
    {
        public string RefID
        {
            get { return "DEBUGID"; }
        }

        public void LogInfo(string message, [CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[INFO] " + message, lineNumber);
        }
        public void LogDebug(string message, [CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[DEBUG] " + message, lineNumber);
        }
        public void LogError(string message, [CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[ERROR] " + message, lineNumber);
        }
        public void LogSuccess(string message, [CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[SUCCESS] " + message, lineNumber);
        }
        public void LogWarning(string message, [CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[WARNING] " + message, lineNumber);
        }
        public void LogBegin([CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[BEGIN] -------------------------------------------", lineNumber);
        }
        public void LogEnd([CallerLineNumber]int lineNumber = 0)
        {
            this.LogWrite("[END] -------------------------------------------", lineNumber);
        }

        public void Dispose()
        {
        }

        public void LogWrite(string message, [CallerLineNumber] int lineNumber = 0, string className = "", string methodName = "")
        {
            Debug.WriteLine(lineNumber + " : " + message);
        }
    }
}
