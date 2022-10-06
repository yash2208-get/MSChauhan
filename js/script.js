"use strict";
(function() {
    var userAgent = navigator.userAgent.toLowerCase(),
        initialDate = new Date(),
        $document = $(document),
        $window = $(window),
        $html = $("html"),
        $body = $("body"),
        isDesktop = $html.hasClass("desktop"),
        isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        windowReady = false,
        isNoviBuilder = false,
        pageTransitionAnimationDuration = 500,
        loaderTimeoutId, plugins = {
            bootstrapTooltip: $("[data-toggle='tooltip']"),
            bootstrapModalDialog: $('.modal'),
            bootstrapTabs: $(".tabs-custom"),
            rdNavbar: $(".rd-navbar"),
            materialParallax: $(".parallax-container"),
            maps: $(".google-map-container"),
            rdMailForm: $(".rd-mailform"),
            rdInputLabel: $(".form-label"),
            regula: $("[data-constraints]"),
            wow: $(".wow"),
            owl: $(".owl-carousel"),
            swiper: $(".swiper-slider"),
            
            statefulButton: $('.btn-stateful'),
            isotope: $(".isotope"),
            popover: $('[data-toggle="popover"]'),
            viewAnimate: $('.view-animate'),
            radio: $("input[type='radio']"),
            checkbox: $("input[type='checkbox']"),
            customToggle: $("[data-custom-toggle]"),
            counter: $(".counter"),
            progressLinear: $(".progress-linear"),
            dateCountdown: $('.DateCountdown'),
            preloader: $(".preloader"),
            captcha: $('.recaptcha'),
            lightGallery: $("[data-lightgallery='group']"),
            lightGalleryItem: $("[data-lightgallery='item']"),
            lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
            mailchimp: $('.mailchimp-mailform'),
            campaignMonitor: $('.campaign-mailform'),
            copyrightYear: $(".copyright-year"),
            buttonWinona: $('.button-winona'),
            slick: $('.slick-slider'),
            videoOverlay: $('.video-overlay'),
            d3Charts: $('.d3-chart'),
            selectFilter: $(".select"),
            hoverdir: $('.hoverdir .hoverdir-item'),
            vide: $(".vide_bg")
        };
    $window.on('load', function() {
        if (plugins.preloader.length && !isNoviBuilder) {
            pageTransition({
                target: document.querySelector('.page'),
                delay: 0,
                duration: pageTransitionAnimationDuration,
                classActive: 'animated',
                conditions: function(event, link) {
                    return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery') && event.currentTarget.getAttribute('href') !== 'javascript:void(0);';
                },
                onTransitionStart: function(options) {
                    setTimeout(function() {
                        plugins.preloader.removeClass('loaded');
                    }, options.duration * .75);
                },
                onReady: function() {
                    plugins.preloader.addClass('loaded');
                    windowReady = true;
                }
            });
        }
    });
    $(function() {
        isNoviBuilder = window.xMode;

        function getSwiperHeight(object, attr) {
            var val = object.attr("data-" + attr),
                dim;
            if (!val) {
                return undefined;
            }
            dim = val.match(/(px)|(%)|(vh)|(vw)$/i);
            if (dim.length) {
                switch (dim[0]) {
                    case "px":
                        return parseFloat(val);
                    case "vh":
                        return $window.height() * (parseFloat(val) / 100);
                    case "vw":
                        return $window.width() * (parseFloat(val) / 100);
                    case "%":
                        return object.width() * (parseFloat(val) / 100);
                }
            } else {
                return undefined;
            }
        }

        function toggleSwiperInnerVideos(swiper) {
            var prevSlide = $(swiper.slides[swiper.previousIndex]),
                nextSlide = $(swiper.slides[swiper.activeIndex]),
                videos, videoItems = prevSlide.find("video");
            for (var i = 0; i < videoItems.length; i++) {
                videoItems[i].pause();
            }
            videos = nextSlide.find("video");
            if (videos.length) {
                videos.get(0).play();
            }
        }

        function toggleSwiperCaptionAnimation(swiper) {
            var prevSlides = $(swiper.el).find("[data-caption-animate]"),
                nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
                delay, duration, nextSlideItem, prevSlideItem;
            for (var i = 0; i < prevSlides.length; i++) {
                prevSlideItem = $(prevSlides[i]);
                prevSlideItem.removeClass("animated").removeClass(prevSlideItem.attr("data-caption-animate")).addClass("not-animated");
            }
            var tempFunction = function(nextSlideItem, duration) {
                return function() {
                    nextSlideItem.removeClass("not-animated").addClass(nextSlideItem.attr("data-caption-animate")).addClass("animated");
                    if (duration) {
                        nextSlideItem.css('animation-duration', duration + 'ms');
                    }
                };
            };
            for (var i = 0; i < nextSlide.length; i++) {
                nextSlideItem = $(nextSlide[i]);
                delay = nextSlideItem.attr("data-caption-delay");
                duration = nextSlideItem.attr('data-caption-duration');
                if (!isNoviBuilder) {
                    if (delay) {
                        setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
                    } else {
                        setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 0));
                    }
                } else {
                    nextSlideItem.removeClass("not-animated")
                }
            }
        }

        function initOwlCarousel(c) {
            var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
                values = [0, 576, 768, 992, 1200, 1600],
                responsive = {};
            for (var j = 0; j < values.length; j++) {
                responsive[values[j]] = {};
                for (var k = j; k >= -1; k--) {
                    if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                        responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
                    }
                    if (!responsive[values[j]]["slideBy"] && c.attr("data" + aliaces[k] + "slideBy")) {
                        responsive[values[j]]["slideBy"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "slide-by"), 10);
                    }
                    if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                        responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
                    }
                    if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                        responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
                    }
                }
            }
            if (c.attr('data-dots-custom')) {
                c.on("initialized.owl.carousel", function(event) {
                    var carousel = $(event.currentTarget),
                        customPag = $(carousel.attr("data-dots-custom")),
                        active = 0;
                    if (carousel.attr('data-active')) {
                        active = parseInt(carousel.attr('data-active'), 10);
                    }
                    carousel.trigger('to.owl.carousel', [active, 300, true]);
                    customPag.find("[data-owl-item='" + active + "']").addClass("active");
                    customPag.find("[data-owl-item]").on('click', function(e) {
                        e.preventDefault();
                        carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
                    });
                    carousel.on("translate.owl.carousel", function(event) {
                        customPag.find(".active").removeClass("active");
                        customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
                    });
                });
            }
            c.on("initialized.owl.carousel", function() {
                initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
            });
            c.owlCarousel({
                autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
                autoplayTimeout: c.attr("data-autoplay-timeout") ? parseInt(c.attr("data-autoplay-timeout"), 10) : 100,
                autoplaySpeed: c.attr("data-autoplay-speed") ? parseInt(c.attr("data-autoplay-speed"), 10) : 2800,
                autoplayHoverPause: true,
                loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
                items: 1,
                lazyLoad: true,
                center: c.attr("data-center") === "true",
                navContainer: c.attr("data-navigation-class") || false,
                mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
                nav: c.attr("data-nav") === "true",
                dots: c.attr("data-dots") === "true",
                dotsContainer: c.attr("data-pagination-class") || false,
                dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
                dotsSpeed: c.attr("data-dots-speed") ? parseInt(c.attr("data-dots-speed"), 10) : false,
                animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
                animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
                responsive: responsive,
                navText: function() {
                    try {
                        return JSON.parse(c.attr("data-nav-text"));
                    } catch (e) {
                        return [];
                    }
                }(),
                navClass: function() {
                    try {
                        return JSON.parse(c.attr("data-nav-class"));
                    } catch (e) {
                        return ['owl-prev', 'owl-next'];
                    }
                }()
            });
        }

        function isScrolledIntoView(elem) {
            if (!isNoviBuilder) {
                return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
            } else {
                return true;
            }
        }

        function lazyInit(element, func) {
            $document.on('scroll', function() {
                if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
                    func.call();
                    element.addClass('lazy-loaded');
                }
            }).trigger("scroll");
        }

        

        function attachFormValidator(elements) {
            regula.custom({
                name: 'PhoneNumber',
                defaultMessage: 'Invalid phone number format',
                validator: function() {
                    if (this.value === '') return true;
                    else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
                }
            });
            for (var i = 0; i < elements.length; i++) {
                var o = $(elements[i]),
                    v;
                o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
                v = o.parent().find(".form-validation");
                if (v.is(":last-child")) o.addClass("form-control-last-child");
            }
            elements.on('input change propertychange blur', function(e) {
                var $this = $(this),
                    results;
                if (e.type !== "blur")
                    if (!$this.parent().hasClass("has-error")) return;
                if ($this.parents('.rd-mailform').hasClass('success')) return;
                if ((results = $this.regula('validate')).length) {
                    for (i = 0; i < results.length; i++) {
                        $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
                    }
                } else {
                    $this.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }).regula('bind');
            var regularConstraintsMessages = [{
                type: regula.Constraint.Required,
                newMessage: "The text field is required."
            }, {
                type: regula.Constraint.Email,
                newMessage: "The email is not a valid email."
            }, {
                type: regula.Constraint.Numeric,
                newMessage: "Only numbers are required"
            }, {
                type: regula.Constraint.Selected,
                newMessage: "Please choose an option."
            }];
            for (var i = 0; i < regularConstraintsMessages.length; i++) {
                var regularConstraint = regularConstraintsMessages[i];
                regula.override({
                    constraintType: regularConstraint.type,
                    defaultMessage: regularConstraint.newMessage
                });
            }
        }

        function isValidated(elements, captcha) {
            var results, errors = 0;
            if (elements.length) {
                for (var j = 0; j < elements.length; j++) {
                    var $input = $(elements[j]);
                    if ((results = $input.regula('validate')).length) {
                        for (k = 0; k < results.length; k++) {
                            errors++;
                            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                        }
                    } else {
                        $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                    }
                }
                if (captcha) {
                    if (captcha.length) {
                        return validateReCaptcha(captcha) && errors === 0
                    }
                }
                return errors === 0;
            }
            return true;
        }

        function validateReCaptcha(captcha) {
            var captchaToken = captcha.find('.g-recaptcha-response').val();
            if (captchaToken.length === 0) {
                captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
                captcha.closest('.form-wrap').addClass('has-error');
                captcha.on('propertychange', function() {
                    var $this = $(this),
                        captchaToken = $this.find('.g-recaptcha-response').val();
                    if (captchaToken.length > 0) {
                        $this.closest('.form-wrap').removeClass('has-error');
                        $this.siblings('.form-validation').removeClass('active').html('');
                        $this.off('propertychange');
                    }
                });
                return false;
            }
            return true;
        }
        window.onloadCaptchaCallback = function() {
            for (var i = 0; i < plugins.captcha.length; i++) {
                var $capthcaItem = $(plugins.captcha[i]);
                grecaptcha.render($capthcaItem.attr('id'), {
                    sitekey: $capthcaItem.attr('data-sitekey'),
                    size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
                    theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
                    callback: function(e) {
                        $('.recaptcha').trigger('propertychange');
                    }
                });
                $capthcaItem.after("<span class='form-validation'></span>");
            }
        };

        function initBootstrapTooltip(tooltipPlacement) {
            plugins.bootstrapTooltip.tooltip('dispose');
            if (window.innerWidth < 576) {
                plugins.bootstrapTooltip.tooltip({
                    placement: 'bottom'
                });
            } else {
                plugins.bootstrapTooltip.tooltip({
                    placement: tooltipPlacement
                });
            }
        }

        function initLightGallery(itemsToInit, addClass) {
            if (!isNoviBuilder) {
                $(itemsToInit).lightGallery({
                    thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                    selector: "[data-lightgallery='item']",
                    autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                    pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                    addClass: addClass,
                    mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                    loop: $(itemsToInit).attr("data-lg-loop") !== "false"
                });
            }
        }

        function initDynamicLightGallery(itemsToInit, addClass) {
            if (!isNoviBuilder) {
                $(itemsToInit).on("click", function() {
                    $(itemsToInit).lightGallery({
                        thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                        selector: "[data-lightgallery='item']",
                        autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                        pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                        addClass: addClass,
                        mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                        loop: $(itemsToInit).attr("data-lg-loop") !== "false",
                        dynamic: true,
                        dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
                    });
                });
            }
        }

        function initLightGalleryItem(itemToInit, addClass) {
            if (!isNoviBuilder) {
                $(itemToInit).lightGallery({
                    selector: "this",
                    addClass: addClass,
                    counter: false,
                    youtubePlayerParams: {
                        modestbranding: 1,
                        showinfo: 0,
                        rel: 0,
                        controls: 0
                    },
                    vimeoPlayerParams: {
                        byline: 0,
                        portrait: 0
                    }
                });
            }
        }

        function initHoverDir(elements) {
            if (!isNoviBuilder && isDesktop) {
                for (var z = 0; z < elements.length; z++) {
                    var $element = $(elements[z]);
                    $element.hoverdir({
                        hoverElem: $element.attr('data-hoverdir-target') ? $element.attr('data-hoverdir-target') : 'div'
                    });
                }
            }
        }

        function getLatLngObject(str, marker, map, callback) {
            var coordinates = {};
            try {
                coordinates = JSON.parse(str);
                callback(new google.maps.LatLng(coordinates.lat, coordinates.lng), marker, map)
            } catch (e) {
                map.geocoder.geocode({
                    'address': str
                }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();
                        callback(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)), marker, map)
                    }
                })
            }
        }
        if (plugins.captcha.length) {
            $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
        }
        if (navigator.platform.match(/(Mac)/i)) {
            $html.addClass("mac-os");
        }
        if (isIE) {
            if (isIE < 10) {
                $html.addClass("lt-ie-10");
            }
            if (isIE < 11) {
                $.getScript('js/pointer-events.min.js').done(function() {
                    $html.addClass("ie-10");
                    PointerEventsPolyfill.initialize({});
                });
            }
            if (isIE === 11) {
                $html.addClass("ie-11");
            }
            if (isIE === 12) {
                $html.addClass("ie-edge");
            }
        }
        if (plugins.bootstrapTooltip.length) {
            var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
            initBootstrapTooltip(tooltipPlacement);
            $window.on('resize orientationchange', function() {
                initBootstrapTooltip(tooltipPlacement);
            })
        }
        if (plugins.bootstrapModalDialog.length) {
            for (var i = 0; i < plugins.bootstrapModalDialog.length; i++) {
                var modalItem = $(plugins.bootstrapModalDialog[i]);
                modalItem.on('hidden.bs.modal', $.proxy(function() {
                    var activeModal = $(this),
                        rdVideoInside = activeModal.find('video'),
                        youTubeVideoInside = activeModal.find('iframe');
                    if (rdVideoInside.length) {
                        rdVideoInside[0].pause();
                    }
                    if (youTubeVideoInside.length) {
                        var videoUrl = youTubeVideoInside.attr('src');
                        youTubeVideoInside.attr('src', '').attr('src', videoUrl);
                    }
                }, modalItem))
            }
        }
        if (plugins.popover.length) {
            if (window.innerWidth < 767) {
                plugins.popover.attr('data-placement', 'bottom');
                plugins.popover.popover();
            } else {
                plugins.popover.popover();
            }
        }
        if (plugins.statefulButton.length) {
            $(plugins.statefulButton).on('click', function() {
                var statefulButtonLoading = $(this).button('loading');
                setTimeout(function() {
                    statefulButtonLoading.button('reset')
                }, 2000);
            })
        }
        if (plugins.bootstrapTabs.length) {
            for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
                var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);
                if (bootstrapTabsItem.find('.slick-slider').length) {
                    bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function() {
                        var $this = $(this);
                        var setTimeOutTime = isNoviBuilder ? 1500 : 300;
                        setTimeout(function() {
                            $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
                        }, setTimeOutTime);
                    }, bootstrapTabsItem));
                }
            }
        }
        if (plugins.copyrightYear.length) {
            plugins.copyrightYear.text(initialDate.getFullYear());
        }
        
           
               
        if (plugins.radio.length) {
            for (var i = 0; i < plugins.radio.length; i++) {
                $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
            }
        }
        if (plugins.checkbox.length) {
            for (var i = 0; i < plugins.checkbox.length; i++) {
                $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
            }
        }
        if (isDesktop && !isNoviBuilder) {
            $().UItoTop({
                easingType: 'easeOutQuad',
                containerClass: 'ui-to-top'
            });
        }
        if (plugins.rdNavbar.length) {
            var aliaces, i, j, len, value, values, responsiveNavbar;
            aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
            values = [0, 576, 768, 992, 1200, 1600];
            responsiveNavbar = {};
            for (var z = 0; z < plugins.rdNavbar.length; z++) {
                var $rdNavbar = $(plugins.rdNavbar[z]);
                for (i = j = 0, len = values.length; j < len; i = ++j) {
                    value = values[i];
                    if (!responsiveNavbar[values[i]]) {
                        responsiveNavbar[values[i]] = {};
                    }
                    if ($rdNavbar.attr('data' + aliaces[i] + 'layout')) {
                        responsiveNavbar[values[i]].layout = $rdNavbar.attr('data' + aliaces[i] + 'layout');
                    }
                    if ($rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
                        responsiveNavbar[values[i]]['deviceLayout'] = $rdNavbar.attr('data' + aliaces[i] + 'device-layout');
                    }
                    if ($rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
                        responsiveNavbar[values[i]]['focusOnHover'] = $rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
                    }
                    if ($rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
                        responsiveNavbar[values[i]]['autoHeight'] = $rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
                    }
                    if (isNoviBuilder) {
                        responsiveNavbar[values[i]]['stickUp'] = false;
                    } else if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
                        var isDemoNavbar = $rdNavbar.parents('.layout-navbar-demo').length;
                        responsiveNavbar[values[i]]['stickUp'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true' && !isDemoNavbar;
                    }
                    if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
                        responsiveNavbar[values[i]]['stickUpOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
                    }
                }
                $rdNavbar.RDNavbar({
                    anchorNav: !isNoviBuilder,
                    stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
                    responsive: responsiveNavbar,
                    callbacks: {
                        onStuck: function() {
                            var navbarSearch = this.$element.find('.rd-search input');
                            if (navbarSearch) {
                                navbarSearch.val('').trigger('propertychange');
                            }
                        },
                        onDropdownOver: function() {
                            return !isNoviBuilder;
                        },
                        onUnstuck: function() {
                            if (this.$clone === null)
                                return;
                            var navbarSearch = this.$clone.find('.rd-search input');
                            if (navbarSearch) {
                                navbarSearch.val('').trigger('propertychange');
                                navbarSearch.trigger('blur');
                            }
                        }
                    }
                });
                if ($rdNavbar.attr("data-body-class")) {
                    document.body.className += ' ' + $rdNavbar.attr("data-body-class");
                }
            }
        }
        if (plugins.rdInputLabel.length) {
            plugins.rdInputLabel.RDInputLabel();
        }
        
                    
        if (plugins.viewAnimate.length) {
            for (var i = 0; i < plugins.viewAnimate.length; i++) {
                var $view = $(plugins.viewAnimate[i]).not('.active');
                $document.on("scroll", $.proxy(function() {
                    if (isScrolledIntoView(this)) {
                        this.addClass("active");
                    }
                }, $view)).trigger("scroll");
            }
        }

        function makeInterLeaveEffectOptions(interleaveOffset) {
            return {
                effect: 'slide',
                speed: 1200,
                watchSlidesProgress: true,
                on: {
                    progress: function(progress) {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            var slideProgress = swiper.slides[i].progress,
                                innerOffset = swiper.width * interleaveOffset,
                                innerTranslate = slideProgress * innerOffset;
                            if (slideProgress > 0) {
                                innerOffset = slideProgress * swiper.width;
                                innerTranslate = innerOffset * interleaveOffset;
                            } else {
                                innerTranslate = Math.abs(slideProgress * swiper.width) * interleaveOffset;
                                innerOffset = 0;
                            }
                            swiper.slides[i].style.transform = 'translate3d(' + innerOffset + 'px,0,0)';
                            swiper.slides[i].getElementsByClassName('slide-inner')[0].style.transform = 'translate3d(' + innerTranslate + 'px,0,0)';
                        }
                    },
                    touchStart: function() {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            swiper.slides[i].style.transition = "";
                        }
                    },
                    setTransition: function(speed) {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            swiper.slides[i].style.transition = speed + "ms";
                            swiper.slides[i].querySelector(".slide-inner").style.transition = speed + "ms";
                        }
                    },
                    slideNextTransitionStart: function() {
                        var swiper = this;
                        setTimeout(function() {
                            toggleSwiperCaptionAnimation(swiper);
                        }, 300);
                    },
                    slidePrevTransitionStart: function() {
                        var swiper = this;
                        setTimeout(function() {
                            toggleSwiperCaptionAnimation(swiper);
                        }, 300);
                    }
                }
            };
        }
        if (plugins.swiper.length) {

            for (var i = 0; i < plugins.swiper.length; i++) {
                var s = $(plugins.swiper[i]),
                    pag = s.find(".swiper-pagination"),
                    next = s.find(".swiper-button-next"),
                    prev = s.find(".swiper-button-prev"),
                    bar = s.find(".swiper-scrollbar"),
                    swiperSlide = s.find(".swiper-slide");
                for (var j = 0; j < swiperSlide.length; j++) {
                    var $this = $(swiperSlide[j]),
                        url;
                    if (url = $this.attr("data-slide-bg")) {
                        $this.css({
                            "background-image": "url(" + url + ")",
                            "background-size": "cover"
                        })
                    }
                }
                swiperSlide.end().find("[data-caption-animate]").addClass("not-animated").end();
                var swiperOptions = {
                    autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
                    direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
                    effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
                    speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
                    loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
                    simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
                    navigation: {
                        nextEl: next.length ? next.get(0) : null,
                        prevEl: prev.length ? prev.get(0) : null
                    },
                    pagination: {
                        el: pag.length ? pag.get(0) : null,
                        clickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
                        renderBullet: pag.length ? pag.attr("data-index-bullet") === "true" ? function(index, className) {
                            return '<span class="' + className + '">' + ((index + 1) < 10 ? ('0' + (index + 1)) : (index + 1)) + '</span>';
                        } : null : null,
                    },
                    scrollbar: {
                        el: bar.length ? bar.get(0) : null,
                        draggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
                        hide: bar.length ? bar.attr("data-draggable") === "false" : false
                    },
                    on: {
                        init: function() {
                            toggleSwiperInnerVideos(this);
                            toggleSwiperCaptionAnimation(this);
                        },
                        transitionStart: function() {
                            toggleSwiperInnerVideos(this);
                        },
                        transitionEnd: function() {
                            var $buttonsWinona = $(this.slides[this.activeIndex]).find('.button-winona');
                            if ($buttonsWinona.length && !isNoviBuilder) {
                                initWinonaButtons($buttonsWinona);
                            }
                        }
                    }
                };
                if (s.attr('data-custom-slide-effect') === 'inter-leave-effect') {
                    var interleaveOffset = s.attr('data-inter-leave-offset') ? s.attr('data-inter-leave-offset') : -.7;
                    swiperOptions = $.extend(true, swiperOptions, makeInterLeaveEffectOptions(interleaveOffset));
                }
                s = new Swiper(plugins.swiper[i], swiperOptions);
                var container = $(pag);
                if (container.hasClass('swiper-pagination-marked')) {
                    container.append('<span class="swiper-pagination-mark"></span>');
                }
            }
        }
        if (plugins.owl.length) {
            for (var i = 0; i < plugins.owl.length; i++) {
                var c = $(plugins.owl[i]);
                plugins.owl[i].owl = c;
                initOwlCarousel(c);
            }
        }
        if (plugins.isotope.length) {
            var isogroup = [];
            for (var i = 0; i < plugins.isotope.length; i++) {
                var isotopeItem = plugins.isotope[i],
                    isotopeInitAttrs = {
                        itemSelector: '.isotope-item',
                        layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
                        filter: '*'
                    };
                if (isotopeItem.getAttribute('data-column-width')) {
                    isotopeInitAttrs.masonry = {
                        columnWidth: parseFloat(isotopeItem.getAttribute('data-column-width'))
                    };
                } else if (isotopeItem.getAttribute('data-column-class')) {
                    isotopeInitAttrs.masonry = {
                        columnWidth: isotopeItem.getAttribute('data-column-class')
                    };
                }
                var iso = new Isotope(isotopeItem, isotopeInitAttrs);
                isogroup.push(iso);
            }
            setTimeout(function() {
                for (var i = 0; i < isogroup.length; i++) {
                    isogroup[i].element.className += " isotope--loaded";
                    isogroup[i].layout();
                }
            }, 200);
            var resizeTimout;
            $("[data-isotope-filter]").on("click", function(e) {
                e.preventDefault();
                var filter = $(this);
                clearTimeout(resizeTimout);
                filter.parents(".isotope-filters").find('.active').removeClass("active");
                filter.addClass("active");
                var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
                    isotopeAttrs = {
                        itemSelector: '.isotope-item',
                        layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
                        filter: this.getAttribute("data-isotope-filter") === '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
                    };
                if (iso.attr('data-column-width')) {
                    isotopeAttrs.masonry = {
                        columnWidth: parseFloat(iso.attr('data-column-width'))
                    };
                } else if (iso.attr('data-column-class')) {
                    isotopeAttrs.masonry = {
                        columnWidth: iso.attr('data-column-class')
                    };
                }
                iso.isotope(isotopeAttrs);
                var $iso = $(iso);
                if ($iso.hasClass('hoverdir')) {
                    initHoverDir($iso.find('.hoverdir-item'));
                }
            }).eq(0).trigger("click")
        }
        if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
            setTimeout(function() {
                new WOW({
                    mobile: false,
                    live: false
                }).init();
            }, pageTransitionAnimationDuration);
        }
        if (plugins.regula.length) {
            attachFormValidator(plugins.regula);
        }
        
        if (plugins.campaignMonitor.length) {
            for (i = 0; i < plugins.campaignMonitor.length; i++) {
                var $campaignItem = $(plugins.campaignMonitor[i]);
                $campaignItem.on('submit', $.proxy(function(e) {
                    var data = {},
                        url = this.attr('action'),
                        dataArray = this.serializeArray(),
                        $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
                        $this = $(this);
                    for (i = 0; i < dataArray.length; i++) {
                        data[dataArray[i].name] = dataArray[i].value;
                    }
                    $.ajax({
                        data: data,
                        url: url,
                        dataType: 'jsonp',
                        error: function(resp, text) {
                            $output.html('Server error: ' + text);
                            setTimeout(function() {
                                $output.removeClass("active");
                            }, 4000);
                        },
                        success: function(resp) {
                            $output.html(resp.Message).addClass('active');
                            setTimeout(function() {
                                $output.removeClass("active");
                            }, 6000);
                        },
                        beforeSend: function(data) {
                            if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                                return false;
                            $output.html('Submitting...').addClass('active');
                        }
                    });
                    var inputs = $this[0].getElementsByTagName('input');
                    for (var i = 0; i < inputs.length; i++) {
                        inputs[i].value = '';
                        var label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
                        if (label) label.classList.remove('focus', 'not-empty');
                    }
                    return false;
                }, $campaignItem));
            }
        }
        if (plugins.rdMailForm.length) {
            var i, j, k, msg = {
                'MF000': 'Successfully sent!',
                'MF001': 'Recipients are not set!',
                'MF002': 'Form will not work locally!',
                'MF003': 'Please, define email field in your form!',
                'MF004': 'Please, define type of your form!',
                'MF254': 'Something went wrong with PHPMailer!',
                'MF255': 'Aw, snap! Something went wrong.'
            };
            for (i = 0; i < plugins.rdMailForm.length; i++) {
                var $form = $(plugins.rdMailForm[i]),
                    formHasCaptcha = false;
                $form.attr('novalidate', 'novalidate').ajaxForm({
                    data: {
                        "form-type": $form.attr("data-form-type") || "contact",
                        "counter": i
                    },
                    beforeSubmit: function(arr, $form, options) {
                        if (isNoviBuilder)
                            return;
                        var form = $(plugins.rdMailForm[this.extraData.counter]),
                            inputs = form.find("[data-constraints]"),
                            output = $("#" + form.attr("data-form-output")),
                            captcha = form.find('.recaptcha'),
                            captchaFlag = true;
                        output.removeClass("active error success");
                        if (isValidated(inputs, captcha)) {
                            if (captcha.length) {
                                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                                    captchaMsg = {
                                        'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                                        'CPT002': 'Something wrong with google reCaptcha'
                                    };
                                formHasCaptcha = true;
                                $.ajax({
                                    method: "POST",
                                    url: "bat/reCaptcha.php",
                                    data: {
                                        'g-recaptcha-response': captchaToken
                                    },
                                    async: false
                                }).done(function(responceCode) {
                                    if (responceCode !== 'CPT000') {
                                        if (output.hasClass("snackbars")) {
                                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')
                                            setTimeout(function() {
                                                output.removeClass("active");
                                            }, 3500);
                                            captchaFlag = false;
                                        } else {
                                            output.html(captchaMsg[responceCode]);
                                        }
                                        output.addClass("active");
                                    }
                                });
                            }
                            if (!captchaFlag) {
                                return false;
                            }
                            form.addClass('form-in-process');
                            if (output.hasClass("snackbars")) {
                                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                                output.addClass("active");
                            }
                        } else {
                            return false;
                        }
                    },
                    error: function(result) {
                        if (isNoviBuilder)
                            return;
                        var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
                            form = $(plugins.rdMailForm[this.extraData.counter]);
                        output.text(msg[result]);
                        form.removeClass('form-in-process');
                        if (formHasCaptcha) {
                            grecaptcha.reset();
                        }
                    },
                    success: function(result) {
                        if (isNoviBuilder)
                            return;
                        var form = $(plugins.rdMailForm[this.extraData.counter]),
                            output = $("#" + form.attr("data-form-output")),
                            select = form.find('select');
                        form.addClass('success').removeClass('form-in-process');
                        if (formHasCaptcha) {
                            grecaptcha.reset();
                        }
                        result = result.length === 5 ? result : 'MF255';
                        output.text(msg[result]);
                        if (result === "MF000") {
                            if (output.hasClass("snackbars")) {
                                output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
                            } else {
                                output.addClass("active success");
                            }
                        } else {
                            if (output.hasClass("snackbars")) {
                                output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
                            } else {
                                output.addClass("active error");
                            }
                        }
                        form.clearForm();
                        if (select.length) {
                            select.select2("val", "");
                        }
                        form.find('input, textarea').trigger('blur');
                        setTimeout(function() {
                            output.removeClass("active error success");
                            form.removeClass('success');
                        }, 3500);
                    }
                });
            }
        }
        if (plugins.lightGallery.length) {
            for (var i = 0; i < plugins.lightGallery.length; i++) {
                initLightGallery(plugins.lightGallery[i]);
            }
        }
        if (plugins.lightGalleryItem.length) {
            var notCarouselItems = [];
            for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
                if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
                    notCarouselItems.push(plugins.lightGalleryItem[z]);
                }
            }
            plugins.lightGalleryItem = notCarouselItems;
            for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
                initLightGalleryItem(plugins.lightGalleryItem[i]);
            }
        }
        if (plugins.lightDynamicGalleryItem.length) {
            for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
                initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
            }
        }
        if (plugins.customToggle.length) {
            for (var i = 0; i < plugins.customToggle.length; i++) {
                var $this = $(plugins.customToggle[i]);
                $this.on('click', $.proxy(function(event) {
                    event.preventDefault();
                    var $ctx = $(this);
                    $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
                }, $this));
                if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
                    $body.on("click", $this, function(e) {
                        if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length && e.data.find($(e.target)).length === 0) {
                            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                        }
                    })
                }
                if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
                    $body.on("click", $this, function(e) {
                        if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
                            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                        }
                    })
                }
            }
        }
        if (plugins.counter.length) {
            for (var i = 0; i < plugins.counter.length; i++) {
                var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
                $document.on("scroll", $.proxy(function() {
                    var $this = this;
                    if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
                        $this.countTo({
                            refreshInterval: 40,
                            from: 0,
                            to: parseInt($this.text(), 10),
                            speed: $this.attr("data-speed") || 1000,
                            formatter: function(value, options) {
                                value = value.toFixed(options.decimals);
                                if (value > 10000) {
                                    var newValue = "",
                                        stringValue = value.toString();
                                    for (var k = stringValue.length; k >= 0; k -= 3) {
                                        if (k <= 3) {
                                            newValue = ' ' + stringValue.slice(0, k) + newValue;
                                        } else {
                                            newValue = ',' + stringValue.slice(k - 3, k) + newValue;
                                        }
                                    }
                                    return newValue;
                                } else {
                                    return value;
                                }
                            }
                        });
                        $this.addClass('animated');
                    }
                }, $counterNotAnimated)).trigger("scroll");
            }
        }
        if (plugins.dateCountdown.length) {
            for (var i = 0; i < plugins.dateCountdown.length; i++) {
                var
                    dateCountdownItem = $(plugins.dateCountdown[i]),
                    countdownRender = function() {
                        dateCountdownItem.TimeCircles({
                            time: {
                                Seconds: {
                                    show: !(window.innerWidth < 768),
                                }
                            }
                        }).rebuild();
                    };
                dateCountdownItem.TimeCircles({
                    color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
                    animation: "smooth",
                    bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.6,
                    circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
                    fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.03,
                    time: {
                        Days: {
                            text: "Days",
                            show: true,
                            color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                        },
                        Hours: {
                            text: "Hours",
                            show: true,
                            color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                        },
                        Minutes: {
                            text: "Minutes",
                            show: true,
                            color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                        },
                        Seconds: {
                            text: "Seconds",
                            show: false,
                            color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                        }
                    }
                });
                countdownRender();
                window.addEventListener('resize', countdownRender);
            }
        }
        if (plugins.progressLinear.length) {
            for (i = 0; i < plugins.progressLinear.length; i++) {
                var progressBar = $(plugins.progressLinear[i]);
                $window.on("scroll load", $.proxy(function() {
                    var bar = $(this);
                    if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
                        var end = parseInt($(this).find('.progress-value').text(), 10);
                        bar.find('.progress-bar-linear').css({
                            width: end + '%'
                        });
                        bar.find('.progress-value').countTo({
                            refreshInterval: 40,
                            from: 0,
                            to: end,
                            speed: 500
                        });
                        bar.addClass('animated-first');
                    }
                }, progressBar));
                $document.trigger('scroll');
            }
        }
        if (plugins.materialParallax.length) {
            if (!isNoviBuilder && !isIE && !isMobile) {
                plugins.materialParallax.parallax();
                $window.on('load', function() {
                    setTimeout(function() {
                        $window.scroll();
                    }, 500);
                });
            } else {
                for (var i = 0; i < plugins.materialParallax.length; i++) {
                    var parallax = $(plugins.materialParallax[i]),
                        imgPath = parallax.data("parallax-img");
                    parallax.css({
                        "background-image": 'url(' + imgPath + ')',
                        "background-size": "cover"
                    });
                }
            }
        }
        if (plugins.vide.length) {
            for (var i = 0; i < plugins.vide.length; i++) {
                var $element = $(plugins.vide[i]),
                    videObj = $element.data("vide").getVideoObject();
                if (isNoviBuilder || !isScrolledIntoView($element)) {
                    videObj.pause();
                }
                document.addEventListener('scroll', function($element, videObj) {
                    return function() {
                        if (!isNoviBuilder && (isScrolledIntoView($element) || videObj.pause())) videObj.play();
                        else videObj.pause();
                    }
                }($element, videObj));
            }
        }
        if (plugins.buttonWinona.length && !isNoviBuilder) {
            initWinonaButtons(plugins.buttonWinona);
        }

        function initWinonaButtons(buttons) {
            for (var i = 0; i < buttons.length; i++) {
                var $button = $(buttons[i]),
                    innerContent = $button.html();
                $button.html('');
                $button.append('<div class="content-original">' + innerContent + '</div>');
                $button.append('<div class="content-dubbed">' + innerContent + '</div>');
            }
        }
        if (plugins.slick.length) {
            for (var i = 0; i < plugins.slick.length; i++) {
                var $slickItem = $(plugins.slick[i]);
                $slickItem.slick({
                    slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
                    asNavFor: $slickItem.attr('data-for') || false,
                    dots: $slickItem.attr("data-dots") === "true",
                    infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
                    focusOnSelect: true,
                    fade: $slickItem.attr("data-fade") === "true",
                    arrows: $slickItem.attr("data-arrows") === "true",
                    swipe: $slickItem.attr("data-swipe") === "true",
                    autoplay: $slickItem.attr("data-autoplay") === "true",
                    vertical: $slickItem.attr("data-vertical") === "true",
                    centerMode: $slickItem.attr("data-center-mode") === "true",
                    centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
                    mobileFirst: true,
                    responsive: [{
                        breakpoint: 0,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1
                        }
                    }]
                }).on('afterChange', function(event, slick, currentSlide, nextSlide) {
                    var $this = $(this),
                        childCarousel = $this.attr('data-child');
                    if (childCarousel) {
                        $(childCarousel + ' .slick-slide').removeClass('slick-current');
                        $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
                    }
                });
            }
        }
        if (plugins.videoOverlay.length) {
            for (var i = 0; i < plugins.videoOverlay.length; i++) {
                var overlay = $(plugins.videoOverlay[i]);
                if (overlay) {
                    overlay.css({
                        'opacity': '1'
                    });
                    overlay.on('click', function() {
                        $(this).animate({
                            opacity: 0
                        }, function() {
                            this.style.display = 'none';
                        });
                    });
                }
            }
        }
        if (plugins.d3Charts.length) {
            for (var i = 0; i < plugins.d3Charts.length; i++) {
                var d = $(plugins.d3Charts[i]),
                    lineChart, lineChartObject = {
                        bindto: '#line-chart',
                        color: {
                            pattern: ['#c30734', '#aeb1be']
                        },
                        point: {
                            show: false,
                            r: 4
                        },
                        padding: {
                            left: 65,
                            right: 30,
                            top: 0,
                            bottom: 0
                        },
                        data: {
                            x: 'x',
                            columns: [
                                ['x', '2013-01-01', '2013-06-01', '2014-01-01', '2014-05-01', '2015-01-01', '2015-06-01', '2016-05-01', '2017-01-01', '2017-06-01', '2017-09-01', '2018-01-01'],
                                ['data1', 200, 450, 350, 580, 620, 580, 580, 1100, 820, 900, 1200],
                                ['data2', 400, 500, 100, 1000, 1100, 840, 400, 700, 550, 700, 650]
                            ],
                            axes: {
                                data1: 'y'
                            },
                            type: 'spline',
                            names: {
                                data1: d.attr('data-title1') ? d.attr('data-title1') : 'Earnings',
                                data2: d.attr('data-title2') ? d.attr('data-title2') : 'Expenses'
                            }
                        },
                        spline: {
                            interpolation: {
                                type: 'basis'
                            }
                        },
                        legend: {
                            show: true,
                            position: 'bottom'
                        },
                        grid: {
                            x: {
                                show: true
                            },
                            y: {
                                show: false
                            }
                        },
                        labels: true,
                        axis: {
                            x: {
                                type: 'timeseries',
                                min: '2012-01-01',
                                max: '2019-01-01',
                                values: [2013, 2014, 2015, 2016, 2017, 2018],
                                tick: {
                                    format: '%Y',
                                    outer: false
                                },
                                padding: {
                                    left: 0,
                                    right: 10
                                }
                            },
                            y: {
                                min: 200,
                                max: 1200,
                                label: {
                                    text: d.attr('data-name-axisY') ? d.attr('data-name-axisY') : '$',
                                    position: 'inner-top'
                                },
                                tick: {
                                    outer: false,
                                    format: function(x) {
                                        return x + 'k';
                                    }
                                },
                                padding: {
                                    top: 50,
                                    bottom: 50
                                }
                            }
                        },
                        line: {
                            connectNull: true
                        }
                    };
                lineChart = c3.generate(lineChartObject);
                d3.select('.d3-chart-wrap').insert('div', '.d3-chart + *').attr('class', 'd3-chart-legend').selectAll('span').data(['data1', 'data2']).enter().append('span').attr('data-id', function(id) {
                    return id;
                }).html(function(id) {
                    return lineChartObject.data.names[id] ? lineChartObject.data.names[id] : id;
                }).on('mouseover', function(id) {
                    lineChart.focus(id);
                }).on('mouseout', function(id) {
                    lineChart.revert();
                });
            }
        }
        if (plugins.selectFilter.length) {
            for (var i = 0; i < plugins.selectFilter.length; i++) {
                var select = $(plugins.selectFilter[i]);
                select.select2({
                    placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
                    minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : 10,
                    maximumSelectionSize: 3,
                    dropdownCssClass: select.attr("data-dropdown-class") ? select.attr("data-dropdown-class") : ''
                });
            }
        }
        if (plugins.hoverdir.length) {
            initHoverDir(plugins.hoverdir);
        }
        SmoothScroll({
            frameRate: 150,
            animationTime: 200,
            stepSize: 95,
        });
    });
}());