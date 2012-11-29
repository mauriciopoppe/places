/**
 * @fileoverview jquery.pmsbar.js
 * @brief jQuery plugin to create a context menu using the bootstrap styles 
 * @date 20120712
 * @version 0.1
 * @requires jQuery
*/
(function( $ ) {
    /*
    * Each method expects the "this" object to be a valid DOM text input node.
    * The methods "enable", "disable" and "destroy" expects an instance of a
    * BetterAutocomplete object as their first argument.
    */
    var methods = {
        /**
        * jQuery Method Function initialize plugin
        * 
        * @namespace Set as a success the mensage text
        * @function
        * @param {object} options.
        * @return value
        * @memberOf pmsbar
        */
        init : function( options ) {
            
                var settings = {
                    //Here all Settings
                    container: '#'+$(this).attr("id"),
                    click : null
                };  
                return this.each(function(){
                    if(options){
                        settings = $.extend(settings,options);
                    }
                    methods.createsbar(settings);
                    //HERE would be the code
                    //$('.dropdown-toggle').dropdown();
                    $(".dropdown-item").click(function(){
                        var id="#"+$(this).attr("id");
                        var parent=$(this).parent(); 
                        var resp=$(id).html();
                        var parentul=$(parent).parent();
                        var idul = '#'+$(parentul).attr("id");
                        //alert($(parentul).attr("id"));
                        $(idul+' li').each(function(index) {
                            $(this).attr("class","");
                            //alert(index + ': ' + $(this).text());
                        });
                        $(parent).attr("class","active");
                        $("#label-drop").html(resp);
                        
                       var data =options.items;
                       var ref=$(this).attr("index");
                       if(typeof ref != "undefined" && ref !== null){
                             if(typeof data != "undefined" && data !== null){
                                 data[ref].click.call(this,$(this).attr("id"));
                             }
                       }
                    });
                    //click button events
                    $('.btn').click(function(){
                        var data =options.items;
                        var ref=$(this).attr("index");
                         if(typeof ref != "undefined" && ref !== null){
                             if(typeof data != "undefined" && data !== null){
                                  data[ref].click.call(this,$(this).attr("idbtn"));                                  
                              }
                         }
                         // for a group of buttons
                         var ref1=$(this).attr("index1");
                         if(typeof ref1 != "undefined" && ref1 !== null){
                             var  data2=data[ref1].items;
                              var ref2=$(this).attr("index2");
                              if(typeof ref2 != "undefined" && ref2 !== null){
                                 if(typeof data2 != "undefined" && data2 !== null){

                                      data2[ref2].click.call(this,$(this).attr("idbtn"));                                  
                                  }
                             }
                         }
                    });
                });
        },
        /**
        * jQuery Method Function to set like a success the status 
        * 
        * @namespace Set as a success the mensage text
        * @function
        * @param {string} message.
        * @return value
        * @memberOf pmsbar
        */
        succes : function( message) {
            //alert(message);
            $("#sbar-result").empty();
            var resp =$('<span class="label label-success">'+message+'</span>');
            //$("#sbar-result").add("span").addClass("label label-succes").text(message);
           $(resp).appendTo("#sbar-result");
            //
            setTimeout(function(){
                $("#sbar-result").fadeOut(700,function(){
                    $("#sbar-result").empty();
                    var resp =$('<span class="label label-success">Ready</span>');
                    $(resp).appendTo("#sbar-result");
                    $("#sbar-result").fadeIn(700);
                });
            },4000);
        },
        /**
        * jQuery Method Function to set like a failure the status 
        * 
        * @namespace Set as a failure the mensage text
        * @function
        * @param {string} message.
        * @return value
        * @memberOf pmsbar
        */
        failure : function(message) {
            $("#sbar-result").empty();
            var resp =$('<span class="label label-important">'+message+'</span>');
            $(resp).appendTo("#sbar-result");
            
            setTimeout(function(){
                $("#sbar-result").fadeOut(700,function(){
                    $("#sbar-result").empty();
                    var resp =$('<span class="label label-success">Ready</span>');
                    $(resp).appendTo("#sbar-result");
                    $("#sbar-result").fadeIn(700);
                });
            },4000);
        },
        /**
        * jQuery Method Function to get the status bar .
        * 
        * @namespace create status bar
        * @function
        * @param {object} options.
        * @return value
        * @memberOf pmsbar
        */

        createsbar : function(options) {
//            var id= options.id;
//            var cls = options.cls;
//            var name = options.name;
            var containerId=options.id;
            //alert(containerId);       
            var html = '<div class="navbar">' +
                        '<div class="navbar-inner">'+
                           '<div class="container" id="'+containerId+'">'+
                               '<ul class="nav">'+
                     //+              '<li><a href="#" id="sbar-result"><span class="label label-success">Ready</span></a></li> '
                                   '<li><a  href="#" id="sbar-result"><image src="/img/loading.gif" style="width:20px;height:20px;">&nbsp;</a></li> '+
                               '</ul>'+
                           '</div>'+
                        '</div>'+
                      '</div>';
            //
            // Create a <div> element with an id of "foo",
            // a class of "bar" and bind a mouseover event
            // handler to it:
//            var divElement = jQuery('<div/>', {
//                'class': 'navbar-inner'
// 
//            });
            
            $(html).appendTo(options.container);
//            divElement.appendTo(options.container)
            var data=options.items;
            btn='';
            if (typeof data != 'undefined' && data !== null){
               for (var i=0; i<data.length; i++){
                    switch(data[i].type){
                        case 'buttonGroup' :
                            //alert('es un grupo de botones');
                            btn += (data[i].align=='right') ? '<ul class="nav pull-right">':'<ul class="nav">';
                            btn += '<li>';
                            btn +=      '<div class="btn-group">';
                            var groups=data[i].items;
                            for (var j=0; j<groups.length; j++){
                                
                                switch (groups[j].type){
                                    case 'dropdown' :
//                                         btn += '<li>';
//                                         btn +=      '<div class="btn-group">';
//                                         btn +='<button class="btn">'
//                                             +   '100%'
//                                             +'</button>'
//                                             +'<button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
//                                             +'<ul class="dropdown-menu">';
//                                         dropdowns=groups[j].items;
//                                         for (var k=0; k<dropdowns.length; k++){ 
//                                            btn +=    ' <li><a href="#">'+dropdowns[k].label+'</a></li>';
//                                         }
//                                         btn +='</ul>';
//                                         btn +=      '</div>';
//                                         btn += '</li>';
                                        break;
                                    case 'button' :
//                                        btn += '<li>';
//                                        btn += '<div class="btn-group">';
                                          btn +='<a class="btn" href="#" idbtn="'+groups[j].id+'" index1="'+i+'"  index2="'+j+'"><i class="'+groups[j].cls+'"></i>'+groups[j].label+'</a>';
                                        break;
                                }
                            }
                            btn +=      '</div>';
                            btn += '</li>';
                            btn += '</ul>';
                            break;
                        case 'button':
                            //alert('son botones');
                            btn += (data[i].align=='right') ? '<ul class="nav pull-right">':'<ul class="nav">';
                            btn += '<li>';
                                        btn += '<div class="btn-group">';
                                        // btn +='<button class="btn"><span class="con-refresh"></span>'
                                        //      +   '<image src="/img/document.png">'
                                        //      +
                                        //     +'</button>';
                                        btn +='<a class="btn" href="#" idbtn="'+data[i].id+'" index="'+i+'"><i class="'+data[i].cls+'"></i>'+data[i].label+'</a>';
                                        //btn +=' <a class="btn" href="#"><i class="icon-refresh"></i></a>';
                                        btn +=      '</div>';
                                        btn += '</li>';
                            btn += '</ul>';
                            break;
                        case 'dropdown':
                            dropdowns=data[i].items;
                            btn += (data[i].align=='right') ? '<ul class="nav pull-right">':'<ul class="nav">';
                            btn += '<li>';
                            btn +=      '<div class="btn-group">';
                                         btn +='<button class="btn"><i class="'+data[i].cls+'"></i>';
                                         btn +=  '<span id="label-drop">'+dropdowns[data[i].selected].label+'</span>';
                                         btn +='</button>';
                                         btn +='<button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>';
                                         btn +='<ul class="dropdown-menu" id="dm-'+i+'">';
                                         for (var k=0; k<dropdowns.length; k++) {
                                                btn += (k==data[i].selected) ? '<li class="active">':'<li>';
                                                btn +=    '<a href="#" class="dropdown-item" id="'+dropdowns[k].id+'" index="'+i+'">'+dropdowns[k].label+'</a></li>';
                                         }
                                         btn +='</ul>';
                                         btn +='</div>';
                            
                            btn += '</li>';
                            btn += '</ul>';
                            break;
                        default :
                            console.log('the kind of type is not contempled');
                            break;

                    }
               }
               
               $(btn).appendTo("#"+containerId);
            }
        }, 
        example : function(a , b){}
    };

     /**
     * A jQuery Wrapper Function to append Wiki formatted text to a DOM object
     * converted to HTML.
     * 
     * @class pmsbar
     * @param {object} method object to create the status bar
     * @return  status bar
     * @memberOf jQuery.fn
     */
    $.fn.pmsbar = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exsts!' );
        }    
    };
})( jQuery );