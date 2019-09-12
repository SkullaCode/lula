Controller.AddProperty("FormSubmit",function(elem, success=null, error=null){
    if(Service.SubmitButton !== null) return false;
    Service.SubmitButton = jQuery(elem);
    let target = Service.SubmitButton.data(Service.SYSTEM_ACTION);
    let custom = Service.SubmitButton.data(Service.SYSTEM_CUSTOM);
    let data = [];
    let site_url = "";
    let method = "";
    let params = {};

    //load the form from target specified. if not
    //load the parent form element
    if(typeof target === "undefined"){
       target = "";
        Service.LoadedForm = jQuery(Service.SubmitButton.parents('form'));
    }
    else{
        Service.LoadedForm = jQuery(document).find(target);
    }

    // if LoadedForm is not specified, terminate the action
    if(Service.LoadedForm.length <= 0){
        Service.SubmitButton = null;
        return false;
    }

    if(Service.LoadedForm.is("form")){
        data = jQuery(Service.LoadedForm.serializeArray());
        site_url = Service.LoadedForm[0].action;
        method = Service.LoadedForm[0].method;
    }
    else{
        Service.LoadedForm.find("input,select,textarea").each(function(){
            data.push({
                name: this.name,
                value: this.value
            });
        });
        site_url = Service.SubmitButton.data(Service.SYSTEM_URL);
        method = Service.SubmitButton.data(Service.SYSTEM_METHOD);
    }

    if(typeof site_url === "undefined") return false;
    if(typeof method === "undefined") method = "GET";

    const file = Service.LoadedForm.find("input[type='file']");
    if(file.length > 0){
        params = new FormData();
        jQuery(file).each(function(e){
            params.append(file[e].name,file[e].files);
        });
        jQuery.each(data,function(){
            params.append(this.name,this.value);
        });
    }else{
        jQuery.each(data,function(){
            params[this.name] = this.value;
        });
    }

    if(typeof custom !== "undefined")
        params = Service.ExecuteSubmitTransformation(custom,Service.LoadedForm,params);

    success = (success !== null) ? window[success] : Service.FormSubmitSuccessHandler;
    error = (error !== null) ? window[error] : Service.ErrorHandler;
    let ex = Service.Action[target];
    if(typeof ex !== "undefined") ex(site_url,method,params,success,error);
    else Service.ServerRequest(site_url,params,method,success,error);
});

Controller.AddProperty("FileSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionButton !== null) return false;
    Service.ActionButton = jQuery(elem);
    let target = Service.ActionButton.data(Service.SYSTEM_ACTION);
    let custom = Service.ActionButton.data(Service.SYSTEM_CUSTOM);
    //load the form associated with the file
    Service.LoadedForm = (typeof target === "undefined")
        ? jQuery(Service.ActionButton.parents(Service.SYSTEM_FILE_UPLOAD_CONTAINER))
        : jQuery(document).find(`#${target}`);
    // find the file input element
    let input = Service.LoadedForm.find("input[type=file]");
    // find the image element that displays preview
    let img = Service.LoadedForm.find("img");
    // trigger click event that opens upload file dialog
    input.click();
    // update preview image when file is changed
    input.change(function() {
        Service.ImagePreview(input, img);
    });
    input.change();
    // execute custom code on the form
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,Service.LoadedForm);
    }
    //enable other actions when complete
    Service.ActionButton = null;
});

Controller.AddProperty("ModalSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionButton !== null) return false;
    Service.ActionButton = jQuery(elem);
    //if a modal is already loaded do not execute
    if(Service.LoadedModal === null){
        let action = Service.ActionButton.data(Service.SYSTEM_ACTION);
        Service.LoadedModal = Service.FindElement(`#${action}`);
        //place modal on the DOM
        const modalContainer = jQuery(ModalContainer);
        modalContainer.empty().append(Service.LoadedModal);
        //update modal attributes
        if(typeof Service.ActionButton.data(Service.SYSTEM_ID) !== "undefined")
            Service.LoadedModal.data(Service.SYSTEM_ID,Service.ActionButton.data(Service.SYSTEM_ID));
        if(typeof Service.ActionButton.data(Service.SYSTEM_PROPERTY) !== "undefined")
            Service.LoadedModal.data(Service.SYSTEM_PROPERTY,Service.ActionButton.data(Service.SYSTEM_PROPERTY));
        let custom = jQuery(elem).data(Service.SYSTEM_CUSTOM);
        //execute custom changes
        if(typeof custom !== "undefined"){
            Service.ExecuteCustom(custom,Service.LoadedModal);
        }
        // launch modal
        Service.LaunchModal();
    }
    Service.ActionButton = null;
});

Controller.AddProperty("PanelSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionButton !== null) return false;
    Service.ActionButton = jQuery(elem);
    //locate panel
    let panel = Service.FindElement(`#${Service.ActionButton.data(Service.SYSTEM_ACTION)}`);
    //load panel attributes
    if(typeof Service.ActionButton.data(Service.SYSTEM_ID) !== "undefined")
        panel.data(Service.SYSTEM_ID,Service.ActionButton.data(Service.SYSTEM_ID));
    if(typeof Service.ActionButton.data(Service.SYSTEM_PROPERTY) !== "undefined")
        panel.data(Service.SYSTEM_PROPERTY,Service.ActionButton.data(Service.SYSTEM_PROPERTY));
    //load panel unto the DOM
    if(typeof  Service.ActionButton.data(Service.SYSTEM_TARGET) !== "undefined"){
        Service.LoadPanel(panel,Service.ActionButton.data(Service.SYSTEM_TARGET));
    }
    else{
        Service.LoadPanel(panel);
    }
    //execute custom changes
    let custom = jQuery(elem).data(Service.SYSTEM_CUSTOM);
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,Service.LoadedPanel);
    }
    Service.ActionButton = null;
});

jQuery(function(){
    //bootstrap the system
    Service.Data.Bootstrap();
    Service.Transformation.Bootstrap();
});