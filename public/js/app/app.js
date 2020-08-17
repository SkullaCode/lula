/**
 * -- Form Submit --
 * Handles form submission triggered by the element placed on.
 * It will only execute if there is no other submission
 * in progress. Behavior is to locate the form for submission,
 * serialize form fields (including files), execute submit transformation
 * function on form fields if present, and send the result to
 * Service.ServerRequest to be processed.
 */
Controller.AddProperty("FormSubmit",function(elem,e){
    //prevent default action for submit button
    if(typeof e !== "undefined"){
        e.preventDefault();
    }else{
        window.event.preventDefault();
    }
    //exit if another submission is in progress
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    Service.CanSubmitForm = true;
    let target = ActionButton.data(Service.SYSTEM_ACTION);
    let custom = ActionButton.data(Service.SYSTEM_CUSTOM);
    let pre = ActionButton.data(Service.SYSTEM_PRE_FORM_EXECUTION);
    let requestHeaders = ActionButton.data(Service.SYSTEM_HEADERS);
    let site_url = "";
    let method = "";
    let params = new FormData();
    let headers = [];
    let data = [];

    //load the form from target specified. if not
    //load the parent form element
    if(typeof target === "undefined"){
       target = "";
        Service.LoadedForm = jQuery(ActionButton.parents('form'));
    }
    else{
        const url = ActionButton.data(Service.SYSTEM_URL);
        const method = ActionButton.data(Service.SYSTEM_METHOD);
        if (target.substring(0, 1) !== "#") target = `#${target}`;
        const targetContainer = jQuery(document).find(target);
        let form = targetContainer.find("form");
        if (form.length > 0) {
            Service.LoadedForm = form;
            if(typeof url !== "undefined") form.attr("action",url);
            if(typeof method !== "undefined") form.attr("method",method);
        } else {
            form = jQuery("<form></form>",
                {
                    action: url,
                    method: method
                });
            form.append(targetContainer.children());
            targetContainer.empty().append(form);
            Service.LoadedForm = form;
        }
    }

    // if LoadedForm is not specified, terminate the action
    if(Service.LoadedForm.length <= 0){
        Service.ActionLoading = false;
        return false;
    }

    //if headers function is defined execute it and get headers for request
    if(typeof requestHeaders !== "undefined"){
        if(Controller.hasOwnProperty(requestHeaders)){
            headers = Controller[requestHeaders]();
        }
    }



    //retrieve form fields and submission data from loaded form
    //exclude file input from search...handled separately below
    data = jQuery(Service.LoadedForm.serializeArray());
    jQuery.each(data,function(){
        params.append(this.name,this.value);
    });
    site_url = Service.LoadedForm[0].action;
    method = Service.LoadedForm[0].method;

    if(typeof site_url === "undefined") return false;
    if(typeof method === "undefined") method = "POST";
    method = method.toUpperCase();

    //determine if the form has a file, and if so serialize
    //using FormData object, or just use an object
    const file = Service.LoadedForm.find("input[type='file']");
    if(file.length > 0){
        jQuery(file).each(function(e){
            //determine if multiple files are selected and add
            //each of them to the payload
            if(file[e].files.length > 1){
                let fileName = file[e].name;
                //determine if file name is array or not
                if(fileName.substring(fileName.length -1,fileName.length) !== "]"){
                    fileName = `${file[e].name}[]`;
                }
                for(let i=0; i<file[e].files.length; i++){
                    params.append(fileName,file[e].files[i]);
                }
            }
            else{
                params.append(file[e].name,file[e].files[0]);
            }
        });
    }

    //determine if there are pre execution events
    if(typeof pre !== "undefined"){
        pre = pre.split("|");
        pre.forEach(function(item){
            if(Controller.hasOwnProperty(item)){
                Controller[item](params);
            }
        });
    }

    //determine if there are submit transformations and execute them
    if(typeof custom !== "undefined")
        params = Service.ExecuteSubmitTransformation(custom,Service.LoadedForm,params);

    //determine the response handlers to use for success and error
    //defaults are chosen by default obviously
    let success = Service.SuccessHandler;
    let error = Service.ErrorHandler;
    let successHandler = ActionButton.data(Service.SYSTEM_SUCCESS_HANDLER);
    let errorHandler = ActionButton.data(Service.SYSTEM_ERROR_HANDLER);
    if(typeof successHandler !== "undefined" && Controller.hasOwnProperty(successHandler)){
        success = Controller[successHandler];
    }
    if(typeof errorHandler !== "undefined" && Controller.hasOwnProperty(errorHandler)){
        error = Controller[errorHandler];
    }

    if(Service.CanSubmitForm === false){
        Service.ActionLoading = false;
        return false;
    }

    //determine how the form submission should be processed
    //if a specific action was specified we use that
    //otherwise we use the default server request
    let ex = Service.Action[target];
    if(typeof ex !== "undefined") ex({
        params,
        success,
        error,
        headers,
        site: site_url,
        request: method,
        actionBtn: ActionButton,
        component: Service.LoadedForm
    });
    else Service.ServerRequest({
        params,
        success,
        error,
        headers,
        site: site_url,
        request: method,
        actionBtn: ActionButton,
        component: Service.LoadedForm
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
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    let target = ActionButton.data(Service.SYSTEM_ACTION);
    let custom = ActionButton.data(Service.SYSTEM_COMPLETE);
    //load the form associated with the file
    const form = (typeof target === "undefined")
        ? jQuery(ActionButton.parents(Service.SYSTEM_FILE_UPLOAD_CONTAINER))
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
        Service.ExecuteCustom(custom,form,ActionButton);
    }
    Service.ActionLoading = false;
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
   if(Service.ModalLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ModalLoading = true;
    //make action button aware of loaded type
    ActionButton.data(Service.SYSTEM_LOAD_TYPE,"modal");
    //if a modal is already loaded do not execute
    if(Service.LoadedModal === null){
        let action = ActionButton.data(Service.SYSTEM_ACTION);
        Service.FindElement(action).then((elem) =>{
            Service.LoadedModal = elem;

            //format modal... has to be structured a specific way
            //to work
            if (!Service.LoadedModal.hasClass("modal")) {
                Service.LoadedModal = Service.DefaultModalHandler(elem,ActionButton);
            }
            //place modal on the DOM
            const modalContainer = jQuery(`#${ModalContainer}`);
            modalContainer.empty().append(Service.LoadedModal);
            //update modal attributes
            const dataAttributes = ActionButton.data();
            const filterList = [Service.SYSTEM_ACTION,Service.SYSTEM_COMPLETE];
            jQuery.each(dataAttributes,function(key,value){
                //filter out action and custom attribute
                // these are defined on the modal
                if(jQuery.inArray(key,filterList) === -1){
                    Service.LoadedModal.data(key,value);
                }
            });
            let custom = ActionButton.data(Service.SYSTEM_COMPLETE);
            //execute custom changes
            if(typeof custom !== "undefined"){
                Service.ExecuteCustom(custom,Service.LoadedModal,ActionButton);
            }
            // launch modal
            Service.LaunchModal(Service.LoadedModal,ActionButton);
        });
    }
    Service.ModalLoading = false;
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
    if(Service.PanelLoading) return false;
    const ActionButton = jQuery(elem);
    Service.PanelLoading = true;
    //make action button aware of loaded type
    ActionButton.data(Service.SYSTEM_LOAD_TYPE,"panel");
    //get history url if defined
    const history = ActionButton.data(Service.SYSTEM_HISTORY);
    //locate panel
    Service.FindElement(ActionButton.data(Service.SYSTEM_ACTION)).then((panel) =>{
        //update modal attributes
        const filterList = [Service.SYSTEM_ACTION,Service.SYSTEM_COMPLETE,Service.SYSTEM_TARGET];
        jQuery.each(ActionButton.data(),function(key,value){
            //filter out action and custom attribute
            // these are defined on the panel
            if(jQuery.inArray(key,filterList) === -1){
                panel.data(key,value);
            }
        });
        //adding panel change to browser history
        //ignore if history data attribute is defined
        if(typeof history === "undefined"){
            window.history.pushState({
                data: ActionButton.data(),
                panelSelect: true
            },"");
        }

        //determine and set page title
        const title = (typeof ActionButton.data(Service.SYSTEM_TITLE) !== "undefined")
            ? ActionButton.data(Service.SYSTEM_TITLE)
            : ActionButton.data(Service.SYSTEM_ACTION);
        window.document.title = `${Service.Title} - ${title}`;
        //load panel unto the DOM
        if(typeof  ActionButton.data(Service.SYSTEM_TARGET) !== "undefined"){
            Service.LoadPanel(panel,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then(() =>{
                let custom = ActionButton.data(Service.SYSTEM_COMPLETE);
                if(typeof custom !== "undefined"){
                    Service.ExecuteCustom(custom,Service.LoadedPanel,ActionButton);
                }
                Service.PanelLoading = false;
            });
        }
        else{
            Service.LoadPanel(panel,ActionButton).then(() =>{
                let custom = ActionButton.data(Service.SYSTEM_COMPLETE);
                if(typeof custom !== "undefined"){
                    Service.ExecuteCustom(custom,Service.LoadedPanel,ActionButton);
                }
                Service.PanelLoading = false;
            });
        }
    });
});

/**
 * -- Reload Panel --
 * this function reloads the current panel
 */
Controller.AddProperty("ReloadPanel",function(){
    const btn = jQuery("<button></button>",{
        type:"button",
        "data-notification":"false"
    });
    Service.LoadPanel(Service.LoadedPanel,btn);
});

window.onpopstate = function(event){
    //get page state
    const state = event.state;
    if(state !== null){
        if(state.panelSelect){
            //create a action link to fire the controller action
            const link = jQuery("<a>");
            //add the data attributes recorded in the state
            jQuery.each(state.data,function(i,e){
                link.attr(`data-${i}`,e);
            });
            //add a history data attribute so the panel
            //ignores the entry for pushState
            link.attr("data-history",true);
            //fire controller action with created anchor tag
            Controller.PanelSelect(link[0]);
        }
    }
};
