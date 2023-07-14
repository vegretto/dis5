$(document).ready(function () {

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

    const hideExcesses = (element, resolution) => {
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
        hideExcesses($(this), 991)
    })
});


