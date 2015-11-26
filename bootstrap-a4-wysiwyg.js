// private scope
(function(){
    
    
    // constructor
    this.Wysiwyg = function(){
        
        
        // global element references
        this.wysiwygHeight = null;
        this.elementSize = null;
        this.toolBar = null;
        this.selectionString = null;
        
        
        // options
        var defaults = {
            wysiwygType: 'default',
            template: 'default',
            wysiwygChange: true,
            fontFamily: true,
            fontSize: true,
            fontWeight: true,
            fontStyle: true,
            color: true,
            background: true,
            listStyleType: true,
            textAlign: true,
            link: true,
            image: true,
            margin: true
        }
        
        // change default options by user options
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
    }
        
        
    // Public Methods

    Wysiwyg.prototype.select = function() {
        toggleToolBar.call(this);
        getSelectedText.call(this);
        initializeEvents.call(this);
        
    }

    // Private Methods

    function toggleToolBar() {

        var element;

        element = document.getElementsByClassName('wysiwyg-toolbar')[0];
        
        if (!this.toolBar){
            element.style.display = 'block';
            this.toolBar = true;
        }    

    }
    
    function getSelectedText () {
        
        if (window.getSelection) {  // all browsers, except IE before version 9

            Wysiwyg.selectionString = window.getSelection().getRangeAt(0);
              
        }
    }
    
    
    // wrap string
    function wrapSelectionString(tag, property, value){

        var element;
        var selection = Wysiwyg.selectionString;
        var selectedText = selection.extractContents();
        
        
        switch (tag) {
            case 'a':
                element = document.createElement(tag);
                element.setAttribute('href', value)
                element.setAttribute('class', property)
                element.appendChild(selectedText);
                selection.insertNode(element);
                break;
                
            case 'img':    
                element = document.createElement('span');
                element.setAttribute('class', property)
                element.appendChild(selectedText);
                selection.insertNode(element);
                break;
                
            default: 
                element = document.createElement(tag);
                element.style[property] = value;
                element.appendChild(selectedText);
                selection.insertNode(element);
            }
    
    }
    
    
    // unwrap string
    function unWrapSelectionString(tag){
        
        var node;
        var selection = Wysiwyg.selectionString;
        
        node = $(selection.commonAncestorContainer);
        if (node.parent().is(tag)) {
            node.unwrap();
        }else{
            return false;
        }
    
    }
    
    
    function wrap(tag, property, value){
    
        if(!unWrapSelectionString(tag)){
            wrapSelectionString(tag, property, value)
        }
    
    }



    // user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }
    

    function initializeEvents() {

        if (Wysiwyg.selectionString) {
            
            $('.wysiwyg-font-size').on('click', function(){
                wrap('span', 'fontSize', $(this).data('size'))
            });
            
            $('.wysiwyg-font-weight').on('click', function(){
                wrap('span', 'fontWeight', 'bold')
            });
            
            $('.wysiwyg-font-style').on('click', function(){
                
                console.log('fsgfd');
                wrap('span', 'fontStyle', 'italic')
            });
            
            $('.wysiwyg-color').on('click', function(){
                
                wrap('span', 'color', $(this).data('color'));
            });
            
            $('.wysiwyg-background').on('click', function(){

                wrap('span', 'backgroundColor', $(this).data('color'));
            });
            
            /**/
            
            $('.wysiwyg-text-align').on('click', function(){
                
                var type = $(this).find('span').attr('class');
                type = type.replace('glyphicon glyphicon-align-', '');

                wrap('p', 'textAlign', type);
            });
            
            /**/
            
            $('.wysiwyg-link').on('click', function(){

                $("#wysiwygLink").modal();
                wrap('a', 'new-wysiwyg-link', '#');
            });
            
            
            $('.wysiwyg-image').on('click', function(){
                
                $("#wysiwygImage").modal();
                wrap('img', 'new-wysiwyg-image', '');
            });
            
            $('.wysiwyg-save-image').on('click', function(){
                
                var element = $('.new-wysiwyg-image');
                var url = $('#wysiwygImage .wysiwyg-url').val();
                
                
                element.after('<img src="'+ url +'" alt="obrazek" />');
                element.remove('.new-wysiwyg-image');
            });
            
            $('.wysiwyg-save-link').on('click', function(){
                
                var element = $('.new-wysiwyg-link');
                var url = $('#wysiwygLink .wysiwyg-url').val();
                
                
                console.log(url);
                
                element.attr('href', url);
                element.removeAttr('class');
                
                /*if(element.parent().is('a')){
                    element.unwrap();
                }*/
            });
  
            
        }

    }
             

}());

var myWysiwyg = new Wysiwyg({
    template: 'flat'
});


var pageEditor = $('#wysiwygEditor');

pageEditor.on('mouseup', function() {
    myWysiwyg.select();
});

