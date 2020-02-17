/**
 * -- Data --
 * Add a method to the data executor that has the same signature as the data-action property on a
 * panel or modal template and it will be automatically called during the binding process.
 * These methods are where the data is defined that the panel or modal will use while binding
 * takes place.
 */
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
    component.find(".modal-body").attr("id","formSubmit");
    if(typeof id !== "undefined"){
        data[12].ModalTitle = "New Modal";
        const form = Service.FindElement("form");
        //Service.BindForm(form,data[id]);
        Service.Bind(form,data[id]);
        Service.Bind(component,data[id]);
        component.find("#modal-form").append(form);
    }
    const image = Service.FindElement("file-select");
    image.find("img").css("max-width","250px");
    image.find("input[type=file]").prop("multiple",true);
    component.find("#modal-image").append(image);
});