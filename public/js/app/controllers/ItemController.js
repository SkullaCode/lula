Controller.Init = function () {
    Service.ModelData.Listing = {};

    Service.Modification.AddMethod("ColorRed",function(component){
        let header = jQuery(component).find("h1");
        header.css("color","red");
    });

    Service.Data.AddMethod("form-data",function(component){
        const data = [];
        data[12] = {
            NameLabel: "Person Name",
            Name: "John",
            AgeLabel: "Person Age",
            Age: 30,
            GenderLabel: "Person Gender",
            Gender: 1
        };
        const id = component.data(Service.SYSTEM_ID);
        Service.Bind(component,data[id]);
    });

    Service.Data.AddMethod("table-data",function(component){
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
    });

    Service.Data.AddMethod("datatable-data",function(component){
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
    });

    Service.Data.AddMethod("modal-data",function(component){
        console.log(component);
        const data = [];
        data[12] = {
            NameLabel: "Person Name",
            Name: "John",
            AgeLabel: "Person Age",
            Age: 30,
            GenderLabel: "Person Gender",
            Gender: 1
        };
        const id = component.data(Service.SYSTEM_ID);
        if(typeof id !== "undefined"){
            data[12].ModalTitle = "New Modal";
            const form = Service.FindElement("#form");
            form.attr("id","formSubmit");
            Service.Bind(form,data[id]);
            Service.Bind(component,data[id]);
            component.find(".modal-body").append(form);
        }
    });

    Service.Transformation.AddMethod("capitalize",function(component){
        return (typeof component === "undefined" || component === null)
            ? "" : component.toUpperCase();
    });
};

jQuery(function(){
    window.Controller.Init();
});

