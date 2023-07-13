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
});


