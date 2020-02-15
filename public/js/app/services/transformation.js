/**
 * -- Transformation --
 * Add a method to the transformation executor if you want it to be called during data binding.
 * use the 'data-action' attribute on the element that should be transformed to add the method(s)
 * that should be executed. if there needs to be more than one method called, use the pipe (|)
 * them. note that during binding only elements with the class 'bind' or 'bind-loop' will be considered
*/
Service.Transformation.AddMethod("capitalize",function(component){
    return (typeof component === "undefined" || component === null)
        ? "" : component.toUpperCase();
});
