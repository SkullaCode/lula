/**
 * -- Transformation --
 * Add a method to the transformation executor if you want it to be called during data binding.
 * use the 'data-action' attribute on the element that should be transformed to add the method(s)
 * that should be executed. if there needs to be more than one method called, use the pipe (|)
 * them. note that during binding only elements with the class 'bind' or 'bind-loop' will be considered
*/
Service.Transformation.Bootstrap = function(){

    let id = null;
    let timer = function(){
        if(window.Service.LoadingComplete === false){

        }
        else{
            clearInterval(id);
            window.Service.MetaData['NotificationType'] = 'toaster';
            //jQuery.ajaxSetup({headers: {"X-Session-Token": window.Service.MetaData.SessionToken }});
            //const defaultPanel = jQuery(`#${MainContainer}`).data(Service.SYSTEM_ACTION);
            //if(typeof defaultPanel !== "undefined"){
            //    Service.LoadPanel(Service.FindElement(`#${defaultPanel}`));
            //}
            Controller.PanelSelect(document.getElementById(`${MainContainer}`));
        }
    };
    id = setInterval(timer, 500);
};
