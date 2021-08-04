using KKFCoreEngine.KKFAttribute;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine.Constant
{
    public enum KKFExceptionCode
    {
        /*********SUCCESS***********/
        [KKFExceptionDescription(TH = "สำเร็จ" , EN = "Success")]
        S0000,
        [KKFExceptionDescription(TH = "ไม่สำเร็จ", EN = "Fail")]
        S0001,
        [KKFExceptionDescription(TH = "Udpate Fail.", EN = "Udpate Fail.")]
        S0002,

        /******VALIDATE*******/
        [KKFExceptionDescription(TH = "{0}")]
        V0000,
        /// <summary>ข้อมูล {0} ไม่ถูกต้อง</summary>
        [KKFExceptionDescription(TH = "ข้อมูล {0} ไม่ถูกต้อง", EN = "{0} data incorrect.")]
        V0001,
        /// <summary>ไม่พบข้อมูล {0}</summary>
        [KKFExceptionDescription(TH = "ไม่พบ {0}", EN = "{0} Not Found.")]
        V0002,



        /**********TECHNICAL*************/
        [KKFExceptionDescription(TH = "ไม่สามารถเชื่อมต่อฐานข้อมูลได้")]
        T0001,
        [KKFExceptionDescription(TH = "ใช้เวลาเชื่อมต่อฐานข้อมูลนานเกินไป (Timeout)")]
        T0002,

        [KKFExceptionDescription(TH = "{0}", EN = "{0}", CN = "{0}")]
        U0000,

        // oauth
        [KKFExceptionDescription(TH = "{0}")]
        O0000,
        
        // for relogin
        [KKFExceptionDescription(TH = "{0}")]
        O1000,
        [KKFExceptionDescription(TH = "Username หรือ Password ในการเข้าระบบผิดพลาด", EN = "Fail")]
        O1001,
        [KKFExceptionDescription(TH = "ไม่พบ Token ในระบบ กรุณา Login ใหม่", EN = "Fail")]
        O1002,

        // for renew
        [KKFExceptionDescription(TH = "{0}")]
        O9000,
        [KKFExceptionDescription(TH = "Token นี้ไม่สามารถใช้งานได้", EN = "Fail")]
        O9001,
        [KKFExceptionDescription(TH = "ยืนยัน Password สำหรับต่ออายุ Token ผิดพลาด", EN = "Fail")]
        O9002,

        // for user
        [KKFExceptionDescription(TH = "{0}")]
        OU000,
        [KKFExceptionDescription(TH = "ไม่พบข้อมูลผู้ใช้ในระบบ")]
        OU001,
        [KKFExceptionDescription(TH = "ผู้ใช้ไม่ได้ถูกเปิดใช้งาน")]
        OU002,
    }
}
