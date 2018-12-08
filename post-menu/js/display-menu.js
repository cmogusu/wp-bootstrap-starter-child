window.xPageMenu = window.xPageMenu || {};


function xMakeSticky($){
  var sticky = {
    topNavElement : {},
    menuElement : {},
    adminMenu : {},
    intervalId : false,
    hasScrolled : false,
    hasResized : false,
    body : {},
    isFixed : 0,
    previousTop : 0,


    init: function(menuElement) {
      this.menuElement = $('.post-inner-menu');
      this.topNavElement = $('.site-header');
      this.body = $('body');
      this.adminMenu = $( '#wpadminbar' );
      this.onScroll = this.onScroll.bind(this);
      this.diferedOnScroll = this.diferedOnScroll.bind(this);
      this.diferedOnScroll = _.debounce( this.diferedOnScroll, 100 );
      
      if( this.topNavElement.length<1 || this.menuElement.length<1 ){
        console.log('cant find needed elements')
        return false;
      }

      this.setEvents();
    },


    setEvents : function(){
      var _this = this;

      $( window ).on( 'customScroll', function(){
        _this.diferedOnScroll();
      })
      .on( 'customPageResize', function(){
        _this.diferedOnScroll( false );
      })
      .trigger( 'customScroll' );
    },


    diferedOnScroll : function( isFixed ){
      if( typeof isFixed == 'boolean' ){
        this.isFixed += isFixed ? 1 : -1;
      }

      setTimeout( this.onScroll, 0 );
    },


    onScroll: function() {
      var top  = this.menuElement.parent()[0].getBoundingClientRect().top;
      var isMovingUp = top > this.previousTop;
      var correctionOffset = isMovingUp ? 60 : 10;
      var distanceFromTop = window.xPageMenu.isMainNavFixed ? this.topNavElement.outerHeight() : 0 ;
            
      if( top < distanceFromTop+correctionOffset ) {
        this.makeMenuFixed( distanceFromTop );
      } else {
        this.makeMenuStatic();
      }

      this.previousTop = top;
    },


    makeMenuFixed : function( distanceFromTop ){
      if( this.isFixed>1 ){
        return false;
      }
      
      var adminMenuHeight = this.adminMenu.css('position')=='fixed' ? this.adminMenu.outerHeight() : 0
      //var menuHeight = window.xPageMenu.isMainNavFixed ? this.topNavElement[0].getBoundingClientRect().bottom : adminMenuHeight ;
      var menuHeight = this.topNavElement[0].getBoundingClientRect().bottom;
      var menuWidth = this.menuElement.parent().outerWidth();

      menuHeight = Math.floor( menuHeight );
      menuWidth  = Math.floor( menuWidth );

      window.xPageMenu.isPageNavFixed = true;
      this.isFixed++;

      this.body.removeClass( 'static-post-menu' ).addClass('fixed-post-menu');
      this.menuElement.css({ 
        'top' : menuHeight,
        'width' : menuWidth,
      }).parent().height( this.menuElement.outerHeight() );
    },


    makeMenuStatic : function(){
      if( this.isFixed<1 ){
        return false;
      }

      window.xPageMenu.isPageNavFixed = false;
      this.isFixed--;

      this.body.removeClass( 'fixed-post-menu' ).addClass('static-post-menu');
      this.menuElement.css({ 
        'top': 0,
        'width': 'auto'
      }).parent().height( this.menuElement.outerHeight() );
    },

  };
  
  sticky.init();
}


function xSmoothScrollToLinks($){
  var scrolly = {
    locationPath : '',
    menuElement : '',
    hasHistoryApi : !!(window.history && history.pushState),

    init : function(){
      this.locationPath = this.filterPath(location.pathname);
      this.menuElement = $('.post-inner-menu');
      this.links  = this.menuElement.find();

      if( !this.menuElement || this.menuElement.length<1 ){
        return false;
      }

      this.setEvents();

    },


    filterPath : function( string ){
      return string
        .replace(/^\//, '')
        .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
        .replace(/\/$/, '');
    },


    setEvents : function(){
      var _this = this;

      this.menuElement.find('a[href*=#]:not([href=#])').on('click',function(event){
        if( !this.hash ){
          return false;
        }

        event.preventDefault();

        var hash = this.hash;
        var target = $("#" + hash.replace(/#/, '') );
        
        var targetOffset = target.offset() ? target.offset().top : 0;
        var customOffset =  _this.menuElement[0].getBoundingClientRect().bottom + 20;

        if( _this.hasHistoryApi ){
          history.pushState( {}, '', hash );
        }

        $('html, body').animate({scrollTop: Math.floor(targetOffset-customOffset) }, 1000, function () {
          target.focus();
          if (target.is(":focus")){
            return false;
          }else{
            target.attr('tabindex','-1');
            target.focus();
          };
        }); 
      })
    },
  }

  scrolly.init();
}


function xSetActiveIndexOnScroll( $ ){
  var scrolly = {
    menuElement : {},
    links : {},
    linkTargets : {},
    linkTargetOffsets : {},
    activeMenuElement : Math.PI,
    previousActiveMenuElement : 0,
    hasHistoryApi : !!(window.history && history.pushState),
    carousel : {},


    init : function(){
      this.menuElement = $('.post-inner-menu');
      this.links = this.menuElement.find('a[href*=#]:not([href=#])');
      this.getLinkOffsets = this.getLinkOffsets.bind(this);
      this.getLinkOffsets = _.throttle( this.getLinkOffsets, 100 );

      if( !this.menuElement || this.menuElement.length<1 ){
        return false;
      }

      this.getLinkTargets();
      this.setEvents();
      this.startCarousel()
    },


    getLinkTargets : function(){
      var linkTargets = [];

      this.links.each( function( linkIndex, linkElement ){
        if( linkElement.hash && $(linkElement.hash).length>0 ){
          var targetElement = $( linkElement.hash );
          var targetPosition = Math.floor( targetElement.offset().top );

          linkTargets.push( [targetPosition, targetElement[0], linkElement, linkIndex ] );
        }
      })

      linkTargets = _.sortBy( linkTargets, function(arr){
        return arr[0];
      });

      this.linkTargets = linkTargets.reverse();
    },


    getLinkOffsets : function(){
      var _this = this;
      var offset = Math.floor( this.menuElement[0].getBoundingClientRect().bottom + 100 );

      $.each( this.linkTargets, function(  index, linkTarget ){
        if( linkTarget[1].getBoundingClientRect().top<offset ){
          _this.setCurrentElement( linkTarget[2], linkTarget[3] );
          return false;
        }
      });
    },


    setCurrentElement : function( activeMenuElement, linkIndex ){
      if( this.activeMenuElement == activeMenuElement ){
        return true;
      }

      this.previousActiveMenuElement = this.activeMenuElement;
      this.activeMenuElement = activeMenuElement;

      
      if( !activeMenuElement || !$(activeMenuElement).parent() ){
        return false;
      }

      if( this.hasHistoryApi && activeMenuElement.hash ){
        history.pushState( {}, '', activeMenuElement.hash );
      }

      $(activeMenuElement).parent().addClass('featured');
      
      if( this.previousActiveMenuElement ){
        $( this.previousActiveMenuElement ).parent().removeClass('featured');
      }

      this.carousel.trigger('to.owl.carousel', linkIndex )
    },


    setEvents : function(){
      var _this = this;

      $( window ).on( 'customScroll customPageResize', function(){
        setTimeout( _this.getLinkOffsets(), 0 );
      }).trigger( 'customPageResize' );
    },


    startCarousel : function(){
      var _this = this;

      this.carousel = this.menuElement.find('.owl-carousel' ).owlCarousel({
        dots : false,
        autoWidth : true,
        responsive:{
          0:{
            items:1
          },
          600:{
            items:2
          },
          1000:{
            items:3
          }
        },
        onResized : _this.fixCarouselWidth,
        onInitialized : _this.fixCarouselWidth,
        nav : true,
        rewind : false,
        URLhashListener:true,
        itemElement : 'li',
        stageElement : 'ul',
        checkVisibility : false,
        responsiveBaseElement : _this.menuElement[0],
      })
    },


    fixCarouselWidth : function( event ){
      var owlStage = $( event.target ).find( '.owl-stage' );

      setTimeout( function(){
        owlStage.width( owlStage.outerWidth()+2 );  
      }, 50 );
    }
  };

  scrolly.init();
}



jQuery( function(){
  xMakeSticky(jQuery);
  xSmoothScrollToLinks( jQuery );
  xSetActiveIndexOnScroll( jQuery );
})


