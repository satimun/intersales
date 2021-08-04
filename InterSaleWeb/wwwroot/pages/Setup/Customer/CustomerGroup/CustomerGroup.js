


app.controller("CustomerGroupController", function ($rootScope, $scope, $location, $timeout, oauth, common) {
    $rootScope.backUrl = $location.url();
    oauth.GetToken();
    //autocomplete
    //$scope.CustomerList = [
    //    { id: 1, code: 'A', description: "AA", view: 'A : AA' }
    //    , { id: 2, code: 'B', description: "BB", view: 'B : BB' }
    //];
    //$scope.customerCode = 'B';
    //$scope.SetCustomerID = function () {
    //    console.log($scope.customerCode);
    //}

    //CreateGrid (mSelect = undefined, expandable = false, header = null, menuCol = true, menuMain = true, footer = false)

    $scope.tabChange = function () {
        $timeout(function () {
            $rootScope.GroupController_RefeshGrid();
            $rootScope.GroupheadController_RefeshGrid();
            $rootScope.GroupdetailController_RefeshGrid();
            $rootScope.RefasSecl();
        }, 5);
        
        
    };

});

app.controller("GroupController", function ($rootScope, $scope, $location, oauth, common, $timeout, uiGridConstants, $timeout) {

    var CheckEdit = false; 
    $scope.chkSel2 = false;
    $scope.chkDis = false;
    
    $scope.CustoGroupID = 0;

    KSSClient.API.Constant.CustomerGroupType({
        data: {},
        callback: function (res) {
            //console.log(res);
            res.data.customerGroupType.forEach(function (row, index) {
                row.view = common.GetCodeDescription(row);
            });
            $rootScope.CustomerList = res.data.customerGroupType;
        }
    });


    var SetClass = function (grid, row, col) {
        var cellClass = '';
        var tmp = col.name.split('.');
        var obj = angular.copy(row.entity);
        for (var i = 0; i < tmp.length; i++) {
            if (i == tmp.length - 1) {
                if (obj) {
                    if (obj[tmp[i] + 'org'] && obj[tmp[i] + 'org'] != obj[tmp[i]]) {
                        cellClass = 'bg-warning ';
                    }
                    if (obj[tmp[i] + 'err'] && obj[tmp[i] + 'err'] === "Y") {
                       // console.log(obj[tmp[i] + 'err']);
                        cellClass = 'bg-danger ';
                    }
                   
                }
            } else {
                obj = obj[tmp[i]];
            }
        }
        
        return cellClass;
    }


    $scope.gridOpt = common.CreateGrid(true, true, null, true, true, true, true, true);
    //$scope.gridOpt = common.CreateGrid2({ footer: true });
    //console.log($scope.gridOpt);
    //AddColumn (name, title, langCode = '', focus = false, edit = false, width = '', cellFilter = '', type = [], setclass = '', category = '', sort = true, filter = true, hiding = true, pinning = '')
    $scope.gridOpt.columnDefs.push(common.AddColumn('code', 'Code', '', true, true, { min: 30 }, '', { type: 'text' }, SetClass, '', true, true, true, true, true, false, '[A-Z][0-9][0-9]'));
    $scope.gridOpt.columnDefs.push(common.AddColumn('description', 'Description', '', true, true, { min: 50 }, '', { type: 'text' }, SetClass, '', true, true, true, true, true, false, '[En/Th]'));
    $scope.gridOpt.columnDefs.push(common.AddColumn('groupType', 'Group Type', '', false, false, { min: 50 }));
    $scope.gridOpt.columnDefs.push(common.AddColumn('status', 'Status', '', false, false, { min: 50 }));
    $scope.gridOpt.columnDefs.push(common.AddColumn('modify.by', 'Last Update', '', false, false, { min: 50 }));

    $scope.cumulative = function (grid, myRow, myCol) {
        
        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
        }
        return false
    };

    $scope.SelectAll = function () {

        if ($scope.chkAll) {
            $scope.gridApi.selection.selectAllRows();
        }
        else {
            $scope.gridApi.selection.clearSelectedRows();
        }
            $scope.ChkChange();
        
    };

    var strcheck = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    $scope.ChkChange = function ()
    {
        CheckEdit = false;
        $scope.chkDis = false;
        $scope.gridOpt.data.forEach(function (row) {
            if ((row.id == 0) || (row.codeorg != row.code) || (row.descriptionorg != row.description)) {

                var Svali1 = new RegExp("^[A-Z][0-9]{2}$","g");
                if (Svali1.test(row.code))
                {
                    row.codeerr = "N";
                } else
                {
                    row.codeerr = "Y";
                    $scope.chkDis = true;
                }
                if (row.description === "")
                {
                    row.descriptionerr = "Y";
                    $scope.chkDis = true;
                }else {
                    row.descriptionerr = "N";
                }
                var iCheck = 0;
                $scope.gridOpt.data.forEach(function (row2) {  //// check ซ้ำ
                    if (row.code === row2.code)
                    {
                        iCheck++;
                    }
                });
                if (iCheck > 1)  /// ซ้ำ
                {
                    row.codeerr = "Y";
                    $scope.chkDis = true;
                };

                CheckEdit = true;
                $scope.chkSel = false;
            }
        });
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        if (CheckEdit) {
           
            $scope.chkSel = false;
            $scope.chkSel2 = true;
        } else {
            if ($scope.gridApi.selection.getSelectedRows().length != 0) {
                console.log("NO OK")
                $scope.chkSel = true;
                $scope.chkSel2 = false;
            }
            else {
               
                $scope.chkSel = false;
                $scope.chkSel2 = false;
            }
        }
    };


    $rootScope.GroupController_RefeshGrid = function () {
        //console.log('GroupController_RefeshGrid');
        //$scope.gridApi.grid.refresh();
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    }

    $scope.Fillterdata = function () {
        $scope.gridApi.grid.refresh();
    };


    $scope.DateFilter = function (renderableRows) {

        var SctSch = new RegExp($scope.txtS);
         

        renderableRows.forEach(function (row) {
            var match = false;
            if (SctSch.test(row.entity.code) || SctSch.test(row.entity.description)) {
                match = true;
            } 
            if (!match) { row.visible = false; }
        });
        return renderableRows;
    };

    $scope.keyupper = function () {

        $scope.gridOpt.data.forEach(function (row) {
            row.code = row.code.toUpperCase();
        });
      
    };
    
    $scope.gridOpt.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
           // console.log(row);
            $scope.ChkChange();
        });

        //gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
        //    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
        //});
        $scope.gridApi.grid.registerRowsProcessor($scope.DateFilter, 200);

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {

            $scope.ChkChange();
        });
        
        //gridApi.val



      //  console.log("GroupController");
    };



    $scope.AddRow = function () {
        var obj = {};
        obj['id'] = 0;
        obj['code'] = $scope.code;
        obj['groupType'] = $scope.customerCode;
        obj['status'] = "Active";
        obj['isInsert'] = true;
        obj['enableEdit'] = true;
        $scope.gridOpt.data.push(obj);

        $timeout(function () {
            $scope.gridApi.cellNav.scrollToFocus(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 1]
                , $scope.gridApi.grid.options.columnDefs[1]);
            $scope.gridApi.core.scrollTo(
                $scope.gridApi.grid.options.data[$scope.gridApi.grid.options.data.length - 2]
                , $scope.gridApi.grid.options.columnDefs[1]);
        }, 5);

        $scope.gridApi.grid.refresh();
        $scope.ChkChange();

    };

    $scope.RemoveRow = function (grid, row) {
        //console.log($scope.gridOpt.data);
        var iDel = $scope.gridApi.grid.options.data.indexOf(row.entity);
        $scope.gridApi.grid.options.data.splice(iDel, 1);
        $scope.gridApi.grid.refresh();
        $scope.ChkChange();
    };
        
    $scope.SetCustomerID = function (code) {
        $scope.CustoGroupID = code;
        $scope.getDataMain();
    };

    $scope.getDataMain = function () {

        KSSClient.API.CustomerGroup.Search({
            data: { groupType: $scope.CustoGroupID },//countryGroupType: $scope.countryGroupCode 
            callback: function (res) {
                console.log(res);

                res.data.customerGroups.forEach(function (row) {

                    //เก็บค่า เก่าเอาไว้เทียบ
                    row.codeorg = row.code;
                    row.descriptionorg = row.description;
                    row.validateorg = "";

                    if (row.status === 'I')
                    {
                        row.status = "Inactive";
                    } else if (row.status === 'A') {
                        row.status = "Active";
                    } else if (row.status === 'C') {
                        row.status = "Remove";
                    }
                    row.enableEdit = true;
                    if (row.modify.by != null)
                    {
                        row.modify.by = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.modify.datetime)) + ' : ' + row.modify.by;
                    }

                    for (var i = 0; i < $rootScope.CustomerList.length; i++) {
                        if ($rootScope.CustomerList[i].id === row.groupType) {
                            row.groupType = $rootScope.CustomerList[i].view;
                            break;
                        }
                    }
                });

                $scope.gridOpt.data = res.data.customerGroups;
                $scope.gridApi.grid.refresh();
                $scope.gridApi.selection.clearSelectedRows();

                $scope.ChkChange();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
        

    };

    $scope.ClickAct2 = function (iCheck)
    {
        if (iCheck == 0)
        {
            
            $scope.selx = [];
            $scope.gridOpt.data.forEach(function (row) {
                ///// INSERT UPDATE
                if ((row.id == 0) || (row.codeorg != row.code) || (row.descriptionorg != row.description)) {
                    $scope.selx.push(row);
                }

            });

            KSSClient.API.CustomerGroup.saveGroup({
                data: { customerGroups: $scope.selx },
                callback: function (res) {
                    $scope.getDataMain();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });  
            $scope.ChkChange();
        } 

        if (iCheck == 1)
        {
            $scope.getDataMain();
            //$scope.ChkChange();
        }
       
    }




    $scope.ClickAct = function (iChek) {

        $scope.txtSel = "";
        $scope.selx = [];
        $scope.selx2 = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            $scope.selx.push(row.id)
            $scope.txtSel += row.code + " : " + row.description + "\n";
        });

        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
          
            $scope.selx2.push({ "customerGroupID": row.id, "customerID": 0 });
            //  $scope.selx2.push(row.customerGroup.id);
        });



        if (iChek == 0)
        {
            KSSClient.API.CustomerGroup.ActiveGroup({
                data: { ids : $scope.selx },//countryGroupType: $scope.countryGroupCode 
                callback: function (res) {
                    $scope.getDataMain();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

        }

        if (iChek == 1) {
            KSSClient.API.CustomerGroup.InactiveGroup({
                data: { ids: $scope.selx },//countryGroupType: $scope.countryGroupCode 
                callback: function (res) {
                    $scope.getDataMain();
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }

        if (iChek == 2) {

            swal({
                title: "Are you sure ?",
                text: "remove customergroup :\n" + $scope.txtSel,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {

                        KSSClient.API.CustomerGroup.CancelCustomerMapping({
                            data: { customerMappings: $scope.selx2 },
                            callback: function (res) {

                            },
                            error: function (res) {
                                common.AlertMessage("Error", res.message);
                            }
                        });

                        KSSClient.API.CustomerGroup.CancelGroup({
                            data: { ids: $scope.selx },//countryGroupType: $scope.countryGroupCode 
                            callback: function (res) {
                                $scope.getDataMain();
                            },
                            error: function (res) {
                                common.AlertMessage("Error", res.message);
                            }
                        });

                       


                    }
                });

           
        }
        //$scope.ChkChange();

    };


});

app.controller("GroupheadController", function ($rootScope, $scope, $location, oauth, common, uiGridConstants) {

    var CheckEdit = false;
    $scope.chkSel2 = false;
    $scope.CustoGroupID = 0;
    $rootScope.H_row_id = 0;

    KSSClient.API.Constant.CustomerGroupType({
        data: {},
        callback: function (res) {
         //   console.log(res);
            res.data.customerGroupType.forEach(function (row, index) {
                row.view = common.GetCodeDescription(row);
            });
            $rootScope.CustomerList = res.data.customerGroupType;
        }
    });
   
    //function (mSelect = undefined, expandable = false, header = null, menuCol = true, menuMain = true, footer = false, checkAll = true, enableInsert = false)
   // $scope.gridOpt2 = common.CreateGrid(false);
    $scope.gridOpt2 = common.CreateGrid(false, false, null, true, true, true, true, false);
    //console.log($scope.gridOpt2);
    //AddColumn (name, title, langCode = '', focus = false, edit = false, width = '', cellFilter = '', type = [], setclass = '', category = '', sort = true, filter = true, hiding = true, pinning = '')
    $scope.gridOpt2.columnDefs.push(common.AddColumn('code', 'Code', '', false, false, { min: 30 }, '', { type: 'text' }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn('description', 'Description', '', false, false, { min: 50 }, ''));
    $scope.gridOpt2.columnDefs.push(common.AddColumn('groupType', 'Group Type', '', false, false, { min: 50 }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn('status', 'Status', '', false, false, { min: 25 }));
    $scope.gridOpt2.columnDefs.push(common.AddColumn('modify.by', 'Last Update', '', false, false, { min: 50 }));

    $rootScope.GroupheadController_RefeshGrid = function () {
        console.log('GroupheadController_RefeshGrid');
        // $scope.gridApi.grid.refresh();
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    }

    $scope.gridOpt2.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {

            if (row.isSelected) {
                $scope.selid = [];
                $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                    $scope.selid.push(row.id);
                    $rootScope.H_row_id = row.id;
                    $rootScope.txtsetHead = row.code + ':' + row.description;
                });

                $rootScope.SeachDetail($scope.selid);
                

                //$scope.ChkChange();
            }       
            else {

            }
           // $scope.ChkChange();
        });

        $scope.cumulative = function (grid, myRow, myCol) {

            if (grid.id == $scope.gridApi.grid.id) {
                if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
            }
            return false
        };

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            $scope.gridApi.selection.selectRow(newRowCol.row.entity);
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {

            if (newValue != oldValue) {

                //console.log("changed");
                rowEntity.State = "changed";

            }
        })

       // console.log("GroupheadController");
    };


    $scope.SetCustomerID = function (code) {
        $scope.CustoGroupID = code;
        $scope.getDataMain();
    };

    $rootScope.RefasSecl = function () {
        $scope.getDataMain();
        $rootScope.SeachDetail(0);
    };


    $scope.getDataMain = function () {

        KSSClient.API.CustomerGroup.Search({
            data: { groupType: $scope.CustoGroupID },//countryGroupType: $scope.countryGroupCode 
            callback: function (res) {
                console.log(res);
                res.data.customerGroups.forEach(function (row) {


                    if (row.status === 'I')
                    {
                        row.status = "Inactive";
                    } else if (row.status === 'A')
                    {
                        row.status = "Active";
                    } else if (row.status === 'C') {
                        row.status = "Remove";
                    }
                    if (row.modify.by != null) {
                        row.modify.by = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(row.modify.datetime)) + ' : ' + row.modify.by;
                    }

                    for (var i = 0; i < $rootScope.CustomerList.length; i++) {
                        if ($rootScope.CustomerList[i].id === row.groupType) {
                            row.groupType = $rootScope.CustomerList[i].view;
                            break;
                        }
                    }

                });



                $scope.gridOpt2.data = res.data.customerGroups;
                $scope.gridApi.grid.refresh();
                $scope.gridApi.selection.clearSelectedRows();

                //$scope.ChkChange();
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });


        $rootScope.ShowList($scope.CustoGroupID);

    };

});

app.controller("GroupdetailController", function ($rootScope, $scope, $location, oauth, common, uiGridConstants, $uibModal) {
  
    $scope.GroupID = 0;
    $scope.selidSE = 0;
    $scope.chkSel3 = false;


    $rootScope.ShowList = function (groupId) {
       
        KSSClient.API.CustomerGroup.ListByType({
            data: { groupType: groupId },
            callback: function (res) {
             //   console.log(groupId);
             //   console.log(res);
                res.data.customerGroups.forEach(function (row, index) {
                    row.view = common.GetCodeDescription(row);
                });
                $scope.groupIDList = res.data.customerGroups;
                //$scope.groupIDList.selection.selectRow(1);
            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
    };


    $rootScope.GroupdetailController_RefeshGrid = function () {
        console.log('GroupdetailController_RefeshGrid');
       // $scope.gridApi.grid.refresh();
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    }


    //$scope.gridOpt3 = common.CreateGrid(true, false, null, true, true, true, true, false);
    $scope.gridOpt3 = common.CreateGrid(true, true, null, true, true, true, true, false);
    //console.log($scope.gridOpt3);
    //AddColumn (name, title, langCode = '', focus = false, edit = false, width = '', cellFilter = '', type = [], setclass = '', category = '', sort = true, filter = true, hiding = true, pinning = '')
    $scope.gridOpt3.columnDefs.push(common.AddColumn('customerGroup.view', 'Customer Group', '', false, false, { min: 30 }, '', { type: 'text' }));
    $scope.gridOpt3.columnDefs.push(common.AddColumn('view', 'Customer', '', false, false, { min: 50 }));
    $scope.gridOpt3.columnDefs.push(common.AddColumn('managerEmployee.view', 'Sales', '', false, false, { min: 50 }));
    $scope.gridOpt3.columnDefs.push(common.AddColumn('create.by', 'Last Update', '', false, false, { min: 50 }));






    $rootScope.GroupheadController_RefeshGrid = function () { 
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    //$scope.gridApi.grid.refresh();
    };

    $scope.SetGroupID = function (code) {
        $scope.GroupID = code;
    };

    $scope.cumulative = function (grid, myRow, myCol) {

        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
        }
        return false
    };


    $scope.gridOpt3.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $scope.ChkChange();
                });

                gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
                 });

                $scope.gridApi.grid.registerRowsProcessor($scope.DateFilter, 200);

                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {

                    if (newValue != oldValue) {

                        console.log("changed");
                        rowEntity.State = "changed";

                    }
                })

                console.log("GroupheadController");
    };

    $scope.Fillterdata2 = function () {
        $scope.gridApi.grid.refresh();
    };


    $scope.DateFilter = function (renderableRows) {

        var SctSch = new RegExp($scope.txtS);

        renderableRows.forEach(function (row) {
            var match = false;
            if (
                ( SctSch.test(row.entity.view) || SctSch.test(row.entity.managerEmployee.view))
                ///cus.customerGroup.id
               )
            {
                match = true;
            }
            if (!match) { row.visible = false; }
        });
        return renderableRows;
    };



    $scope.SelectAll = function () {

        if ($scope.chkAll) {
            $scope.gridApi.selection.selectAllRows();
        }
        else {
            $scope.gridApi.selection.clearSelectedRows();
        }
        $scope.ChkChange();

    };



    $rootScope.SeachDetail = function (selid) {
        $scope.selidSE = selid;
       // console.log($scope.selidSE);
            KSSClient.API.CustomerGroup.SearchCustomer({
                data: { customerGroupIDs: selid },
                callback: function (res) {
                    //console.log(res);

                    
                    $scope.gridOpt3.data = [];
                    //console.log(res.data);
                    res.data.customerGroups.forEach(function (cusGroup) {
                        
                        cusGroup.customers.forEach(function (cus) {

                            if (cusGroup.id != 0)  /// แสดง เฉพาะ  ตัวที่ จัดกลุ่มละ
                            {
                                cus.customerGroup = {};
                                cus.customerGroup.id = cusGroup.id;
                                cus.customerGroup.code = cusGroup.code;
                                cus.customerGroup.description = cusGroup.description;
                                cus.customerGroup.status = cusGroup.status;
                                cus.customerGroup.view = common.GetCodeDescription(cus.customerGroup);
                                //  cus.customerGroup.
                                //cusGroup.view = common.GetCodeDescription(cusGroup);
                                if (cus.create.by != null) {
                                    cus.create.by = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(cus.create.datetime)) + ' : ' + cus.create.by;
                                }

                                cus.view = common.GetCodeDescription(cus);
                                cus.managerEmployee.view = common.GetCodeDescription(cus.managerEmployee);

                                $scope.gridOpt3.data.push(cus);
                            }
                            
                            
                        })
                    })
                  //  console.log($scope.gridOpt3.data);
                    $scope.gridApi.grid.refresh();
                    $scope.gridApi.selection.clearSelectedRows();

                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        $scope.ChkChange();

    };


    $scope.ClickMove = function (iChek) {

        $scope.selx = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            $scope.selx.push(row.id)
        });

        if (iChek == 0) {

           // console.log($scope.selx);
            KSSClient.API.CustomerGroup.MoveCustomerMapping({
                data: { customerGroupID: $scope.GroupID, customerIDs: $scope.selx },
                callback: function (res) {
                    
                    $rootScope.SeachDetail($scope.selidSE);
                    //console.log(res);
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        }
 
        if (iChek == 1) {
            //console.log($scope.selx);
            //console.log($scope.GroupID);
            //console.log($rootScope.H_row_id);

          

            $scope.selx = [];
          
        
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                console.log(row.id);
                console.log(row.customerGroup.id);
                $scope.selx.push({ "customerGroupID": row.customerGroup.id, "customerID": row.id }); 
              //  $scope.selx2.push(row.customerGroup.id);
            });

            //$scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            //    console.log(row.customerGroup.id);
            //    // $scope.selx.push(row.customerGroup.id)
            //});

            KSSClient.API.CustomerGroup.CancelCustomerMapping({
                data: { customerMappings: $scope.selx },
                callback: function (res) {
                    $rootScope.SeachDetail($scope.selidSE);
                    console.log(res);
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });

        }
    };

    $scope.ChkChange = function () {

        if ($scope.gridApi.selection.getSelectedRows().length != 0) {
           // console.log('OK');
            $scope.chkSel3 = true; 
            }
            else {

            $scope.chkSel3 = false; 
        }
    };


    $scope.MapCustomer = function (parentSelector) {
       
       // console.log($rootScope.H_row_id);

        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalMapCustomer',
            size: 'lg',
            appendTo: parentElem,
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'MapCustomerContent.html'
        });

        modalInstance.result.then(function () {
           // $rootScope.shipmentPlanOrderShippingList_setData();
           // $rootScope.isChange = true;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };


   


});

app.controller("ModalMapCustomer", function ($uibModalInstance, $rootScope, $scope, $location, oauth, common, $timeout, uiGridConstants, $timeout) {

    $rootScope.txtsetHead;

    $scope.txthearder = $rootScope.txtsetHead;

    $rootScope.GroupdetailController_RefeshGrid = function () {
        console.log('GroupdetailController_RefeshGrid');
        // $scope.gridApi.grid.refresh();
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    }

    
    $scope.gridOpt4 = common.CreateGrid(true, true, null, true, true, true, true, false);
   // $scope.gridOpt4.columnDefs.push(common.AddColumn('customerGroup.view', 'Customer Group', '', false, false, { min: 30 }, '', { type: 'text' }));
    $scope.gridOpt4.columnDefs.push(common.AddColumn('view', 'Customer', '', false, false, { min: 50 }, '', { type: 'text' }));
    $scope.gridOpt4.columnDefs.push(common.AddColumn('managerEmployee.view', 'Sales', '', false, false, { min: 50 }));
    $scope.gridOpt4.columnDefs.push(common.AddColumn('create.by', 'Last Update', '', false, false, { min: 50 }));

    $scope.cumulative = function (grid, myRow, myCol) {

        if (grid.id == $scope.gridApi.grid.id) {
            if (myCol.field == "headRow") { if (!myRow.entity.isInsert) { return true; } }
        }
        return false
    };

    $scope.gridOpt4.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          
        });

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            $scope.gridApi.selection.selectRow(newRowCol.row.entity);
        });

        $scope.gridApi.grid.registerRowsProcessor($scope.DateFilter, 200);

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {

            if (newValue != oldValue) {

                console.log("changed");
                rowEntity.State = "changed";

            }
        })

        console.log("GroupheadController");
    };

    $scope.Fillterdata2 = function () {
        $scope.gridApi.grid.refresh();
    };


    $scope.DateFilter = function (renderableRows) {

        var SctSch = new RegExp($scope.txtS2);

        renderableRows.forEach(function (row) {
            var match = false;
            if (
                (SctSch.test(row.entity.customerGroup.view) || SctSch.test(row.entity.view) || SctSch.test(row.entity.managerEmployee.view))
                ///cus.customerGroup.id
            ) {
                match = true;
            }
            if (!match) { row.visible = false; }
        });
        return renderableRows;
    };

    $scope.Fillterdata3 = function () {
        $scope.gridApi.grid.refresh();
    };



    $scope.SelectAll = function () {

        if ($scope.chkAll) {
            $scope.gridApi.selection.selectAllRows();
        }
        else {
            $scope.gridApi.selection.clearSelectedRows();
        }
   

    };



    $rootScope.HelpSeachDetail = function (selid) {
        $scope.selidSE = selid;
        // console.log($scope.selidSE);
        KSSClient.API.CustomerGroup.SearchCustomer({
            data: { customerGroupIDs: selid },
            callback: function (res) {
                //console.log(res);


                $scope.gridOpt4.data = [];
                //console.log(res.data);
                res.data.customerGroups.forEach(function (cusGroup) {

                    cusGroup.customers.forEach(function (cus) {

                        if (cusGroup.id === 0)  /// แสดง เฉพาะ  ตัวที่ จัดกลุ่มละ
                        {
                            cus.customerGroup = {};
                            cus.customerGroup.id = cusGroup.id;
                            cus.customerGroup.code = cusGroup.code;
                            cus.customerGroup.description = cusGroup.description;
                            cus.customerGroup.status = cusGroup.status;
                            cus.customerGroup.view = common.GetCodeDescription(cus.customerGroup);
                            //  cus.customerGroup.
                            //cusGroup.view = common.GetCodeDescription(cusGroup);
                            if (cus.create.by != null) {
                                cus.create.by = KSSClient.Engine.Common.GetDateTimeView(KSSClient.Engine.Common.CreateDateTime(cus.create.datetime)) + ' : ' + cus.create.by;
                            }

                            cus.view = common.GetCodeDescription(cus);
                            cus.managerEmployee.view = common.GetCodeDescription(cus.managerEmployee);

                            $scope.gridOpt4.data.push(cus);
                        }


                    })
                })
                //  console.log($scope.gridOpt3.data);
                $scope.gridApi.grid.refresh();
                $scope.gridApi.selection.clearSelectedRows();

            },
            error: function (res) {
                common.AlertMessage("Error", res.message);
            }
        });
     

    };

    $scope.HelpSeachDetail($rootScope.H_row_id);



    $scope.ok = function () {

        $rootScope.H_row_id;

        $scope.selx = [];
        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
            $scope.selx.push(row.id)
        });

            // console.log($scope.selx);
            KSSClient.API.CustomerGroup.MoveCustomerMapping({
                data: { customerGroupID: $rootScope.H_row_id, customerIDs: $scope.selx },
                callback: function (res) {
                    $rootScope.SeachDetail($rootScope.H_row_id);
                    //console.log(res);
                },
                error: function (res) {
                    common.AlertMessage("Error", res.message);
                }
            });
        
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };



   

  







});



