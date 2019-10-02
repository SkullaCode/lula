/**
 * -- Form Submit --
 * Handles form submission triggered by the element placed on.
 * It will only execute if there is no other submission
 * in progress. Behavior is to locate the form for submission,
 * serialize form fields (including files), execute submit transformation
 * function on form fields if present, and send the result to
 * Service.ServerRequest to be processed.
 */
Controller.AddProperty("FormSubmit",function(elem){
    //exit if another submission is in progress
    if(Service.SubmitButton !== null) return false;
    Service.SubmitButton = jQuery(elem);
    let target = Service.SubmitButton.data(Service.SYSTEM_ACTION);
    let custom = Service.SubmitButton.data(Service.SYSTEM_CUSTOM);
    let complete = Service.SubmitButton.data(Service.SYSTEM_COMPLETE);
    let data = [];
    let site_url = "";
    let method = "";
    let params = {};
    let hasFile = false;

    //load the form from target specified. if not
    //load the parent form element
    if(typeof target === "undefined"){
       target = "";
        Service.LoadedForm = jQuery(Service.SubmitButton.parents('form'));
    }
    else{
        Service.LoadedForm = jQuery(document).find(target);
    }

    //if a complete function is defined add it to the loaded form
    if(typeof complete !== "undefined"){
        Service.LoadedForm.data(Service.SYSTEM_COMPLETE,Service.SubmitButton.data(Service.SYSTEM_COMPLETE));
    }

    // if LoadedForm is not specified, terminate the action
    if(Service.LoadedForm.length <= 0){
        Service.SubmitButton = null;
        return false;
    }

    //retrieve form fields and submission data from loaded form
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

    //determine if the form has a file, and if so serialize
    //using FormData object, or just use an object
    const file = Service.LoadedForm.find("input[type='file']");
    if(file.length > 0){
        hasFile = true;
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

    //determine if there are submit transformations and execute them
    if(typeof custom !== "undefined")
        params = Service.ExecuteSubmitTransformation(custom,Service.LoadedForm,params);

    //determine the response handlers to use for success and error
    //defaults are chosen by default obviously
    let success = Service.FormSubmitSuccessHandler;
    let error = Service.ErrorHandler;
    let successHandler = Service.SubmitButton.data(Service.SYSTEM_SUCCESS_HANDLER);
    let errorHandler = Service.SubmitButton.data(Service.SYSTEM_ERROR_HANDLER);
    if(typeof successHandler !== "undefined" && Controller.hasOwnProperty(successHandler)){
        success = Controller[successHandler];
    }
    if(typeof errorHandler !== "undefined" && Controller.hasOwnProperty(errorHandler)){
        error = Controller[errorHandler];
    }

    //determine how the form submission should be processed
    //if a specific action was specified we use that
    //otherwise we use the default server request
    let ex = Service.Action[target];
    if(typeof ex !== "undefined") ex({
        site: site_url,
        params: params,
        request: method,
        success: success,
        error: error,
        hasFile: hasFile
    });
    else Service.ServerRequest({
        site: site_url,
        params: params,
        request: method,
        success: success,
        error: error,
        hasFile: hasFile,
    });
});

/**
 * -- File Select --
 * Handles file selection and preview. It will only execute if
 * there is no other action in progress. Behaviour is to
 * locate the container with the file input and image,
 * execute click function on file input to launch dialog,
 * and setup the preview for showing when selected.
 */
Controller.AddProperty("FileSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionButton !== null) return false;
    Service.ActionButton = jQuery(elem);
    let target = Service.ActionButton.data(Service.SYSTEM_ACTION);
    let custom = Service.ActionButton.data(Service.SYSTEM_CUSTOM);
    //load the form associated with the file
    const form = (typeof target === "undefined")
        ? jQuery(Service.ActionButton.parents(Service.SYSTEM_FILE_UPLOAD_CONTAINER))
        : jQuery(document).find(`#${target}`);
    // find the file input element
    let input = form.find("input[type=file]");
    // find the image element that displays preview
    let img = form.find("img");
    // trigger click event that opens upload file dialog
    input.click();
    // update preview image when file is changed
    input.change(function() {
        Service.ImagePreview(input, img);
    });
    input.change();
    // execute custom code on the form
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,form);
    }
    //enable other actions when complete
    Service.ActionButton = null;
});

/**
 * -- Modal Select --
 * Handles launching modals. It will only execute if
 * there is no other action in progress. Behaviour is to
 * Find the element specified and update the loaded modal
 * property with it, place it on the DOM in the modal
 * container (this is just an empty div with the specified
 * class that MUST be in the layout), execute any custom
 * modifications, and launch.
 */
Controller.AddProperty("ModalSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionButton !== null) return false;
    Service.ActionButton = jQuery(elem);
    //make action button aware of loaded type
    Service.ActionButton.data(Service.SYSTEM_LOAD_TYPE,"modal");
    //if a modal is already loaded do not execute
    if(Service.LoadedModal === null){
        let action = Service.ActionButton.data(Service.SYSTEM_ACTION);
        Service.LoadedModal = Service.FindElement(`#${action}`);
        //place modal on the DOM
        const modalContainer = jQuery(ModalContainer);
        modalContainer.empty().append(Service.LoadedModal);
        //update modal attributes
        const dataAttributes = Service.ActionButton.data();
        const filterList = [Service.SYSTEM_ACTION,Service.SYSTEM_CUSTOM];
        jQuery.each(dataAttributes,function(key,value){
            //filter out action and custom attribute
            // these are defined on the modal
            if(jQuery.inArray(key,filterList) === -1){
                Service.LoadedModal.data(key,value);
            }
        });
        let custom = Service.ActionButton.data(Service.SYSTEM_CUSTOM);
        //execute custom changes
        if(typeof custom !== "undefined"){
            Service.ExecuteCustom(custom,Service.LoadedModal);
        }
        // launch modal
        Service.LaunchModal();
    }
    Service.ActionButton = null;
});

/**
 * -- Panel Select --
 * Handles loading new panels unto the DOM. It will only
 * execute if there is no other action in progress.
 * Behaviour is to Find the element specified and update
 * the loaded panel property with it, determine the target
 * where the panel should be placed, load panel unto
 * the DOM, and execute custom modifications if specified
 */
Controller.AddProperty("PanelSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionButton !== null) return false;
    Service.ActionButton = jQuery(elem);
    //make action button aware of loaded type
    Service.ActionButton.data(Service.SYSTEM_LOAD_TYPE,"panel");
    //locate panel
    const panel = Service.FindElement(`#${Service.ActionButton.data(Service.SYSTEM_ACTION)}`);
    //update modal attributes
    const filterList = [Service.SYSTEM_ACTION,Service.SYSTEM_CUSTOM,Service.SYSTEM_TARGET];
    jQuery.each(Service.ActionButton.data(),function(key,value){
        //filter out action and custom attribute
        // these are defined on the panel
        if(jQuery.inArray(key,filterList) === -1){
            panel.data(key,value);
        }
    });
    //load panel unto the DOM
    if(typeof  Service.ActionButton.data(Service.SYSTEM_TARGET) !== "undefined"){
        Service.LoadPanel(panel,Service.ActionButton.data(Service.SYSTEM_TARGET));
    }
    else{
        Service.LoadPanel(panel);
    }
    //execute custom changes
    let custom = Service.ActionButton.data(Service.SYSTEM_CUSTOM);
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,Service.LoadedPanel);
    }
    Service.ActionButton = null;
});

/**
 * -- Reload Panel --
 * this function reloads the current panel
 */
Controller.AddProperty("ReloadPanel",function(){
    Service.LoadPanel(Service.LoadedPanel);
});

jQuery(function(){
    //bootstrap the system
    Service.Data.Bootstrap();
    Service.Transformation.Bootstrap();
});