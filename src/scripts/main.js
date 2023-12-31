$(document).ready(function () {
    //Подгрузка скриптов
    function loadScript(url, callback) {

        const script = document.createElement("script");
        script.onload = function () {
            callback();
        };

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    //Находит ширину скроллбара
    const getScrollBarWidth = () => {
        let el = document.createElement("div");
        el.style.cssText = "overflow:scroll; position:absolute;";
        document.body.appendChild(el);
        let width = el.offsetWidth - el.clientWidth;
        el.remove();
        return width;
    }

    //Модалки
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

    //Селекты
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

    //Показывает инпут промокода в формах по клику
    $('.js-show-promocode').on('click', function () {
        $(this).hide()
        $(this).siblings('.js-promocode-input').show()
    })

    //Добавляет кнопку и функционал "Показать еще"
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

    //Слайдеры
    const testimonialsSlider = new Swiper('.js-testimonials-slider', {
        slidesPerView: 1,
        loop: true,
        autoHeight: true,
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

    const workExamplesSlider = new Swiper('.js-work-examples-slider', {
        slidesPerView: 1,
        loop: true,
        autoHeight: true,
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

    //Аккордион
    $('.js-accordion-toggle').on('click', function () {
        if (!$(this).hasClass('opened')) {
            $(this).next('.js-accordion-head').slideDown(300).addClass('opened')
            $(this).addClass('opened')
        } else {
            $(this).next('.js-accordion-head').slideUp(300).removeClass('opened')
            $(this).removeClass('opened')
        }
    })

    //Карта
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

    //Валидация форм
    const validateInput = (input, inputValue, inputType) => {
        let errorMessage = ''
        if (validator.isEmpty(inputValue)) {
            errorMessage = "Необходимо заполнить"
            return errorMessage
        }
        switch (inputType) {
            case 'email':
                if (!validator.isEmail(inputValue)) errorMessage = 'Не похоже на e-mail'
                break
            default:
                break
        }
        return errorMessage
    }

    const renderError = (element, errorText) => {
        element.addClass('has-error')
        element.next('.validation-error').remove()
        element.after(`<div class="validation-error">${errorText}</div>`)
        setTimeout(function () {
            element.next('.validation-error').remove()
        }, 5000)
    }

    const removeError = (element) => {
        element.removeClass('has-error')
        element.next('.validation-error').remove()
    }

    $('.js-validator').on('submit', function (e) {
        const inputs = $(this).find('.js-input-required')
        inputs.each(function () {
            const inputValue = $(this).val()
            const inputType = $(this).attr('data-validator-type')
            const errorMessage = validateInput($(this), inputValue, inputType)

            if (!validator.isEmpty(errorMessage)) {
                e.preventDefault()
                renderError($(this), errorMessage)
            } else {
                removeError($(this))
            }
        })
    })

    //Выводит контактную информацию из JSON по нужному городу на странице контактов
    const renderContacts = (cityName, jsonPath) => {
        $.getJSON(jsonPath, function(data) {
            const currentCity = data.find(city => city.name === cityName)
            const [phone, mail] = [currentCity.phone, currentCity.mail]
            const sanitizedPhone = phone.replace(/\W/g, '')
            $('.js-contacts-phone').text(phone).attr('href', `tel:${sanitizedPhone}`).removeClass('placeholder')
            $('.js-contacts-mail').text(mail).attr('href', `mailto:${mail}`).removeClass('placeholder')
        })
    }

    //Выводим заданный дефолтный город при загрузке страницы контактов
    if ($('.contacts-pg').length > 0) {
        renderContacts('Владивосток', './data/contacts.json')
    }

    //Выводит список городов из JSON на странице контактов
    if ($('.js-cities-list').length > 0) {
        const letters = []
        $.getJSON('./data/contacts.json', function(data) {
            data.forEach(city => {
                const firstLetter = city.name.charAt(0)
                if (!letters.includes(firstLetter)) letters.push(firstLetter)
            })

            letters.sort()

            letters.forEach(letter => {
                const citiesItems = data.reduce((result, city) => {
                    if (city.name.charAt(0) === letter) {
                        result.push(`<div class="contacts-cities__item-city js-render-contacts">${city.name}</div>`)
                    }
                    return result
                }, [])

                const cityItem = `
                <div class="contacts-cities__item">
                    <div class="contacts-cities__item-letter">${letter}</div>
                    ${citiesItems.join("")}
                </div>`

                $('.js-cities-list').append(cityItem)
            })
        })

        $(document).on('click', '.js-render-contacts', function () {
            renderContacts($(this).text(), './data/contacts.json')
        })
    }

});


