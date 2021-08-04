using KKFCoreEngine.Constant;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;

namespace InterSaleTest
{
    [TestClass]
    public class TestLog
    {
        public int id = 0;
        [TestMethod]
        public void TestLogFile01()
        {
            string rootName = "D:/logs/{MachineName}/{Date}/";
            string fileName = "{ServiceName}.{Date}.log";
            KKFCoreEngine.KKFLogger.LoggerManager.InitInstant(rootName, fileName);
            for (int i = 0; i < 100; i++)
            {
                /*var x = File.Open("D:/logs/test.txt", FileMode.Append, FileAccess.Write, FileShare.Write);
                var m = "XXXXXX" + i + "\r\n";
                x.Write(Encoding.UTF8.GetBytes(m), 0, m.Length);
                x.Flush();*/
                TestLog test = new TestLog();
                test.id = i;
                Thread t = new Thread(new System.Threading.ThreadStart(test.LogRun));
                t.Start();
                //Thread.Sleep(100);
            }
        }

        public void LogRun()
        {
            var log = KKFCoreEngine.KKFLogger.LoggerManager.GetLogger(string.Format("USER{0:0000}", id), "XXXXX");
            log.LogBegin();
            for (int i = 0; i < 98; i++)
            {
                log.LogInfo("Test = " + i);
            }

            log.LogEnd();
        }


        [TestMethod]
        public void TestLogExceprion01()
        {
            string rootName = "D:/logs/{MachineName}/{Date}/";
            string fileName = "{ServiceName}.{Date}.log";
            KKFCoreEngine.KKFLogger.LoggerManager.InitInstant(rootName, fileName);
            var log = KKFCoreEngine.KKFLogger.LoggerManager.GetLogger("XXXXX2");
            try
            {
                throw new KKFCoreEngine.KKFException.KKFException(log, KKFExceptionCode.V0001, "XPARAM");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }
        [TestMethod]
        public void TestConsole()
        {
            List<string> lis = new List<string>();
            Console.WriteLine(">>>"+string.Join(',', lis));

        }
    }
}
