window.xPageMenu = window.xPageMenu || {};

window.xPageMenu.isMainNavFixed = false;
window.xPageMenu.isPageNavFixed = false;

(function registerCustomScrollEvent($, timeBetweenChecks ){
  var pageHasScrolled = false;
  var resizeHandler = function(){
    $( window ).trigger( 'customPageResize' ); 
  };

  resizeHandler = _.debounce( resizeHandler, timeBetweenChecks );


  setInterval( function(){
    if( pageHasScrolled ){
      pageHasScrolled = false;
      $( window ).trigger( 'customScroll' );
    }

  }, timeBetweenChecks );

  $( window ).on( 'scroll', function() {
    pageHasScrolled = true;
  })
  .on('resize', resizeHandler );

})( jQuery, 300 );


jQuery(function($) {
  var stickyTopNavigationMenu = {
    body : {},
    menuElement : {},
    adminMenu : {},
    isFixed : false,
    previousTop : 0,


    init: function() {
      this.body   = $('body');
      this.menuElement = $('.site-header');
      this.adminMenu = $( '#wpadminbar' );
      this.onScroll = this.onScroll.bind(this);
      this.onResize = this.onResize.bind(this);

      window.xPageMenu.isMainNavFixed = false;

      this.setEvents();
      this.onResize();
    },


    setEvents : function(){
      var _this = this;

      $( window ).on( 'customScroll', function(){
        setTimeout( _this.onScroll, 0 );
      })
      .on('customPageResize',function(){
        setTimeout( _this.onScroll, 10 );
      })
      .trigger('customScroll');
    },


    onScroll: function() {
      var top  = this.menuElement.parent()[0].getBoundingClientRect().top;
      var isMovingUp = top > this.previousTop;
      var correctionOffset = isMovingUp ? 0 : 30;

      if( window.pageYOffset > correctionOffset ){
        this.makeMenuFixed();
      } else {
        this.makeMenuStatic();
      }

      this.previousTop = top;
    },


    makeMenuFixed : function(){
      if( this.isFixed ){
        return false;
      }
      window.xPageMenu.isMainNavFixed = this.isFixed = true;

      var menuHeight = Math.floor( this.menuElement.height() );
      var top = (this.adminMenu.length && this.adminMenu.css('position')=='fixed') ? this.adminMenu.outerHeight() : 0;

      this.body.addClass( 'fixed-menu' );    
      this.menuElement.css( 'top', top ).parent().css( 'padding-top', menuHeight );
    },


    makeMenuStatic : function(){
      if( !this.isFixed ){
        return false;
      }
      window.xPageMenu.isMainNavFixed = this.isFixed = false;

      this.body.removeClass( 'fixed-menu' );
      this.menuElement.css( 'top', 0 ).parent().css( 'padding-top', 0 );
    },

    
    onResize: function () {
      this.menuHeight = this.menuElement.height();
    },
  };

  stickyTopNavigationMenu.init();
});