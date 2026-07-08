(function ($) {
    "use strict";

    /*--------------------------------------------------------------
    FullHeight
  --------------------------------------------------------------*/
    function fullHeight() {
        $(".full-height").css("height", $(window).height());
    }

    /*--------------------------------------------------------------
    Main Menu For Mobile Nav Toogle Button Script
  --------------------------------------------------------------*/
    if ($(".mobile-nav__toggler").length) {
        $(".mobile-nav__toggler").on("click", function (e) {
            e.preventDefault();
            $(".mobile-nav__wrapper").toggleClass("expanded");
            $("body").toggleClass("locked");
        });
    }

    /*--------------------------------------------------------------
      Main Menu Mobile Nav Script
    --------------------------------------------------------------*/
    if ($(".main-menu__list").length && $(".mobile-nav__container").length) {
        let navContent = document.querySelector(".main-menu__list").outerHTML;
        let mobileNavContainer = document.querySelector(".mobile-nav__container");
        mobileNavContainer.innerHTML = navContent;
    }

    /*--------------------------------------------------------------
      Main Menu Mobile Nav Dropdown Script
    --------------------------------------------------------------*/
    if ($(".mobile-nav__container .main-menu__list").length) {
        let dropdownAnchor = $(
            ".mobile-nav__container .main-menu__list li.dropdown > a"
        );
        dropdownAnchor.each(function () {
            let self = $(this);
            let toggleBtn = document.createElement("BUTTON");
            toggleBtn.setAttribute("aria-label", "dropdown toggler");
            toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
            self.append(function () {
                return toggleBtn;
            });
            self.find("button").on("click", function (e) {
                e.preventDefault();
                let self = $(this);
                self.toggleClass("expanded");
                self.parent().toggleClass("expanded");
                self.parent().parent().children("ul").slideToggle();
            });
        });
    }

    /*--------------------------------------------------------------
      Sticky Header Script
    --------------------------------------------------------------*/
    if ($(".sticky-header__content").length) {
        let navContent = document.querySelector(".main-menu").innerHTML;
        let mobileNavContainer = document.querySelector(".sticky-header__content");
        mobileNavContainer.innerHTML = navContent;
    }

    // window load event
    $(window).on("load", function () {
        fullHeight();
    })


})(jQuery);
