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
    console.log({result});
    let message = (result.status === "success") ? "successfully" : "in error";
    alert(`Complete handler was fired ${message}`);
};

Service.Data.Default = function(component, actionBtn){
    return new Promise(function(resolve){
        const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        Service.Bind(component,{ data });
        resolve();
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
            Gender: 1
        };
        const id = actionBtn.data(Service.SYSTEM_ID);
        Service.Bind(component,data[id],actionBtn);
        return resolve(true);
    });
});
Service.Data.AddMethod("table-data",function(component,actionBtn){
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

        component.find("#datatableTable").DataTable({
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
            Gender: 1
        };
        const id = actionBtn.data(Service.SYSTEM_ID);
        component.find(".modal-body").attr("id","formSubmit");
        if(typeof id !== "undefined"){
            data[12].ModalTitle = "New Modal";

            Service.FindElement("form").then((form) => {
                //Service.BindForm(form,data[id]);
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
        return resolve(true);
    });
});
Service.Data.AddMethod("list-update-data",function(component,actionBtn){
    return new Promise(function(resolve){
        Service.ModelData.List["main-content"] = [
            { Text: "Main Item 1", Value: 1 },
            { Text: "Main Item 2", Value: 2 },
            { Text: "Main Item 3", Value: 3 },
        ];
        Service.ModelData.List['secondary-content'] = {};
        Service.ModelData.List['secondary-content'][1] = [
            { Text: "MI1 Secondary 1", Value: 1 },
            { Text: "MI1 Secondary 2", Value: 2 },
            { Text: "MI1 Secondary 3", Value: 3 },
        ];
        Service.ModelData.List['secondary-content'][2] = [
            { Text: "MI2 Secondary 1", Value: 4 },
            { Text: "MI2 Secondary 2", Value: 5 },
            { Text: "MI2 Secondary 3", Value: 6 },
        ];
        Service.ModelData.List['secondary-content'][3] = [
            { Text: "MI3 Secondary 1", Value: 7 },
            { Text: "MI3 Secondary 2", Value: 8 },
            { Text: "MI3 Secondary 3", Value: 9 },
        ];
        Service.Bind(component,{mainList:2});
        resolve();
    });
});

Service.SubmitTransformation.TransformFormStage1 = function(component,params){
    alert("form is being transformed..... stage 1");
    return params;
};
Service.SubmitTransformation.AddMethod("transform-form-stage-2",function(component,params){
    alert("form is being transformed..... stage 2");
    return params;
});
Service.SubmitTransformation.AddMethod("transformation-no-submit", function(component,params){
    alert("form submit will fail");
    Service.CanSubmitForm = false;
    return params;
});

Service.Transformation.capitalize = function(component, actionBtn){
    return (typeof component === "undefined" || component === null)
        ? "" : component.toUpperCase();
};
Service.Transformation.AddMethod("add-age", function(component,property, actionBtn){
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
Controller.PreFormSubmitEvent = function(formData){
  alert("Pre form execution event handler was fired");
};

jQuery(function(){
    window.Controller.Init();
});

