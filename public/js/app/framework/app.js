window.Controller.AddProperty("FormSubmit",function(e, success=null, error=null){
    e.preventDefault();
    if(window.Service.SubmitButton !== null) return false;
    window.Service.SubmitButton = jQuery(this);
    let target = window.Service.SubmitButton.data("action");
    let custom = window.Service.SubmitButton.data("custom");
    let data = [];
    let site_url = "";
    let method = "";
    let params = {};

    // if data-action is not specified on
    // the button terminate the action
    if(typeof target === "undefined"){
        window.Service.SubmitButton = null;
        return false;
    }

    //load the form from target specified. if not
    //load the parent form element
    window.Service.LoadedForm = jQuery(document).find(target);
    if(window.Service.LoadedForm.length <= 0)
        window.Service.LoadedForm = jQuery(window.Service.SubmitButton.parents('form'));


    if(window.Service.LoadedForm.is("form")){
        data = jQuery(window.Service.LoadedForm.serializeArray());
        site_url = window.Service.LoadedForm[0].action;
        method = window.Service.LoadedForm[0].method;
    }
    else{
        window.Service.LoadedForm.find("input,select,textarea").each(function(){
            data.push({
                name: this.name,
                value: this.value
            });
        });
        site_url = window.Service.SubmitButton.data("href");
        method = window.Service.SubmitButton.data("method");
    }
    const file = window.Service.LoadedForm.find("input[type='file']");
    if(file.length > 0){
        params = new FormData();
        jQuery(file).each(function(e){
            params.append(file[e].name,file[e].files[0]);
        });
        jQuery.each(data,function(){
            params.append(this.name,this.value);
        });
    }else{
        jQuery.each(data,function(){
            params[this.name] = this.value;
        });
    }

    let func = target;
    if(typeof custom !== "undefined")
        func += "|" + custom;

    params = window.Service.ExecuteSubmitTransformation(func,window.Service.LoadedForm,params);
    success = success || window.Service.FormSubmitSuccessHandler;
    error = error || window.Service.ErrorHandler;
    let ex = window.Service.Action[target];
    if(typeof ex !== "undefined") ex(site_url,method,params,success,error);
    else window.Service.ServerRequest(site_url,params,method,success,error);
});

window.Controller.AddProperty("FileSelect",function(e){
    e.preventDefault();
    //if there is a triggered action do not execute
    if(window.Service.ActionButton !== null) return false;
    window.Service.ActionButton = jQuery(this);
    let target = window.Service.ActionButton.data("action");
    let custom = window.Service.ActionButton.data("custom");
    //load the form associated with the file
    window.Service.LoadedForm = (typeof target === "undefined")
        ? jQuery(window.Service.ActionButton.parents(".file-upload"))
        : jQuery(document).find('#'+target);
    // find the file input element
    let input = window.Service.LoadedForm.find("input[type=file]");
    // find the image element that displays preview
    let img = window.Service.LoadedForm.find("img");
    // trigger click event that opens upload file dialog
    input.click();
    // update preview image when file is changed
    input.change(function() {
        window.Service.ImagePreview(input, img);
    });
    input.change();
    // execute custom code on the form
    if(typeof custom !== "undefined"){
        window.Service.ExecuteCustom(custom,window.Service.LoadedForm);
    }
    //enable other actions when complete
    window.Service.ActionButton = null;
});

window.Controller.AddProperty("ModalSelect",function(e){
    e.preventDefault();
    if(window.Service.ActionButton !== null) return false;
    window.Service.ActionButton = jQuery(this);
    if(window.Service.LoadedModal === null){
        let action = window.Service.ActionButton.data("action");
        window.Service.LoadedModal = window.Service.FindElement(`#${action}Modal`);
        const modalContainer = jQuery(".modal-container");
        modalContainer.empty().append(window.Service.LoadedModal);
        if(typeof window.Service.ActionButton.data("id") !== "undefined")
            window.Service.LoadedModal.data("id",window.Service.ActionButton.data("id"));
        if(typeof window.Service.ActionButton.data("property") !== "undefined")
            window.Service.LoadedModal.data("property",window.Service.ActionButton.data("property"));
        let custom = jQuery(this).data("custom");
        if(typeof custom !== "undefined"){
            let func = window.Service.Modification[custom];
            if(typeof func !== "undefined")
                func(window.Service.LoadedModal);
        }
        window.Service.LaunchModal();
    }
    window.Service.ActionButton = null;
});

window.Controller.AddProperty("PanelSelect",function(elem){
    if(window.Service.ActionButton !== null) return false;
    window.Service.ActionButton = jQuery(elem);
    let panel = window.Service.FindElement(`#${window.Service.ActionButton.data("action")}`);
    if(typeof window.Service.ActionButton.data("id") !== "undefined")
        panel.data("id",window.Service.ActionButton.data("id"));
    if(typeof window.Service.ActionButton.data("property") !== "undefined")
        panel.data("property",window.Service.ActionButton.data("property"));
    if(typeof  window.Service.ActionButton.data("target") !== "undefined"){
        window.Service.LoadPanel(panel,window.Service.ActionButton.data("target"));
    }
    else{
        window.Service.LoadPanel(panel);
    }
    //DOMEvents();
    let custom = jQuery(elem).data("custom");
    if(typeof custom !== "undefined"){
        window.Service.ExecuteCustom(custom,window.Service.LoadedPanel);
    }
    window.Service.ActionButton = null;
});

jQuery(function(){
    window.Service.Data.Bootstrap();
    window.Service.Transformation.Bootstrap();
});
