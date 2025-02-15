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
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    Service.CanSubmitForm = true;
    let target = ActionButton.data(Service.SYSTEM_TARGET);
    //fallback to action if target not defined
    if(typeof target === "undefined"){
        target = ActionButton.data(Service.SYSTEM_ACTION);
    }
    let custom = ActionButton.data(Service.SYSTEM_CUSTOM);
    let complete = ActionButton.data(Service.SYSTEM_COMPLETE);
    let requestHeaders = ActionButton.data(Service.SYSTEM_HEADERS);
    let form = [];
    let site_url = ActionButton.data(Service.SYSTEM_URL);
    let method = "post";
    let params = new FormData();
    let headers = [];
    let data = [];

    //load the form from target specified. if not
    //load the parent form element
    if(typeof target === "undefined"){
        Service.LoadedForm = jQuery(ActionButton.parents('form'));
        if(typeof Service.LoadedForm.attr("action") !== "undefined"){
            site_url = Service.LoadedForm.attr("action");
        }
        if(typeof Service.LoadedForm.attr("method") !== "undefined"){
            method = Service.LoadedForm.attr("method");
        }
        //retrieve form fields and submission data from loaded form
        //exclude file input from search...handled separately below
        data = Service.LoadedForm.serializeArray();
    }
    else{
        if (target.substring(0, 1) !== "#") target = `#${target}`;
        const targetContainer = jQuery(document).find(target);
        form = (targetContainer.is("form")) ? targetContainer : targetContainer.find("form");
        if (form.length > 0) {
            Service.LoadedForm = form;
            site_url = form.prop("action");
            method = form.prop("method");
            if(typeof form.data(Service.SYSTEM_URL) !== "undefined"){
                site_url = form.data(Service.SYSTEM_URL);
            }
            if(typeof form.data(Service.SYSTEM_METHOD) !== "undefined"){
                method = form.data(Service.SYSTEM_METHOD);
            }
            //retrieve form fields and submission data from loaded form
            //exclude file input from search...handled separately below
            data = form.serializeArray();
        } else {
            //No form detected......lets build one.
            const formContent = targetContainer.clone();
            form = jQuery("<form></form>");
            form.append(formContent.children());
            //jQuery does not clone selects.....say its to expensive
            const selects = targetContainer.find("select");
            jQuery(selects).each(function (i) {
                form.find("select").eq(i).val(jQuery(this).val());
            });
            if(typeof targetContainer.data(Service.SYSTEM_URL) !== "undefined"){
                site_url = targetContainer.data(Service.SYSTEM_URL);
            }
            if(typeof targetContainer.data(Service.SYSTEM_METHOD) !== "undefined"){
                method = targetContainer.data(Service.SYSTEM_METHOD);
            }
            //we use the target as the loaded form.
            //Form object used to retrieve data
            Service.LoadedForm = targetContainer;
            //retrieve form fields and submission data from loaded form
            //exclude file input from search...handled separately below
            data = form.serializeArray();
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

    //create FormData object from form values
    params = Service.FormData(data);

    if(typeof site_url === "undefined" || site_url.length <= 0){
        Service.ActionLoading = false;
        return false;
    }
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

    //determine if there are submit transformations and execute them
    if(typeof custom !== "undefined")
        params = Service.ExecuteSubmitTransformation(custom,Service.LoadedForm,params,ActionButton);

    //determine if we should send form to server for processing or not
    if(Service.CanSubmitForm === false){
        Service.ActionLoading = false;
        return false;
    }

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
    const requestData = new Requirement();
    requestData.Params = params;
    requestData.SuccessHandler = success;
    requestData.ErrorHandler = error;
    requestData.Complete = complete;
    requestData.Site = site_url;
    requestData.Request = method;
    requestData.ActionBtn = ActionButton;
    requestData.Component = Service.LoadedForm;
    requestData.Headers = headers;
    Service.ServerRequest(requestData);
});

/**
 * -- File Select --
 * Handles file selection and preview. It will only execute if
 * there is no other action in progress. Behaviour is to
 * locate the container with the file input and image,
 * execute click function on file input to launch dialog,
 * and set up the preview for showing when selected.
 */
Controller.AddProperty("FileSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    let target = ActionButton.data(Service.SYSTEM_TARGET);
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
        Service.FindElement(action, ActionButton).then((elem) => {
            Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),elem,ActionButton).then(() => {
                Service.LoadData(elem, ActionButton).then((success) => {
                    if(!success) {
                        elem = Service.DefaultModalHandler(Service.DefaultElementHandler(ActionButton),ActionButton);
                        Service.LoadModal(elem, ActionButton).then((modal) => {
                            Service.LaunchModal(modal,ActionButton).then(() => {
                                modal.find(".modal-title").empty().text("Modal Launch Error")
                                Service.LoadedModal = modal;
                                Service.ModalLoading = false;
                            });
                        })
                    }else{
                        Service.LoadModal(elem, ActionButton).then((modal) => {
                            Service.LaunchModal(modal,ActionButton).then(() => {
                                //execute complete modifications
                                Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),modal,ActionButton).then(() => {
                                    Service.LoadedModal = modal;
                                    Service.ModalLoading = false;
                                });
                            });
                        })
                    }
                })
            });
        });
    }
    else{
        Service.ModalLoading = false;
    }
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
    const ActionButton = jQuery(elem);
    const action = ActionButton.data(Service.SYSTEM_ACTION);
    //determine if current action is already being loaded
    //if so exit............
    if(jQuery.inArray(action,Service.PanelLoading) !== -1){
        return false;
    }
    Service.PanelLoading.push(ActionButton.data(Service.SYSTEM_ACTION));
    
    //make action button aware of loaded type
    ActionButton.data(Service.SYSTEM_LOAD_TYPE,"panel");
    //get history url if defined
    const history = ActionButton.data(Service.SYSTEM_HISTORY);
    //define properties to store on history
    const historyData = {};
    //attributes that should be persisted if present on the action button
    const filterList = [
        Service.SYSTEM_ACTION,
        Service.SYSTEM_COMPLETE,
        Service.SYSTEM_TARGET,
        Service.SYSTEM_CUSTOM,
        Service.SYSTEM_HISTORY,
        Service.SYSTEM_NOTIFICATION_ON_SUCCESS,
        Service.SYSTEM_NOTIFICATION_ON_ERROR,
        Service.SYSTEM_NOTIFICATION,
        Service.SYSTEM_TITLE
    ];
    //add them to history data if present
    jQuery.each(ActionButton.data(),function(key,value){
        if(jQuery.inArray(key,filterList) !== -1) {
            historyData[key] = value;
        }
        //add values that are strings....other types will cause errors
        else if(typeof value === "string"){
            historyData[key] = value;
        }
    });

    //add history record
    if(typeof history === "undefined"){
        window.history.pushState({
            data: historyData,
            panelSelect: true
        },"");
    }

    //determine and set page title
    const title = (typeof ActionButton.data(Service.SYSTEM_TITLE) !== "undefined")
        ? ActionButton.data(Service.SYSTEM_TITLE)
        : ActionButton.data(Service.SYSTEM_ACTION);
    window.document.title = `${Service.Title} - ${title}`;

    //locate panel
    Service.FindElement(ActionButton.data(Service.SYSTEM_ACTION), ActionButton).then((panel) =>{
        //execute custom modifications
        Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),panel,ActionButton).then(() => {
            Service.LoadData(panel, ActionButton).then((success) => {
                const target =
                    (
                        typeof ActionButton.data(Service.SYSTEM_TARGET) !== "undefined" &&
                        ActionButton.data(Service.SYSTEM_TARGET) !== null &&
                        ActionButton.data(Service.SYSTEM_TARGET).length > 0
                    ) ? ActionButton.data(Service.SYSTEM_TARGET) : MainContainer;
                if(success){
                    //load panel unto the DOM
                    Service.LoadPanel(panel,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then((loadedPanel) =>{
                        //execute complete modifications
                        Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),loadedPanel,ActionButton).then(() => {
                            Service.LoadedPanel[target] = { ActionButton, LoadedPanel: loadedPanel };
                        });
                    });
                }else{
                    const container = jQuery("<div></div>");
                    container.append(Service.DefaultElementHandler(ActionButton));
                    Service.LoadPanel(container,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then((loadedPanel) =>{
                        Service.LoadedPanel[target] = { ActionButton, LoadedPanel: loadedPanel };
                    });
                }
                //remove action from loading list.......
                const index = Service.PanelLoading.indexOf(action);
                Service.PanelLoading.splice(index,1);
            });
        });
    });
});

/**
 * -- Reload Panel --
 * this function reloads the current panel
 */
Controller.AddProperty("ReloadPanel",function(target = null){
    if(target === null){
        target = MainContainer;
    }
    else if(typeof target !== "string"){
        target = jQuery(target).data("action");
    }

    if(typeof Service.LoadedPanel[target] === "undefined") return;
    const panel = Service.LoadedPanel[target].LoadedPanel;
    const btn = Service.LoadedPanel[target].ActionButton;
    Service.LoadData(panel, btn).then((success) => {
        if(success){
            Service.LoadPanel(panel, btn, target).then((loadedPanel) => {
                Service.ExecuteCustom(btn.data(Service.SYSTEM_COMPLETE),loadedPanel,btn).then(() => {
                    Service.LoadedPanel[target].LoadedPanel = loadedPanel;
                });
            });
        }else{
            const container = jQuery("<div></div>");
            container.append(Service.DefaultElementHandler(btn));
            Service.LoadPanel(container, btn, target).then((loadedPanel) =>{
                Service.LoadedPanel[target].LoadedPanel = loadedPanel;
            });
        }
    });
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
