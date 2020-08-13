/**
 * -- Modification --
 * Add a method to the modification executor if you want it to be called after a panel or modal has
 * been loaded or form submitted. use the 'data-complete' attribute on the element triggering the 
 * action to add the method(s) that should be executed after loading is complete. if there needs 
 * to be more than one method called, use the pipe (|) character to separate them.
 */

Service.Modification.AddMethod("RedHeading",function(component){
    let header = jQuery(component).find("h1");
    header.css("color","red");
});

Service.Modification.Capitalize = function(component){
    let header = jQuery(component).find("h1");
    header.css("font-weight","bolder");
    header.css("font-variant-caps","all-petite-caps");
};

