using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KKFCoreEngine
{
    public partial class TestLog : Component
    {
        public TestLog()
        {
            InitializeComponent();
        }

        public TestLog(IContainer container)
        {
            container.Add(this);

            InitializeComponent();
        }
    }
}
