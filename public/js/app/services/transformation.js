/**
 * -- Transformation --
 * Add a method to the transformation executor if you want it to be called during data binding.
 * use the 'data-custom' attribute on the element that should be transformed to add the method(s)
 * that should be executed. if there needs to be more than one method called, use the pipe (|)
 * them. note that during binding only elements with the class 'bind' or 'bind-loop' will be considered.
 * Also, TRANSFORMATION WORKS TWO WAYS!!..... if 'bind-global' or 'bind-element' is present the
 * transformation will take place on the element and not the binding property. In other words, normal
 * transformation mutates the data property to be bounded to the element; 'bind-global' transforms the
 * element itself and provides the entire dataset; 'bind-element' transforms the element itself but
 * only provides the binding data property.
 */
Service.Transformation.AddMethod("capitalize",function(component){
    return (typeof component === "undefined" || component === null)
        ? "" : component.toUpperCase();
});
