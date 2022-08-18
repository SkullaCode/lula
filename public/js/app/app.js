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
    let target = ActionButton.data(Service.SYSTEM_TARGET);
    let custom = ActionButton.data(Service.SYSTEM_CUSTOM);
    let complete = ActionButton.data(Service.SYSTEM_COMPLETE);
    let requestHeaders = ActionButton.data(Service.SYSTEM_HEADERS);
    let form = [];
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
        if (target.substring(0, 1) !== "#") target = `#${target}`;
        const targetContainer = jQuery(document).find(target);
        form = (targetContainer.is("form")) ? targetContainer : targetContainer.find("form");
        if (form.length > 0) {
            Service.LoadedForm = form;
            form.attr("action",form.data("action"));
            form.attr("method",form.data("method"));
        } else {
            //No form detected......lets build one.
            const formContent = targetContainer.clone();
            form = jQuery("<form></form>",
                {
                    action: targetContainer.data("action"),
                    method: targetContainer.data("method")
                });
            form.append(formContent.children());
            //jQuery does not clone selects.....say its to expensive
            const selects = targetContainer.find("select");
            jQuery(selects).each(function (i) {
                form.find("select").eq(i).val(jQuery(this).val());
            });
            //we use the target as the loaded form
            //Form object used to retrieve data
            Service.LoadedForm = targetContainer;
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
    data = jQuery(form.serializeArray());
    jQuery.each(data,function(){
        params.append(this.name,this.value);
    });
    site_url = form[0].action;
    method = form[0].method;

    if(typeof site_url === "undefined") return false;
    if(typeof method === "undefined") method = "POST";
    method = method.toUpperCase();

    //determine if the form has a file, and if so serialize
    //using FormData object, or just use an object
    const file = form.find("input[type='file']");
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
    Service.ServerRequest(requestData);
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
        Service.FindElement(action, ActionButton).then((elem) =>{
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
            //execute custom modifications
            Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),Service.LoadedModal,ActionButton).then(() => {
                // launch modal
                Service.LaunchModal(Service.LoadedModal,ActionButton).then(() => {
                    //execute complete modifications
                    Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),Service.LoadedModal,ActionButton).then(() => {
                        Service.ModalLoading = false;
                    });
                });
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
    //locate panel
    Service.FindElement(ActionButton.data(Service.SYSTEM_ACTION), ActionButton).then((panel) =>{
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
        //execute custom modifications
        Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),Service.LoadedPanel,ActionButton).then(() => {
            //load panel unto the DOM
            Service.LoadPanel(panel,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then(() =>{
                //execute complete modifications
                Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),Service.LoadedPanel,ActionButton).then(() => {
                    //remove action from loading list.......
                    const index = Service.PanelLoading.indexOf(action);
                    Service.PanelLoading.splice(index,1);
                });
            });
        });
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
