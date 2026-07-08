(function ($) {
    "use strict";

    /*--------------------------------------------------------------
      GSAP Configuration
    --------------------------------------------------------------*/
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, SplitText);
        gsap.config({
            nullTargetWarn: false,
            trialWarn: false
        });
    }
	
	if ($('.one-page-menu').length) {
	$('.main-menu a[href^="#"], .scroll-to-target').on('click', function (e) {
		var target = this.hash;

		if (target.length > 1 || target !== "#") {
			e.preventDefault();

			var $target = $(target);
			if ($target.length) {
				var headerHeight = $('.main-header').outerHeight() || 100;
				$('html, body').animate({
					scrollTop: $target.offset().top - headerHeight
				}, 800);
			}
		}
	});
	}

    /*--------------------------------------------------------------
      Elementor Integration
    --------------------------------------------------------------*/
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope, $) {
            // Global features (singleton - run once)
            mobileNavToggler();
            searchToggler();
			wowScript();
            stickyHeader();
            scrollToTop();
            niceSelectInit();
            
            // Widget-specific features (scoped)
            mainSlider($scope);
			countScript($scope);
			platformTabs($scope);
			tradingTools($scope);
			chooseCarousal($scope);
			blogCarousal($scope);
			blogCarousal2($scope);
			testiCarousal($scope);
			testiCarousal2($scope);
			instruTabs($scope);
			toolsTabs($scope);
			platformTabs2($scope);
			accordionBox($scope);
			sliderTabs($scope);
			imgSlider($scope);
			stockCarousal($scope);
			funfactCarousal($scope);
			comingSoon($scope);
            imgPopup($scope);
            videoPopup($scope);
            lightboxImage($scope);
        });

        $(window).on('load', function () {
            circleTypeInit();
            // Refresh ScrollTrigger in case positions have shifted after load
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
            // Run animation after short delay for safe measure
            setTimeout(() => {
                titleAnimation();
            }, 100);
                });
    });

    /*--------------------------------------------------------------
      Document Ready
    --------------------------------------------------------------*/
    $(document).ready(function () {
        // Global initializations
        mobileNavToggler();
        searchToggler();
		wowScript();
        stickyHeader();
        niceSelectInit();
        fullHeight();
        accordionBox();
        imgPopup();
        videoPopup();
        lightboxImage();
    });

    /*--------------------------------------------------------------
      Window Load Event
    --------------------------------------------------------------*/
    $(window).on("load", function () {
        handlePreloader();
        circleTypeInit();
        thmSwiperInit();
        thmOwlInit();
        fullHeight();
        // Refresh ScrollTrigger in case positions have shifted after load
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        // Run animation after short delay for safe measure
        setTimeout(() => {
            titleAnimation();
        }, 100);
        });

    /*--------------------------------------------------------------
      Window Scroll Event
    --------------------------------------------------------------*/
    $(window).on("scroll", function () {
        handleScrollbar();
        stickyHeaderScroll();
        scrollToTopVisibility();
    });

    /*--------------------------------------------------------------
      GLOBAL FUNCTIONS (No $scope needed)
    --------------------------------------------------------------*/

    function handlePreloader() {
        if ($('.loader-wrap').length) {
            $('.loader-wrap').delay(1000).fadeOut(1000);
        }
        if (typeof TweenMax !== 'undefined') {
            TweenMax.to($(".loader-wrap .overlay"), 1.2, {
                force3D: true,
                left: "100%",
                ease: Expo.easeInOut,
            });
        }
    }
    
    function fullHeight() {
        $('.full-height').css("height", $(window).height());
    }

    function handleScrollbar() {
        const bHeight = $('body').height();
        const scrolled = $(window).innerHeight() + $(window).scrollTop();
        let percentage = ((scrolled / bHeight) * 100);
        if (percentage > 100) percentage = 100;
        $('.scroll-top-inner .bar-inner').css('width', percentage + '%');
    }

    function scrollToTop() {
        $('.scroll-top-inner').off('click').on("click", function () {
            $('html, body').animate({ scrollTop: 0 }, 500);
            return false;
        });
    }

    function scrollToTopVisibility() {
        if ($(window).scrollTop() > 200) {
            $('.scroll-top-inner').addClass('visible');
        } else {
            $('.scroll-top-inner').removeClass('visible');
        }
    }

    function mobileNavToggler() {
        if ($(".mobile-nav__toggler").length) {
            $(".mobile-nav__toggler").off('click').on("click", function (e) {
                e.preventDefault();
                $(".mobile-nav__wrapper").toggleClass("expanded");
                $("body").toggleClass("locked");
            });
        }

        if ($(".main-menu__list").length && $(".mobile-nav__container").length) {
            let navContent = document.querySelector(".main-menu__list").outerHTML;
            let mobileNavContainer = document.querySelector(".mobile-nav__container");
            mobileNavContainer.innerHTML = navContent;
        }

        if ($(".mobile-nav__container .main-menu__list").length) {
            let dropdownAnchor = $(".mobile-nav__container .main-menu__list .dropdown > a, .mobile-nav__container .main-menu__list .has-mega-menu > a");
            dropdownAnchor.each(function () {
                let self = $(this);
                let toggleBtn = document.createElement("BUTTON");
                toggleBtn.setAttribute("aria-label", "dropdown toggler");
                toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
                self.append(function () {
                    return toggleBtn;
                });
                self.find("button").off('click').on("click", function (e) {
                    e.preventDefault();
                    let self = $(this);
                    self.toggleClass("expanded");
                    self.parent().toggleClass("expanded");
                    self.parent().parent().children("ul").slideToggle();
                    self.parent().parent().children(".bullport-mega-menu-content").slideToggle();
                });
            });
        }
    }

    function searchToggler() {
        if ($(".search-toggler").length) {
            $(".search-toggler").off('click').on("click", function (e) {
                e.preventDefault();
                $(".search-popup").toggleClass("active");
                $(".mobile-nav__wrapper").removeClass("expanded");
                $("body").toggleClass("locked");
            });
        }
    }
	
	function wowScript() {
		/*--------------------------------------------------------------
		Wow Script Active
	  --------------------------------------------------------------*/
	  if ($(".wow").length) {
		var wow = new WOW({
		  boxClass: "wow", // animated element css class (default is wow)
		  animateClass: "animated", // animation css class (default is animated)
		  mobile: true, // trigger animations on mobile devices (default is true)
		  live: true, // act on asynchronously loaded content (default is true)
		});
		wow.init();
	  }
	}

    function stickyHeader() {
        if ($(".sticky-header__content").length) {
            let navContent = document.querySelector(".main-menu").innerHTML;
            let mobileNavContainer = document.querySelector(".sticky-header__content");
            mobileNavContainer.innerHTML = navContent;
        }
    }

    function stickyHeaderScroll() {
        if ($(".stricked-menu").length) {
            var headerScrollPos = 130;
            var stricky = $(".stricked-menu");
            if ($(window).scrollTop() > headerScrollPos) {
                stricky.addClass("stricky-fixed");
            } else if ($(window).scrollTop() <= headerScrollPos) {
                stricky.removeClass("stricky-fixed");
            }
        }
    }

    function niceSelectInit() {
        if ($.fn.niceSelect) {
            $('select:not(.ignore)').niceSelect();
        }
    }
    
    function titleAnimation() {
        if (typeof gsap === 'undefined' || !$('.sec-title-animation').length) return;

        const quotes = document.querySelectorAll(".sec-title-animation .title-animation");

        quotes.forEach(quote => {
            // Destroy old animation and split
            if (quote.animation) {
                quote.animation.kill();
                quote.split.revert();
            }

            let parent = quote.closest('.sec-title-animation');
            let style = parent.className.split('animation-')[1];

            if (style === "style4") return;

            quote.split = new SplitText(quote, {
                type: "lines,words,chars",
                linesClass: "split-line"
            });

            gsap.set(quote, { perspective: 400 });

            // ✅ Set Initial State (Corrected Units)
            if (style === "style1") {
                gsap.set(quote.split.chars, {
                    opacity: 0,
                    y: "90%",
                    rotateX: -40
                });
            }
            if (style === "style2") {
                gsap.set(quote.split.chars, {
                    opacity: 0,
                    x: 50 // ✅ number automatically becomes "50px"
                });
            }
            if (style === "style3") {
                gsap.set(quote.split.chars, {
                    opacity: 0
                });
            }

            // ✅ Animation on Scroll
            quote.animation = gsap.to(quote.split.chars, {
                scrollTrigger: {
                    trigger: quote,
                    start: "top 85%",
                    end: "top 30%",
                    toggleActions: "play none none reverse",
                    // markers: true // enable for debugging
                },
                x: 0,
                y: 0,
                rotateX: 0,
                opacity: 1,
                duration: 1.1,
                ease: "back.out(1.6)",
                stagger: 0.03
            });

        });
    }


    function wrapCharsInSpans(selector) {
        $(selector).each(function() {
            var text = $(this).text();
            var wrappedText = text.split('').map(function(char) {
                return '<span>' + char + '</span>';
            }).join('');
            $(this).html(wrappedText);
        });
    }

    function circleTypeInit() {
        if (!$.fn.circleType) return;

        var circleElements = [
            { selector: '.testimonials-style2-round-top', radius: 94, dir: 1 },
            { selector: '.testimonials-style2-round-bottom', radius: -65, dir: 1.2 },
            { selector: '.trade-market-style3__round-text-top', radius: 81, dir: 1 },
            { selector: '.process-style1__bottom-round-text', radius: 46, dir: 1 }
        ];

        // Wrap chars in spans for .process-style1__bottom-round-text to fix "Spans: false" issue
        wrapCharsInSpans('.process-style1__bottom-round-text');

        circleElements.forEach(function(item) {
            if ($(item.selector).length) {
                $(item.selector).circleType({
                    position: 'absolute',
                    dir: item.dir,
                    radius: item.radius,
                    forceHeight: true,
                    forceWidth: true
                });
            }
        });
    }


    /*--------------------------------------------------------------
      WIDGET-SPECIFIC FUNCTIONS (Need $scope)
    --------------------------------------------------------------*/

    function thmSwiperInit($scope) {
        $scope = $scope || $(document);
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper library not loaded');
            return;
        }

        var $sliders = $scope.find(".thm-swiper__slider");
        if (!$sliders.length) return;

        $sliders.each(function () {
            let elm = $(this);
            let options = elm.data('swiper-options');
            if (elm[0].swiper) {
                elm[0].swiper.destroy(true, true);
            }
            new Swiper(elm[0], options);
        });
    }

    function thmOwlInit($scope) {
        $scope = $scope || $(document);
        if (!$.fn.owlCarousel) {
            console.warn('OwlCarousel library not loaded');
            return;
        }

        var $carousels = $scope.find(".thm-owl__carousel");
        if (!$carousels.length) return;

        $carousels.each(function () {

            let elm = $(this);
            if (elm.hasClass('owl-loaded')) {
                elm.trigger('destroy.owl.carousel');
                elm.removeClass('owl-loaded owl-drag');
            }
            let options = elm.data('owl-options');
            elm.owlCarousel(options);
        });

        var $customNav = $scope.find(".thm-owl__carousel--custom-nav");
        $customNav.each(function () {
            let elm = $(this);
            let owlNavPrev = elm.data('owl-nav-prev');
            let owlNavNext = elm.data('owl-nav-next');
            $(owlNavPrev).off('click').on("click", function (e) {
                elm.trigger('prev.owl.carousel');
                e.preventDefault();
            });
            $(owlNavNext).off('click').on("click", function (e) {
                elm.trigger('next.owl.carousel');
                e.preventDefault();
            });
        });
    }

    function accordionBox($scope) {
        $scope = $scope || $(document);
        var $accordion = $scope.find('.accordion-box');
        if (!$accordion.length) return;

        $accordion.off('click', '.acc-btn').on('click', '.acc-btn', function () {
            var outerBox = $(this).parents('.accordion-box');
            var target = $(this).parents('.accordion');

            if (!$(this).hasClass('active')) {
                $(outerBox).find('.accordion .acc-btn').removeClass('active');
            }
            if ($(this).next('.acc-content').is(':visible')) {
                return false;
            } else {
                $(this).addClass('active');
                $(outerBox).children('.accordion').removeClass('active-block');
                $(outerBox).find('.accordion').children('.acc-content').slideUp(300);
                target.addClass('active-block');
                $(this).next('.acc-content').slideDown(300);
            }
        });
    }

    function videoPopup($scope) {
        $scope = $scope || $(document);
        if (!$.fn.magnificPopup) return;

        var $videoPopup = $scope.find(".video-popup");
        if (!$videoPopup.length) return;

        $videoPopup.magnificPopup({
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: true,
            fixedContentPos: false
        });
    }

    function imgPopup($scope) {
        $scope = $scope || $(document);
        if (!$.fn.magnificPopup) return;

        var groups = {};
        $scope.find(".img-popup").each(function () {
            var id = parseInt($(this).attr("data-group"), 10);
            if (!groups[id]) {
                groups[id] = [];
            }
            groups[id].push(this);
        });

        $.each(groups, function () {
            $(this).magnificPopup({
                type: "image",
                closeOnContentClick: true,
                closeBtnInside: false,
                gallery: { enabled: true }
            });
        });
    }

    function lightboxImage($scope) {
        $scope = $scope || $(document);
        if (!$.fn.fancybox) return;

        var $lightbox = $scope.find('.lightbox-image');
        if (!$lightbox.length) return;

        $lightbox.fancybox({
            openEffect: 'fade',
            closeEffect: 'fade',
            youtube: { controls: 0, showinfo: 0 },
            helpers: { media: {} }
        });
    }
    
    function mainSlider($scope) {
		// Banner Slider //Home One
		var bannerSliderContainer = $scope.find(".banner-slider");
		if (bannerSliderContainer.length > 0) {
			var bannerSlider = new Swiper(bannerSliderContainer[0], {
				spaceBetween: 0,
				effect: "fade",
				slidesPerView: 1,
				mousewheel: false,
				height: 900,
				grabCursor: false,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: "#main-slider-pagination",
					type: "bullets",
					clickable: true,
				},
				navigation: {
					prevEl: ".banner-slider-button-prev",
					nextEl: ".banner-slider-button-next",
				},
			});
		}
	}

	function countScript($scope) {
		/*--------------------------------------------------------------
			Odometer Script Active
		--------------------------------------------------------------*/
		var odo = $scope.find(".odometer");
		if (odo.length) {
			odo.each(function () {
				$(this).appear(function () {
					var countNumber = $(this).attr("data-count");
					$(this).html(countNumber);
				});
			});
		}
	}

	function platformTabs($scope) {
		/*--------------------------------------------------------------
			Platform Style1 Tab
		--------------------------------------------------------------*/
		var tabContainer = $scope.find(".platform-style1__tab");
		if (tabContainer.length) {
			tabContainer.find(".tabs-button-box .tab-btn-item").on("click", function (e) {
				e.preventDefault();
				var target = $($(this).attr("data-tab"));

				if ($(target).hasClass("actve-tab")) {
					return false;
				} else {
					tabContainer.find(".tabs-button-box .tab-btn-item").removeClass("active-btn-item");
					$(this).addClass("active-btn-item");
					tabContainer.find(".tabs-content-box .tab-content-box-item").removeClass("tab-content-box-item-active");
					$(target).addClass("tab-content-box-item-active");
				}
			});
		}
	}

	
	function tradingTools($scope) {
		/*--------------------------------------------------------------
			Trading Tools Style1 Tab
		--------------------------------------------------------------*/
		var tabContainer = $scope.find(".trading-tools-style1__tab");
		if (tabContainer.length) {
			tabContainer.find(".tabs-button-box .tab-btn-item").on("click", function (e) {
				e.preventDefault();
				var target = $($(this).attr("data-tab"));

				if ($(target).hasClass("actve-tab")) {
					return false;
				} else {
					tabContainer.find(".tabs-button-box .tab-btn-item").removeClass("active-btn-item");
					$(this).addClass("active-btn-item");
					tabContainer.find(".tabs-content-box .tab-content-box-item").removeClass("tab-content-box-item-active");
					$(target).addClass("tab-content-box-item-active");
				}
			});
		}
	}

	function chooseCarousal($scope) {
		// Choose Slider
		var chooseSliderContainer = $scope.find(".choose-slider");
		if (chooseSliderContainer.length > 0) {
			var chooseSlider = new Swiper(chooseSliderContainer[0], {
				spaceBetween: 30,
				slidesPerView: 4,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".choose-slider-button-prev",
					nextEl: ".choose-slider-button-next",
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					992: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
					1200: {
						slidesPerView: 4,
						spaceBetween: 30,
					},
				},
			});
		}
	}

	function blogCarousal($scope) {
		// Blog Slider
		var blogSliderContainer = $scope.find(".blog-slider");
		if (blogSliderContainer.length > 0) {
			var blogSlider = new Swiper(blogSliderContainer[0], {
				spaceBetween: 30,
				slidesPerView: 3,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".blog-slider-button-prev",
					nextEl: ".blog-slider-button-next",
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					992: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
					1200: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
				},
			});
		}
	}

	
	function blogCarousal2($scope) {
		// Blog Style3 Slider
		var blogstyle3SliderContainer = $scope.find(".blog-style3-slider");
		if (blogstyle3SliderContainer.length > 0) {
			var blogstyle3Slider = new Swiper(blogstyle3SliderContainer[0], {
				spaceBetween: 30,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".blog-style3-slider-button-prev",
					nextEl: ".blog-style3-slider-button-next",
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					1200: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
				},
			});
		}
	}

	function testiCarousal($scope) {
		// Testimonials Slider
		var testimonialsSliderContainer = $scope.find(".testimonials-slider");
		if (testimonialsSliderContainer.length > 0) {
			var testimonialsSlider = new Swiper(testimonialsSliderContainer[0], {
				spaceBetween: 30,
				slidesPerView: 3,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".testimonials-slider-button-prev",
					nextEl: ".testimonials-slider-button-next",
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					992: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
					1200: {
						slidesPerView: 3,
						spaceBetween: 30,
					},
				},
			});
		}
	}

	function testiCarousal2($scope) {
		// Testimonials Style2 Slider
		var testimonialsstyle2SliderContainer = $scope.find(".testimonials-style2-slider");
		if (testimonialsstyle2SliderContainer.length > 0) {
			var testimonialsstyle2Slider = new Swiper(testimonialsstyle2SliderContainer[0], {
				spaceBetween: 30,
				slidesPerView: 1,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 1000000000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".testimonials-style2-slider-button-prev",
					nextEl: ".testimonials-style2-slider-button-next",
				},
			});
		}
	}

	
	function instruTabs($scope) {
		/*--------------------------------------------------------------
			Trading Instruments Style1
		--------------------------------------------------------------*/
		var tabContainer = $scope.find(".trading-instruments-style1__tab");
		if (tabContainer.length) {
			tabContainer.find(".tabs-button-box .tab-btn-item").on("click", function (e) {
				e.preventDefault();
				var target = $($(this).attr("data-tab"));

				if ($(target).hasClass("actve-tab")) {
					return false;
				} else {
					tabContainer.find(".tabs-button-box .tab-btn-item").removeClass("active-btn-item");
					$(this).addClass("active-btn-item");
					tabContainer.find(".tabs-content-box .tab-content-box-item").removeClass("tab-content-box-item-active");
					$(target).addClass("tab-content-box-item-active");
				}
			});
		}
	}

	function toolsTabs($scope) {
		/*--------------------------------------------------------------
			Trading Tools Style2 Tab
		--------------------------------------------------------------*/
		var tabContainer = $scope.find(".trading-tools-style2__tab");
		if (tabContainer.length) {
			tabContainer.find(".tabs-button-box .tab-btn-item").on("click", function (e) {
				e.preventDefault();
				var target = $($(this).attr("data-tab"));

				if ($(target).hasClass("actve-tab")) {
					return false;
				} else {
					tabContainer.find(".tabs-button-box .tab-btn-item").removeClass("active-btn-item");
					$(this).addClass("active-btn-item");
					tabContainer.find(".tabs-content-box .tab-content-box-item").removeClass("tab-content-box-item-active");
					$(target).addClass("tab-content-box-item-active");
				}
			});
		}
	}

	function platformTabs2($scope) {
		/*--------------------------------------------------------------
			Platform Style2 Tab
		--------------------------------------------------------------*/
		var tabContainer = $scope.find(".platform-style2__tab");
		if (tabContainer.length) {
			tabContainer.find(".tabs-button-box .tab-btn-item").on("click", function (e) {
				e.preventDefault();
				var target = $($(this).attr("data-tab"));

				if ($(target).hasClass("actve-tab")) {
					return false;
				} else {
					tabContainer.find(".tabs-button-box .tab-btn-item").removeClass("active-btn-item");
					$(this).addClass("active-btn-item");
					tabContainer.find(".tabs-content-box .tab-content-box-item").removeClass("tab-content-box-item-active");
					$(target).addClass("tab-content-box-item-active");
				}
			});
		}
	}

	function sliderTabs($scope) {
		/*--------------------------------------------------------------
			Main Slider Style3 Tabs
		--------------------------------------------------------------*/
		var tabContainer = $scope.find(".main-slider-style3__tab");
		if (tabContainer.length) {
			tabContainer.find(".tabs-button-box .tab-btn-item").on("click", function (e) {
				e.preventDefault();
				var target = $($(this).attr("data-tab"));

				if ($(target).hasClass("actve-tab")) {
					return false;
				} else {
					tabContainer.find(".tabs-button-box .tab-btn-item").removeClass("active-btn-item");
					$(this).addClass("active-btn-item");
					tabContainer.find(".tabs-content-box .tab-content-box-item").removeClass("tab-content-box-item-active");
					$(target).addClass("tab-content-box-item-active");
				}
			});
		}
	}

	function imgSlider($scope) {
		/*--------------------------------------------------------------
			Trade Market Style3 Script
		--------------------------------------------------------------*/
		var swiperEffectContainer = $scope.find(".swiperEffect");
		if (swiperEffectContainer.length > 0) {
			var swiperEffect = new Swiper(swiperEffectContainer[0], {
				loop: true,
				effect: "cards",
				grabCursor: true,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
		}
	}

	
	function stockCarousal($scope) {
		// Trade Market Style3
		var stockSliderContainer = $scope.find(".trade-market-style3__slider");
		if (stockSliderContainer.length > 0) {
			var stockSlider = new Swiper(stockSliderContainer[0], {
				spaceBetween: 0,
				slidesPerView: 1,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".trade-market-style3__button-prev",
					nextEl: ".trade-market-style3__button-next",
				},
			});
		}
	}

	function funfactCarousal($scope) {
		// Fact Counter Style3
		var funfactSliderContainer = $scope.find(".fact-counter-style3-slider");
		if (funfactSliderContainer.length > 0) {
			var funfactSlider = new Swiper(funfactSliderContainer[0], {
				spaceBetween: 30,
				slidesPerView: 2,
				mousewheel: false,
				height: 500,
				grabCursor: true,
				loop: true,
				speed: 1400,
				autoplay: {
					delay: 10000,
				},
				pagination: {
					el: ".swiper-pagination",
					type: "progressbar",
				},
				navigation: {
					prevEl: ".counter-style3-button-prev",
					nextEl: ".counter-style3-button-next",
				},
				breakpoints: {
					0: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
					992: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
					1200: {
						slidesPerView: 2,
						spaceBetween: 30,
					},
				},
			});
		}
	}

	function comingSoon($scope) {
		var countdownBoxes = $scope.find(".time-countdown-two");
		if (countdownBoxes.length) {
			countdownBoxes.each(function () {
				var Self = $(this);
				var countDate = Self.data("countdown-time"); // getting date

				Self.countdown(countDate, function (event) {
					$(this).html(
						'<li> <div class="box"> <span class="days">' +
						event.strftime("%D") +
						'</span> <span class="timeRef">days</span> </div> </li>' +
						'<li> <div class="box"> <span class="hours">' +
						event.strftime("%H") +
						'</span> <span class="timeRef clr-1">Hrs</span> </div> </li>' +
						'<li> <div class="box"> <span class="minutes">' +
						event.strftime("%M") +
						'</span> <span class="timeRef clr-2">Mins</span> </div> </li>' +
						'<li> <div class="box"> <span class="seconds">' +
						event.strftime("%S") +
						'</span> <span class="timeRef clr-3">Secs</span> </div> </li>'
					);
				});
			});
		}
	}

})(window.jQuery);