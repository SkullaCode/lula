const SERVER_ADDRESS = "http://localhost:8000";

Service.Modification.AddMethod("RedHeading",function(component, actionBtn){
    let header = jQuery(component).find("h1");
    header.css("color","red");
});
Service.Modification.Capitalize = function(component, actionBtn){
    let header = jQuery(component).find("h1");
    header.css("font-weight","bolder");
    header.css("font-variant-caps","all-petite-caps");
};
Service.Modification.CustomCompleteHandler = function(component, actionBtn, result){
    let message = (result.Status === "success") ? "successfully" : "in error";
    alert(`Complete handler was fired ${message}`);
};
Service.Modification.ShowHideAlert = function(component, actionBtn, event){
    alert("The small target panel will be reloaded!");
};

Service.Data.Default = function(component, actionBtn){
    return new Promise(function(resolve){
        const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        Service.Bind(component,{ data });
        resolve(true);
    });


};
Service.Data.AddMethod("form-data",function(component,actionBtn){
    return new Promise(function(resolve){
        const data = [];
        data[12] = {
            NameLabel: "Person Name",
            Name: "John",
            AgeLabel: "Person Age",
            Age: 30,
            GenderLabel: "Person Gender",
            Gender: 1,
            OptionLabel: "User Options",
            OptionData:2,
            ModuleData:1,
            ControllerData:3
        };
        const SuppliedDataList = [
            {
                Text: "Supplied One",
                Value: 1
            },
            {
                Text: "Supplied Two",
                Value: 2
            }
        ]
        Service.BindList(component.find("select[name=suppliedData]"),SuppliedDataList,actionBtn);
        const id = actionBtn.data(Service.SYSTEM_ID);
        Service.Bind(component,data[id],actionBtn);
        return resolve(true);
    });
});
Service.Data.AddMethod("table-data",function(component,actionBtn){
    return new Promise(function(resolve){
        const data = [
            { ID: 1, FirstName: "John", LastName: "Doe", Age: 30 },
            { ID: 2, FirstName: "Ricky", LastName: "Smith", Age: 24 },
            { ID: 3, FirstName: "Dean", LastName: "Williams", Age: 45 },
            { ID: 4, FirstName: "Troy", LastName: "Jackson", Age: 26 },
            { ID: 5, FirstName: "David", LastName: "Keane", Age: 63 },
            { ID: 6, FirstName: "Mark", LastName: "Thomas", Age: 53 },
            { ID: 7, FirstName: "Travis", LastName: "Greene", Age: 48 },
        ];
        Service.Bind(component,data);
        return resolve(true);
    });
});
Service.Data.AddMethod("datatable-data",function(component,actionBtn){
    return new Promise(function(resolve){
        const data = [
            { ID: 1, Name: "John Doe", Age: 30 },
            { ID: 2, Name: "Ricky Smith", Age: 24 },
            { ID: 3, Name: "Dean Williams", Age: 45 },
            { ID: 4, Name: "Troy Jackson", Age: 26 },
            { ID: 5, Name: "David Keane", Age: 63 },
            { ID: 6, Name: "Mark Thomas", Age: 53 },
            { ID: 7, Name: "Travis Greene", Age: 48 },
        ];
        const listingHeaders = [
            { title: "#", data: "ID" },
            { title: "User Name", data: "Name" },
            { title: "Age",  data: "Age"}
        ];

        component.DataTable({
            data: data,
            columns: listingHeaders
        });
        return resolve(true);
    });
});
Service.Data.AddMethod("modal-data",function(component,actionBtn){
    return new Promise(function(resolve){
        const data = [];
        data[12] = {
            NameLabel: "Person Name",
            Name: "John",
            AgeLabel: "Person Age",
            Age: 30,
            GenderLabel: "Person Gender",
            Gender: 1,
            OptionLabel: "User Options",
            OptionData:2,
            ModuleData:1,
            ControllerData:3
        };
        const id = actionBtn.data(Service.SYSTEM_ID);
        if(id !== 12){
            return resolve(false);
        }
        component.find(".modal-body").attr("id","formSubmit");
        if(typeof id !== "undefined"){
            data[12].ModalTitle = "New Modal";

            Service.FindElement("form").then((form) => {
                Service.Bind(form,data[id],actionBtn);
                Service.Bind(component,data[id],actionBtn);
                component.find("#modal-form").append(form);
            });
        }

        Service.FindElement("file-select").then((image) => {
            image.find("img").css("max-width","250px");
            image.find("input[type=file]").prop("multiple",true);
            component.find("#modal-image").append(image);
        });
        component.find("button[data-target=modal-form]").each(function(){
            let elem = jQuery(this);
            if(elem.data("href")){
                elem.data("href",`${SERVER_ADDRESS}${elem.data("href")}`);
            }
        });
        return resolve(true);
    });
});
Service.Data.AddMethod("inline-editor-data",function(component,actionBtn){
    return new Promise(function(resolve){
        const data = [
            { ID: 1, Name: "John Doe", Age: 30, Gender: 1, GenderDisplay : "Male" },
            { ID: 2, Name: "Ricky Smith", Age: 24, Gender: 1, GenderDisplay : "Male"  },
            { ID: 3, Name: "Deandra Williams", Age: 45, Gender: 2, GenderDisplay : "Female"  },
            { ID: 4, Name: "Troy Jackson", Age: 26, Gender: 1, GenderDisplay : "Male"  },
            { ID: 5, Name: "David Keane", Age: 63, Gender: 1, GenderDisplay : "Male"  },
            { ID: 6, Name: "Marcia Thomas", Age: 53, Gender: 2  , GenderDisplay : "Female"},
            { ID: 7, Name: "Travis Greene", Age: 48, Gender: 1, GenderDisplay : "Male"  },
        ];

        const tableOne = component.find("#inline-table-one");
        InlineEditorLoad(tableOne,"inline-editor-info",data);
        resolve();

    });
});

Service.SubmitTransformation.TransformFormStage1 = function(component,params,actionBtn){
    alert("form is being transformed..... stage 1");
    return params;
};
Service.SubmitTransformation.AddMethod("transform-form-stage-2",function(component,params,actionBtn){
    alert("form is being transformed..... stage 2");
    return params;
});
Service.SubmitTransformation.AddMethod("transformation-no-submit", function(component,params,actionBtn){
    const res = new Result();
    res.Message = "Form submission will fail due to incorrect data";
    res.NotificationType = TOASTER_NOTIFICATION_TYPE;
    res.Status = "error";
    Service.NotificationHandler(res);
    Service.CanSubmitForm = false;
    return params;
});

Service.Transformation.capitalize = function(component, data, actionBtn){
    if(data === null){
        return (typeof component === "undefined" || component === null)
            ? "" : component.toUpperCase();
    }
    component.text(data.LastName.toUpperCase());
};
Service.Transformation.plusTwo = function(component, data, actionBtn){
    component.html(data + 2);
};
Service.Transformation.randomColor = function(component, data, actionBtn){
    const colors = [
        "blue",
        "brown",
        "coral",
        "crimson",
        "teal",
        "yellow"
    ];
    const color = ((Math.floor(Math.random() * 100) + 1) % 2) === 0;
    if(color){
        component.css("color",colors[Math.floor(Math.random() * 5)])
    }
};
Service.Transformation.AddMethod("add-age", function(component, property, actionBtn){
    if(actionBtn.data("id")){
        component.val(40);
    }else{
        component.val(0);
    }

});
Service.Transformation.AddMethod("form-header", function(component, data, actionBtn){
    if(data){
        component.html(`<p>The Information below is for ${data.Name} who is ${data.Age} year(s) of age</p>`)
    }else{
        component.html(`<p>The form below should be blank</p>`)
    }
});

function InlineEditorLoad(component,name,data){
    const editorData = Service.FindElementSync(name);
    Service.Bind(editorData,data);
    const viewRow = editorData.find("#view").find("tr");
    const addRow = editorData.find("#add").find("tr");
    component.append(viewRow)
    component.append(addRow);
};


Controller.Init = function () {
    console.log("Controller initialized......");
};
Controller.CustomSuccessHandler = function(result){
    alert("Custom success handler was fired");
    Service.SuccessHandler(result);
};
Controller.CustomErrorHandler = function(e){
    alert("Custom error handler was fired");
    Service.ErrorHandler(e);
};
Controller.ModalHide = function(component, actionBtn){
    Controller.ReloadPanel("SmallTarget");
};
Controller.AddMethod("list-from-controller",function(btn){
    return [
        {
            Text: "Controller List Item One",
            Value: 1
        },
        {
            Text: "Controller List Item Two",
            Value: 2
        }
    ]
});

//launch application when javascript and jQuery is finished loading
jQuery(function(){
    window.Controller.Init();
    Controller.PanelSelect(Service.Link({action:"home", notification:"error", complete:"SetDefaultLink"}));
    Controller.PanelSelect(Service.Link({action:"form", target:"SmallTarget"}));
});

