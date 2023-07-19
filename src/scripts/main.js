$(document).ready(function () {

    function loadScript(url, callback) {

        const script = document.createElement("script");
        script.onload = function () {
            callback();
        };

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    //Задержка действия на событие
    const debounce = function (func, time) {
        let timer
        return function (event) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(func, time, event)
        }
    }

    const getScrollBarWidth = () => {
        let el = document.createElement("div");
        el.style.cssText = "overflow:scroll; position:absolute;";
        document.body.appendChild(el);
        let width = el.offsetWidth - el.clientWidth;
        el.remove();
        return width;
    }

    const closeModal = (id) => {
        const modal = $(`.modal#${id}`)
        const burger = $('.header__mobile-menu-toggle')
        modal.removeClass('opened')
        $(`#modalBg--${id}`).remove()
        $('body').removeClass('modal-opened').css('padding-right', 0)
        burger.css('display') === 'none' &&  burger.show()
    }

    const openModal = (id) => {
        const modal = $(`.modal#${id}`)
        modal.addClass('opened')
        modal.append(`<div class="modal-bg" id="modalBg--${id}"></div>`)
        $('body').addClass('modal-opened').css('padding-right', getScrollBarWidth())
        $(`#modalBg--${id}`).on('click', function () {
            $(this).remove()
            closeModal(id)
        })
    }

    $('.js-open-modal').on('click', function () {
        openModal($(this).attr('data-modal'))
        if ($(this).attr('data-mob-menu')) {
            $('.header__mobile-menu-toggle').hide()
        }
    })

    $('.js-close-modal').on('click', function () {
        const modalId = $(this).parents('.modal').attr('id')
        closeModal(modalId)
    })

    $('.js-toggle-mobile-menu-dropdown').on('click', function () {
        const menuItem = $(this).parents('.mobile-menu-nav__item')
        const dropdownBox = menuItem.find('.mobile-menu-nav__dropdown-box')
        menuItem.toggleClass('opened')
        dropdownBox.toggleClass('opened')
        dropdownBox.slideToggle(200)
    })

    const searchSelects = $(".js-search-select")

    searchSelects.each(function () {
        $(this).select2({
            placeholder: 'Тип работы',
            dropdownPosition: 'below',
            minimumResultsForSearch: -1,
            width: '100%',
            dropdownParent: $(this).parents('.select-wrapper')
        })
    })

    $('.js-show-promocode').on('click', function () {
        $(this).hide()
        $(this).siblings('.js-promocode-input').show()
    })

    const hideSome = (element, resolution) => {
        if (screen.width > resolution) return
        const maxItems = element.attr('data-max-items')
        const itemsToShow = element.attr('data-items-to-show')
        const items = element.children()
        const itemsQty = items.length
        if (itemsQty <= maxItems) return
        items.each(function (index) {
            if (index >= maxItems) $(this).hide().addClass('hidden')
        })
        const moreBtnMarkup = '<button class="more-button js-more-btn common-btn common-btn--purple">Ещё...</button>'
        element.append(moreBtnMarkup)
        const moreBtnDom = element.find('.js-more-btn')
        moreBtnDom.on('click', function () {
            const hiddenItems = element.children('.hidden')
            if (hiddenItems.length <= itemsToShow) moreBtnDom.remove()
            hiddenItems.each(function (index) {
                if (index < itemsToShow) $(this).show().removeClass('hidden')
            })
        })
    }

    $('.js-hide-some').each(function () {
        hideSome($(this), 991)
    })

    const testimonialsSlider = new Swiper('.js-testimonials-slider', {
        slidesPerView: 1,
        loop: true,
        navigation: {
            prevEl: '.swiper-button--prev',
            nextEl: '.swiper-button--next',
        },
        breakpoints: {
            992: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1365: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        }
    });

    $('.js-accordion-toggle').on('click', function () {
        if (!$(this).hasClass('opened')) {
            $(this).next('.js-accordion-head').slideDown(300).addClass('opened')
            $(this).addClass('opened')
        } else {
            $(this).next('.js-accordion-head').slideUp(300).removeClass('opened')
            $(this).removeClass('opened')
        }
    })

    const mainMap = document.getElementById('mainMap')

    async function initYMap() {
        await ymaps3.ready;
        const {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
        } = ymaps3;

        const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
        const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

        const map = new YMap(document.getElementById('mainMap'), {
            location: {
                center: [37.591701, 55.749385],
                zoom: 16
            },
            behaviors: ['pinchZoom', 'drag']
        });

        map.addChild(new  YMapDefaultSchemeLayer());
        map.addChild(new YMapDefaultFeaturesLayer());
        map.addChild(new YMapControls({position: 'left'}).addChild(new YMapZoomControl()));

        const markerContent = `<div><strong>Офис Work5</strong><div>
                               <div>офис 468, этаж 4</div>`

        map.addChild(new YMapDefaultMarker({
            coordinates: [37.591701, 55.749385],
            popup: {
                content: markerContent,
                position: 'right'
            }
        }));
    }

    let mapIsVisible = $(mainMap).visible(true)

    const checkMapVisibility = () => {
        mapIsVisible = $(mainMap).visible(true)
        if (mapIsVisible) {
            loadScript('https://api-maps.yandex.ru/v3/?apikey=b94d7ec3-5178-446e-81c0-18bb45ea93c8&lang=ru_RU',
                initYMap)
            window.removeEventListener('scroll', checkMapVisibility)
        }
    }

    if (mapIsVisible) {
        loadScript('https://api-maps.yandex.ru/v3/?apikey=b94d7ec3-5178-446e-81c0-18bb45ea93c8&lang=ru_RU',
            initYMap)
    } else {
        window.addEventListener('scroll', checkMapVisibility, {passive: true});
    }
});


