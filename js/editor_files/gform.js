/**
 * @fileoverview jquery.pmgform.js
 * @brief jQuery plugin to create a context menu using the bootstrap styles 
 * @date 20120718
 * @version 0.1
 * @requires jQuery
*/
(function( $ ) {
    var methods = {
        /**
        * jQuery Method Function initialize plugin
        * 
        * @namespace Set as a success the mensage text
        * @function
        * @param {object} options.
        * @return value
        * @memberOf pmgbar
        */
        init : function( options ) {
                var settings = {
                    //Here all Settings
                    container: $(this),
                    id        : 'myModal',
                    title     : 'Modal Heading',
                    //width     : '100',
                    //height    : '200',
                    closable  :true,
                    animation :'hide fade in',
                    backdrop: 'static',
                    keyboard: true,
                    buttons   : [
                                 {
                                  title:'update',
                                  type :'default'
                                 },
                                 {
                                  title:'save',
                                  type :'primary',
                                  click : function( elem ){
                                      alert('form submited');                                      
                                      //var frm_element = document.getElementById (elem);
                                      //console.log(frm_element);
                                  }
                                 },
                                 {
                                  title:'cancel',
                                  type :'cancel'
                                 }
                                 
                                ]
                };  
                return this.each(function(){
                    if(options){
                        settings = $.extend(settings,options);
                    }
                    //HERE would be the code
                    //$(this).createModal(settings).pmvalidator();
                    $(this).createModal(settings);
                  
                });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmgform
     * @param {object} method object to create the status bar
     * @return  basic form
     * @memberOf jQuery.fn
     */
    $.fn.pmgform = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    
    $.fn.createModal = function( setting ) {
        var container = $(setting.container);

        //create modal
        //<div id="myModal" class="modal hide fade in" style="display: none;">
        var modal = $('<div>').addClass('modal '+setting.animation).attr({'id':setting.id, backdrop: 'static', keyboard: false});
        //modal header
        //<div class="modal-header">
        //    <button type="button" class="close" data-dismiss="modal">×</button>
        //    <h3>Modal Heading</h3>
        //</div>
        if (setting.closable === true || typeof setting.title != 'undefined'){
            var header =$('<div>').addClass('modal-header');
            if (setting.closable === true)
                header.append($('<button>').addClass('close').attr({type:'button', 'data-dismiss':'modal'}).text('x'));
            header.append($('<h3>').text(setting.title));
            modal.append(header);
        }


        //modal body
        //<div class="modal-body">
        //</div>
        var body =$('<div>').addClass('modal-body');
        //body.append('hola mundo');
        if(typeof setting.items != 'undefined' && setting.items !== null)
            body.pmformulario(setting.items);
        modal.append(body);

        //modal footer
        //<div class="modal-footer">
        //      <a href="#" class="btn" data-dismiss="modal">Close</a>
        //      <a href="#" class="btn btn-primary">Save changes</a>
        //</div>
        var footer =$('<div>').addClass('modal-footer');
        var bttns = setting.buttons;
        if (typeof bttns != 'undefined' && bttns !== null){
             for(var i=0; i<bttns.length; i++){
                switch(bttns[i].type){
                    case 'primary':
                        elem = bttns[i];
                        var button = $('<a>').addClass('btn btn-primary').text(elem.title);

//                        $(button).click(function(){
//                           //alert(setting.id);
//                           elem.click(setting.id);
//                        });
                        footer.append(button);
                        break;
                    case 'cancel':
                        footer.append($('<a>').addClass('btn').attr('data-dismiss', 'modal').text(bttns[i].title));
                        break;
                    default :
                        footer.append($('<a>').addClass('btn').text(bttns[i].title));
                        break;
                }
            }
        }
        modal.append(footer);

        //add all modal to container
        container.append(modal);

        $('#'+setting.id).modal({
            backdrop: setting.backdrop,
            keyboard: setting.keyboard,
            show:false
        });
        return this;
    };
    

     /*****************CREATE FORM ***********/ 
     var methodsForm = {
        init : function( options ) {
                var settings = {
                    //Here all Settings
                    container: $(this),
                    id        : 'formid',
                    name      : 'formulario'//,
//                    buttons   : [                                
//                                 {
//                                  title:'Save Changes',
//                                  type :'primary'
//                                 },
//                                 {
//                                  title:'cancel',
//                                  type :'cancel'
//                                 }
//                                ]     
                  
                };  
                return this.each(function(){
                    if(options){
                        settings = $.extend(settings,options);
                    }
                    //HERE would be the code
                    //console.log(settings.container);
                    $(this).createForm(settings);
                    
                    
                });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmgformulario
     * @param {object} method object to create the status bar
     * @return  basic form
     * @memberOf jQuery.fn
     */
    $.fn.pmformulario = function( method ) {
        if ( methodsForm[method] ) {
            return methodsForm[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsForm.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    
    /*****************CREATE FORM METHOD***********/ 
    $.fn.createForm = function( setting ) {
        //alert('comenzamos a crear el formulario');
        var container = $(setting.container);
        //console.log(container);
        //<form class="form-horizontal"></form>
        var form = $('<form>').addClass('form-horizontal').attr({id:setting.id, name:setting.name});
        
        // <fieldset> </fieldset>
        var fieldset = $('<fieldset>');
        
        if( typeof setting.items != 'undefined' && setting.items !== null ) {
            var elements=setting.items;
            //console.log(elements);
            for(var i=0; i<elements.length; i++){
                //alert('hola');
                switch(elements[i].type){
                    case 'text': case 'password':
                        //alert(elements[i].type);
                        fieldset.pmtextfield(elements[i]);                      
                        break;
                    case 'checkbox':
                        fieldset.pmcheckbox(elements[i]);
                        break;
                    case 'combobox':
                        fieldset.pmcombobox(elements[i]);
                        break;
                    case 'inputfile':
                        fieldset.pminputfile(elements[i]);
                        break;
                    case 'textarea':
                        fieldset.pmtextarea(elements[i]);
                        break;
                    case 'radiobutton':
                        fieldset.pmradiobutton();
                        break;
                }
            }
            
            //create textfield whit help
            //fieldset.pmtextfield({help:true});

            //create non editable textfield
            //fieldset.pmtextfield({editable:false});

            //create disabled textfield
            //fieldset.pmtextfield({disabled:true});

            //create focused textfield
            //fieldset.pmtextfield({focused:true,value:'This is focused…'});

            //create checkbox
            //fieldset.pmcheckbox({items     :[['Option one is this and that—be sure to include why it\'s great','item1']]});

            //create inline checkbox
            //fieldset.pmcheckbox({inline:true});

            //create combobox
            //fieldset.pmcombobox();

            //create combolist
            //fieldset.pmcombobox({label:'multiselect',multiple:true});

            //create imputfile
            //fieldset.pminputfile();

            //create text area
            //fieldset.pmtextarea();

            //create radio button
            //fieldset.pmradiobutton();
            //create inline radio button
            //fieldset.pmradiobutton({inline:true});


            //Add buttons to form
            //'<div class="form-actions">'+
            //      '<button type="submit" class="btn btn-primary">Save changes</button>'+
            //      '<button class="btn">Cancel</button>'+
            //'</div>'
            var bttns = setting.buttons;
            if (typeof bttns != 'undefined' && bttns !== null){
               var temp =$('<div class="form-actions">');
                for(i=0; i<bttns.length; i++){
					if (bttns[i].type == 'primary'){
						temp.append($('<button>').addClass('btn btn-primary').attr('type','submit').text(bttns[i].title));
					} else {
						temp.append($('<button>').addClass('btn').text(bttns[i].title));
					}

                }
                fieldset.append(temp);
            }
        }

        form.append(fieldset);
               
        //add all form to container
        container.append(form);
        return this;
    };

    /*****************CREATE COMPONENTS METHOD***********/
    $.fn.createComponent = function( setting , type) {
        var container = $(setting.container);
        //create controls of components
        // <div class="control-group">
        //    <label class="control-label" for="input01">Text input</label>
        //    <div class="controls">
        //    </div>
        //  </div>
        var component = $('<div>').addClass('control-group');
        var label = $('<label>').addClass('control-label').attr('for', 'input01').text(setting.label);
        component.append(label);
        var control = $('<div>').addClass('controls');
        switch(type){
            case 'text': case 'password':
                //alert('tenemos un textfield');
                //      <input type="text" class="input-xlarge" id="input01">
                //      <p class="help-block">In addition to freeform text, any HTML5 text-based input appears like so.</p>
                //alert(type)
                
                var input = $('<input>').addClass('input-'+setting.wtype).attr({type:type,id:setting.id});
                if (typeof setting.disabled !== undefined && setting.disabled){
                    // <input class="input-xlarge disabled" id="disabledInput" type="text" placeholder="Disabled input here…" disabled="">
                  input = $('<input>').addClass('input-'+setting.wtype).attr({type:type,id:setting.id, placeholder:setting.placeHolder, disabled:''});
                }
                if (typeof setting.editable !== undefined && !setting.editable){
                    //<span class="input-xlarge uneditable-input">Some value here</span>
                    input = $('<span>').addClass('input-'+setting.wtype+' uneditable-input').text('Some value here');
                }
                if (typeof setting.focused !== undefined && setting.focused){
                    //<input class="input-xlarge focused" id="focusedInput" type="text" value="This is focused…">
                     input = $('<input>').addClass('input-'+setting.wtype+' focused').attr({type:type,id:setting.id, value:setting.value});
                }
                input.data('gtype', setting.gtype); //setting gtype
                input.data('requiered', setting.requiered); //setting gtype
                control.append(input);

                if (typeof setting.help !== undefined && setting.help){
                    var help = $('<p>').addClass('help-block').text(setting.helpText);
                    control.append(help);
                }
                
                break;
            case 'checkbox':
                //alert('tenemos un checkbox');
                //<label class="checkbox">
                //    <input type="checkbox" id="optionsCheckbox" value="option1">
                //    Option one is this and that—be sure to include why it's great
                //</label>
                
                var inline='';
                if (typeof setting.inline !== undefined && setting.inline){
                    //
                    inline =' inline';
                }
                var items = setting.items;
                for(var i=0; i<items.length; i++){
                   // alert(data[i][1]);
                    var check = $('<label>').addClass('checkbox'+inline); 
                    check.append($('<input>').attr({type:'checkbox',value:items[i][1], id:setting.id+i}));
                    check.append(items[i][0]);
                    control.append(check);
                }
               // control.append(check);
                
                break;
            case 'combobox':
                //alert('tenemos un combobox');
                //<select id="select01">
                //    <option>something</option>
                //    <option>2</option>
                //    <option>3</option>
                //    <option>4</option>
                //    <option>5</option>
                //</select>
                var combobox = $('<select>').attr('id',setting.id);
                if (typeof setting.span != 'undefined' && setting.span)
                    combobox = $('<select>').addClass(setting.span).attr('id',setting.id);
                if (typeof setting.multiple != 'undefined' && setting.multiple)
                       combobox.attr('multiple','multiple');
                var data = setting.items;
                //console.log(data.length);
                for(i=0; i<data.length; i++)
                    combobox.append($('<option>').attr('value',data[i][0]).text(data[i][1]));
                //alert(data[i]);
                //check.append($('<input>').attr({type:'checkbox',id:setting.id}));
                //check.append(setting.optionLabel);
                control.append(combobox);
                
                break;
            case 'inputfile':
                //alert('tenemos un inputfile');
                //<input class="input-file" id="fileInput" type="file">
                var inputFile = $('<input>').addClass('input-file').attr({id:setting.id,type:'file'});
                control.append(inputFile);
                
                break;
            case 'textarea':
                //alert('tenemos un textarea');
                //<textarea class="input-xlarge" id="textarea" rows="3"></textarea>
                var textArea = $('<textarea>').addClass('input-xlarge').attr({id:setting.id,rows:setting.rows});
                control.append(textArea);
                break;
            case 'radiobutton':
                //alert('tenemos un checkbox');
                //<label class="checkbox">
                //    <input type="checkbox" id="optionsCheckbox" value="option1">
                //    Option one is this and that—be sure to include why it's great
                //</label>
                
                inline='';
                if (typeof setting.inline !== undefined && setting.inline){
                    //
                    inline =' inline';
                }
                items = setting.items;
                for(i=0; i<items.length; i++){
                   // alert(data[i][1]);
                    var checkR = $('<label>').addClass('radio'+inline); 
                    checkR.append($('<input>').attr({type:'radio',value:items[i][1], id:setting.id+i, name:setting.name}));
                    checkR.append(items[i][0]);
                    control.append(checkR);
                }
               // control.append(check);
                
                break;
            default:
                break;
        }
        
        
        
        component.append(control);
        container.append(component);
        return this;
    };

    
    /***********TEXT FIELD****************/
    var methodsTextField = {
        init : function( options ) {
                var settings = {
                    //Here all Settings
                    container: $(this),
                    id        : 'textArea1',
                    name      : 'textField',
                    label     : 'textField',
                    help      : false,
                    helpText  : 'In addition to freeform text, any HTML5 text-based input appears like so.',
                    disabled   : false,
                    placeHolder: 'Disabled Input here',
                    editable   : true,
                    focused    : false,
                    value      : '',
                    wtype      : 'xlarge', //mini,small,medium,large,xlarge
                    requiered    : false,
                    gtype       : 'email' //varchar,email,number
                };  
                return this.each(function(){
                    if(options){
                        settings = $.extend(settings,options);
                    }
                    //HERE would be the code
                    //console.log(settings.container);
                    
                    $(this).createComponent(settings,settings.type);
                   
                    
                });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmtextfield
     * @param {object} method object to create the status bar
     * @return  basic TextArea
     * @memberOf jQuery.fn
     */
    $.fn.pmtextfield = function( method ) {
        if ( methodsTextField[method] ) {
            return methodsTextField[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsTextField.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };

    /***********CHECKBOX****************/
    var methodsCheckbox = {
        init : function( options ) {
            var settings = {
                //Here all Settings
                container: $(this),
                id        : 'checkbox',
                name      : 'checkbox',
                label     : 'checkbox',
                //optionLabel      : 'Option one is this and that—be sure to include why it\'s great',
                inline    : false,
                items     :[[1,'item1'],[2,'item2']] 
            };
            return this.each(function(){
                if(options){
                    settings = $.extend(settings,options);
                }
                //HERE would be the code
                //console.log(settings.container);
                $(this).createComponent(settings,'checkbox');
                  
            });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmcheckbox
     * @param {object} method object to create the status bar
     * @return  basic TextArea
     * @memberOf jQuery.fn
     */
    $.fn.pmcheckbox = function( method ) {
        if ( methodsCheckbox[method] ) {
            return methodsCheckbox[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsCheckbox.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    
     /***********RADIO BUTTON****************/
    var methodsRadioButton = {
        init : function( options ) {
            var settings = {
                //Here all Settings
                container: $(this),
                id        : 'radiobutton',
                name      : 'radiobutton',
                label     : 'Radio Button',
                //optionLabel      : 'Option one is this and that—be sure to include why it\'s great',
                inline    : false,
                items     :[[1,'item1'],[2,'item2']]

            };  
            return this.each(function(){
                if(options){
                    settings = $.extend(settings,options);
                }
                //HERE would be the code
                //console.log(settings.container);
                $(this).createComponent(settings,'radiobutton');
                  
            });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmradiobutton
     * @param {object} method object to create the status bar
     * @return  basic TextArea
     * @memberOf jQuery.fn
     */
    $.fn.pmradiobutton = function( method ) {
        if ( methodsRadioButton[method] ) {
            return methodsRadioButton[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsRadioButton.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    
    /***********COMBOBOX****************/
    var methodsComboBox = {
        init : function( options ) {
            var settings = {
                //Here all Settings
                container: $(this),
                id        : 'combobox01',
                name      : 'combobox',
                label     : 'combobox',
                multiple  : false,
                fields: ['id', 'items'],
                items: [[1, 'item1'], [2, 'item2']]
                //span      : 'span3' //span1,span2,span3 (optional)
                
            };  
            return this.each(function(){
                if(options){
                    settings = $.extend(settings,options);
                }
                //HERE would be the code
                //console.log(settings.container);
                $(this).createComponent(settings,'combobox');
                  
            });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmtextarea
     * @param {object} method object to create the status bar
     * @return  basic TextArea
     * @memberOf jQuery.fn
     */
    $.fn.pmcombobox = function( method ) {
        if ( methodsComboBox[method] ) {
            return methodsComboBox[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsComboBox.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };

    /***********INPUT FILE****************/
    var methodsInputFile = {
        init : function( options ) {
            var settings = {
                //Here all Settings
                container: $(this),
                id        : 'fileImput',
                name      : 'fileImput',
                label     : 'File input'
            };  
            return this.each(function(){
                if(options){
                    settings = $.extend(settings,options);
                }
                //HERE would be the code
                //console.log(settings.container);
                $(this).createComponent(settings,'inputfile');
                  
            });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmtextarea
     * @param {object} method object to create the status bar
     * @return  basic TextArea
     * @memberOf jQuery.fn
     */
    $.fn.pminputfile= function( method ) {
        if ( methodsInputFile[method] ) {
            return methodsInputFile[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsInputFile.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    
    /***********TEXT AREA***************/
    var methodsTextArea = {
        init : function( options ) {
            var settings = {
                //Here all Settings
                container: $(this),
                id        : 'textarea',
                name      : 'textarea',
                label     : 'Text Area',
                rows      : 3
            };  
            return this.each(function(){
                if(options){
                    settings = $.extend(settings,options);
                }
                //HERE would be the code
                //console.log(settings.container);
                $(this).createComponent(settings,'textarea');
                  
            });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmtextarea
     * @param {object} method object to create the status bar
     * @return  basic TextArea
     * @memberOf jQuery.fn
     */
    $.fn.pmtextarea= function( method ) {
        if ( methodsTextArea[method] ) {
            return methodsTextArea[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsTextArea.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    
    
    
    
    
    
    
    
    
    var methodsValidate = {
        init : function( options ) {
                var settings = {
                    //Here all Settings
   
                  
                };  
                return this.each(function(){
                    if(options){
                        settings = $.extend(settings,options);
                    }
                    //HERE would be the code
                    //console.log(settings.container);
                    $('input[type="text"]').keydown(function(event) {
                         var elem = $(this);
                         if (elem.data('number')){
                             if(event.keyCode < 48 || event.keyCode > 57)  {
                                if(event.keyCode == 13 || event.keyCode == 9 || event.keyCode == 9 || event.keyCode == 10)
                                    return true;
                                else
                                    return false;
                            } 
                         }
                    });
                    
                    $('input[type="password"]').focusout(function(){
                        var elem = $(this);
                        var parent = elem.parent().parent();
                        var cls =   parent.attr('class').split(' ')[0];
                        
                        var requiered = elem.data('requiered');

                        //var gtype = elem.data('gtype');
                        var hasError =false;
                        var fieldVal = elem.val();

                        //verify if is requiered
                        if (requiered){
                             if(fieldVal === '') {
                                hasError = true;
                             }
                        }
                        if(hasError === true) { 
                            $(parent).addClass(cls + ' '+'error'); //<div class="control-group error">
                        } else {
                            $(parent).attr('class',cls); //<div class="control-group">
                        }
                    });
                    
                    $('input[type="text"]').focusout(function(){
                        //alert('aqui llegamos');
                        var elem = $(this);
                        var parent = elem.parent().parent();
                        var cls =   parent.attr('class').split(' ')[0];
                        
                        var requiered = elem.data('requiered');
                        var gtype = elem.data('gtype');
                        var hasError =false;

                        var fieldVal = elem.val();

                        //verify if is requiered
                        if (requiered){
                             if(fieldVal === '') {
                                hasError = true;
                             }
                        }
                        if (gtype == 'email'){
                            //var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; // regular expresion for validation
                                //verify if is correct email
                                 if(fieldVal === '') {
                                    hasError = true;
                                }
                                else if(!emailReg.test(fieldVal)) {
                                 //$("#UserEmail").after('<span class="error">Enter a valid email address.</span>');
                                    hasError = true;
                                }
						}

                        if(hasError === true) { 
                            $(parent).addClass(cls + ' '+'error'); //<div class="control-group error">
                        } else {
                            $(parent).attr('class',cls); //<div class="control-group">
                        }
                    });
                    
                });
        },
        example : function(a , b){}
    };
    /**
     *
     * @class pmgformulario
     * @param {object} method object to create the status bar
     * @return  basic form
     * @memberOf jQuery.fn
     */
    $.fn.pmvalidator = function( method ) {
        
        if ( methodsValidate[method] ) {
            return methodsValidate[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methodsValidate.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }
    };
    

})( jQuery );