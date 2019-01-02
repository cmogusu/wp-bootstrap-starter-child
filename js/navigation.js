jQuery( function ( $ ) {
    'use strict';
    // here for each comment reply link of wordpress
    $( '.comment-reply-link' ).addClass( 'btn btn-primary' );

    // here for the submit button of the comment reply form
    $( '#commentsubmit' ).addClass( 'btn btn-primary' );

    // The WordPress Default Widgets
    // Now we'll add some classes for the wordpress default widgets - let's go

    // the search widget
    $( '.widget_search input.search-field' ).addClass( 'form-control' );
    $( '.widget_search input.search-submit' ).addClass( 'btn btn-default' );
    $( '.variations_form .variations .value > select' ).addClass( 'form-control' );
    $( '.widget_rss ul' ).addClass( 'media-list' );

    $( '.widget_meta ul, .widget_recent_entries ul, .widget_archive ul, .widget_categories ul, .widget_nav_menu ul, .widget_pages ul, .widget_product_categories ul' ).addClass( 'nav flex-column' );
    $( '.widget_meta ul li, .widget_recent_entries ul li, .widget_archive ul li, .widget_categories ul li, .widget_nav_menu ul li, .widget_pages ul li, .widget_product_categories ul li' ).addClass( 'nav-item' );
    $( '.widget_meta ul li a, .widget_recent_entries ul li a, .widget_archive ul li a, .widget_categories ul li a, .widget_nav_menu ul li a, .widget_pages ul li a, .widget_product_categories ul li a' ).addClass( 'nav-link' );

    $( '.widget_recent_comments ul#recentcomments' ).css( 'list-style', 'none').css( 'padding-left', '0' );
    $( '.widget_recent_comments ul#recentcomments li' ).css( 'padding', '5px 15px');

    $( 'table#wp-calendar' ).addClass( 'table table-striped');

    // Adding Class to contact form 7 form
    $('.wpcf7-form-control').not(".wpcf7-submit, .wpcf7-acceptance, .wpcf7-file, .wpcf7-radio").addClass('form-control');
    $('.wpcf7-submit').addClass('btn btn-primary');

    // Adding Class to Woocommerce form
    $('.woocommerce-Input--text, .woocommerce-Input--email, .woocommerce-Input--password').addClass('form-control');
    $('.woocommerce-Button.button').addClass('btn btn-primary mt-2').removeClass('button');

    // Fix woocommerce checkout layout
    $('#customer_details .col-1').addClass('col-12').removeClass('col-1');
    $('#customer_details .col-2').addClass('col-12').removeClass('col-2');
    $('.woocommerce-MyAccount-content .col-1').addClass('col-12').removeClass('col-1');
    $('.woocommerce-MyAccount-content .col-2').addClass('col-12').removeClass('col-2');

    // Add Option to add Fullwidth Section
    function fullWidthSection(){
        var screenWidth = $(window).width();
        if ($('.entry-content').length) {
            var leftoffset = $('.entry-content').offset().left;
        }else{
            var leftoffset = 0;
        }
        $('.full-bleed-section').css({
            'position': 'relative',
            'left': '-'+leftoffset+'px',
            'box-sizing': 'border-box',
            'width': screenWidth,
        });
    }
    fullWidthSection();
    $( window ).resize(function() {
        fullWidthSection();
    });

    // Allow smooth scroll
    $('.page-scroller').on('click', function (e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 1000, 'swing');
    });


    function onDropdownHover( event, _this, isOpening ){
        event.preventDefault();
        event.stopPropagation();

/*
        if( $(_this).hasClass('dropdown-menu') || $(_this).hasClass('dropdown-submenu') ){
            $(_this).children('ul').css( 'top', $(_this).children('a').position().top );
        }
*/
        $(_this).siblings().removeClass('open');
        isOpening ? $(_this).addClass('open') : $(_this).removeClass('open');
    }

    $('ul.dropdown-menu').removeClass('open');
    $('#masthead').find('.dropdown').hover( function(event){
        onDropdownHover( event, this, true )
    },function(event){
        onDropdownHover( event, this, false )
    });

    setUpDrawerMenu(jQuery);
    searchModal(jQuery);
});

function setUpDrawerMenu( $ ){
    var wpsNav = {
        elements : {
            wrapper : 'wps-drawer-nav',
            originalMenu : 'wps-main-menu',
            menu : 'drawer-menu',
            iscroll : 'iscroll-wrapper',
            drawerHeader : 'wps-drawer-header',
            drawerScroller : 'wps-drawer-scroller',
            drawerFooter : 'wps-drawer-footer',
            adminMenu : 'wpadminbar',
        },
        wrapperElement : [],
        originalMenuElement : [],
        menuElement : [],
        iscrollElement : [],


        init : function(){
            this.setElements();
            this.toggleDropdown = this.toggleDropdown.bind(this);
            this.setScrollerHeight = this.setScrollerHeight.bind(this);

            if( this.menuElement.length<1 ){
                $('.wps-menu-toggle').hide();
                return false;
            }

            $('body').addClass('drawer drawer--left');

            this.setScrollerHeight();
            this.copyNav();
            this.addEventHandlers();
            this.initScroller();
            this.wrapperElement.css('opacity',1);
        },


        setElements : function(){
            this.wrapperElement = $( '.'+this.elements.wrapper );
            this.originalMenuElement = $( '.'+this.elements.originalMenu );
            this.menuElement = $( '.'+this.elements.menu );
            this.iscrollElement = $( '.'+this.elements.iscroll );
            this.adminMenuElement = $('#'+this.elements.adminMenu );

            this.drawerHeaderElement = $( '.'+this.elements.drawerHeader );
            this.drawerScrollerElement = $( '.'+this.elements.drawerScroller );
            this.drawerFooterElement = $( '.'+this.elements.drawerFooter );
        },


        setScrollerHeight : function(){
            var adminMenuHeight = this.adminMenuElement.length>0 ? this.adminMenuElement.outerHeight() : 0;
            var wrapperHeight = $(window).innerHeight() - adminMenuHeight;
            var headerHeight = this.drawerHeaderElement.outerHeight();
            var footerHeight = this.drawerFooterElement.outerHeight();

            var scrollerHeight = wrapperHeight - (headerHeight+footerHeight);

            this.wrapperElement.css('top',adminMenuHeight).height( wrapperHeight )
            this.drawerScrollerElement.height( scrollerHeight );
        },


        copyNav : function(){
            var editListClasses = function(){
                $(this).removeClass('nav-item menu-item')
                .find('a').removeClass('nav-link').removeAttr('data-toggle aria-haspopup').addClass('drawer-menu-item')
                .children('span').removeClass('caret').addClass('fa fa-plus')
                .end()
                .siblings('ul').removeClass('dropdown-menu').addClass('drawer-dropdown-menu')
                .children('li').each( editListClasses );
            };

            this.menuElement.children('li').each( editListClasses )
        },


        addEventHandlers : function(){
            $('body').on('drawer.opened', this.setScrollerHeight )

            if( this.menuElement.length<1 ){
                return false;
            }

            this.menuElement.find('a.dropdown-toggle').on('click', this.toggleDropdown )
        },


        toggleDropdown : function( event ){
            var target = $(event.currentTarget);
            var isOpen = target.data('isOpen') === true;

            if( isOpen ){
                target.parent().removeClass('open')
                .end()
                .children('.fa').removeClass('fa-minus').addClass('fa-plus');
            }else{
                target.parent().addClass('open')
                .end()
                .children('.fa').removeClass('fa-plus').addClass('fa-minus');
            }

            target.data('isOpen', !isOpen);
            $('body').trigger( 'refresh.iscroll' )
        },


        initScroller : function(){
            if( this.iscrollElement.length<1 ){
                return false;
            }

            $('.drawer').drawer({
                class: {
                    nav: 'drawer-nav-wrapper',
                    toggle: 'wps-toggle',
                    overlay: 'drawer-overlay',
                    open: 'drawer-open',
                    close: 'drawer-close',
                    dropdown: 'drawer-dropdown',
                    iscroll : this.elements.iScroll,
                },
                iscroll: {
                    // Configuring the iScroll
                    // https://github.com/cubiq/iscroll#configuring-the-iscroll
                    mouseWheel: true,
                    preventDefault: false
                },
                showOverlay: true
            });
        }
    }


    wpsNav.init();
}


function searchModal( $ ){
    var searchWrapper = $('.wps-search-wrap');
    var searchInput = searchWrapper.find('.wps-search-input');
    var closeButton = searchWrapper.find('.wps-close-button');
    var openButton = $('.wps-social-nav .wps-toggle-search')

    openButton.on('click',function(){
        searchWrapper.addClass('show');
    })

    closeButton.on('click',function(){
        searchWrapper.removeClass('show');
    })
}