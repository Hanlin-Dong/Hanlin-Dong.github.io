// Drop Bootstarp low-performance Navbar
// Us     e customize navbar with high-quality material design animation
// in high-perf jank-free CSS3 implementation
var $body   = document.body;
var $toggle = document.querySelector('.navbar-toggle');
var $navbar = document.querySelector('#huxblog_navbar');
var $collapse = document.querySelector('.navbar-collapse');

var __HuxNav__ = {
    close: function(){
        $navbar.className = " ";
        // wait until animation end.
        setTimeout(function(){
            // prevent frequently toggle
            if($navbar.className.indexOf('in') < 0) {
                $collapse.style.height = "0px"
            }
        },400)
    },
    open: function(){
        $collapse.style.height = "auto"
        $navbar.className += " in";
    }
}

// Bind Event
$toggle.addEventListener('click', function(e){
    if ($navbar.className.indexOf('in') > 0) {
        __HuxNav__.close()
    }else{
        __HuxNav__.open()
    }
})

document.addEventListener('click', function(e){
    if(e.target == $toggle) return;
    if(e.target.className == 'icon-bar') return;
    __HuxNav__.close();
})