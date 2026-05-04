"use strict";

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

/*-------------------------------------------------------------------------------------------
-----------------------------------------МЕНЮ БУРГЕР---------------------------------------------
-------------------------------------------------------------------------------------------*/

const iconMenu = document.querySelector(".header__icon");
const menuBody = document.querySelector(".menu");

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    document.body.classList.toggle("_lock");
    iconMenu.classList.toggle("_active");
    menuBody.classList.toggle("_active");
  });
}

document.addEventListener("click", function (e) {
  if (iconMenu.contains(e.target)) return;
  if (menuBody.classList.contains("_active")) {
    const clickX = e.clientX;
    if (clickX / window.innerWidth > 0.6) {
      document.body.classList.remove("_lock");
      iconMenu.classList.remove("_active");
      menuBody.classList.remove("_active");
      menuBody.style.left = "";
      menuBody.style.transition = "";
    }
  }
});

/*-------------------------------------------------------------------------------------------
-----------------------------------------ЗАКРЫТИЕ ПО СВАЙПУ И НАЖАТИЮ СПРАВА---------------------------------------------
-------------------------------------------------------------------------------------------*/

if (isMobile.any()) {
  let touchStart, leftStart;
  let menuList = document.querySelector(".menu__list");

  const startHandler = (e) => {
    if (
      menuBody.classList.contains("_active") &&
      !iconMenu.contains(e.target) &&
      !menuList.contains(e.target)
    ) {
      menuBody.style.transition = "left 0s";
      touchStart = e.touches[0].clientX;
      leftStart = parseFloat(window.getComputedStyle(menuBody).left);
    }
  };

  const isSwipeable = (el) => {
    return !el.closest("a, button, .icon-menu, "); // не ссылка, не кнопка, не иконка
  };

  const moveHandler = (e) => {
    if (!menuBody.classList.contains("_active") || !touchStart) return;
    if (!iconMenu.contains(e.target)) {
      e.preventDefault();
      const touchMove = touchStart - e.touches[0].clientX;

      menuBody.style.left = `${leftStart - touchMove}px`;
      console.log(parseFloat(menuBody.style.left));

      if (parseFloat(menuBody.style.left) > 0) {
        menuBody.style.left = `0px`;
      }
    }
  };

  const endHandler = (e) => {
    if (
      !menuBody.classList.contains("_active") ||
      touchStart === undefined ||
      leftStart === undefined
    )
      return;

    const clickX = e.changedTouches[0].clientX;

    menuBody.style.transition = "left 0.3s ease";
    const currentLeft = parseFloat(window.getComputedStyle(menuBody).left);
    const closeThreshold = currentLeft / window.innerWidth < -0.4;

    if (closeThreshold) {
      // закрыть меню
      document.body.classList.remove("_lock");
      iconMenu.classList.remove("_active");
      menuBody.classList.remove("_active");
      // сбросить стили
      menuBody.style.left = "";
      menuBody.style.transition = "";
    } else {
      menuBody.style.left = `${leftStart}px`;
      // сбросить инлайн-стили после анимации
      setTimeout(() => {
        if (menuBody.classList.contains("_active")) {
          menuBody.style.left = "";
          menuBody.style.transition = "";
        }
      }, 300);
    }
    touchStart = leftStart = undefined; // очистить
  };

  document.addEventListener("touchstart", startHandler);
  document.addEventListener("touchmove", moveHandler, { passive: false });
  document.addEventListener("touchend", endHandler);
}

/*-------------------------------------------------------------------------------------------
-----------------------------------------ПЛАВНОЕ ПЕРЕМЕЩЕНИЕ---------------------------------------------
-------------------------------------------------------------------------------------------*/

const headerHeight = document.querySelector("header").offsetHeight;

const menuLinks = document.querySelectorAll(".menu__link[data-goto]");

if (menuLinks.length > 0) {
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });
}

function onMenuLinkClick(e) {
  const menuLink = e.target;

  if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
    const gotoBlock = document.querySelector(menuLink.dataset.goto);
    const gotoBlockValue =
      gotoBlock.getBoundingClientRect().top + pageYOffset - headerHeight;

    if (iconMenu) {
      if (iconMenu.classList.contains("_active")) {
        document.body.classList.remove("_lock");
        iconMenu.classList.remove("_active");
        menuBody.classList.remove("_active");
      }
    }

    window.scrollTo({
      top: gotoBlockValue,
      behavior: "smooth",
    });
    e.preventDefault();
  }
}

/*-------------------------------------------------------------------------------------------
----------------------------------------HEADER ПРИ СКРОЛЛЕ---------------------------------------------
-------------------------------------------------------------------------------------------*/
const header = document.querySelector(".header");

if (window.innerWidth >= 798) {
  function checkHeaderPosition() {
    if (!header) return;

    const distanceFromTop = window.scrollY;

    if (distanceFromTop > 1) {
      header.classList.add("_scroll");
    } else {
      header.classList.remove("_scroll");
    }
  }

  window.addEventListener("scroll", checkHeaderPosition);

  //скрытие

  let lastScrollTop = 0;
  const scrollThreshold = 250;

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let delta = Math.abs(scrollTop - lastScrollTop);

    if (scrollTop > lastScrollTop) {
      if (scrollTop > 250) {
        header.classList.add("_hide");
      }
      lastScrollTop = scrollTop;
    } else {
      if (delta > scrollThreshold) {
        header.classList.remove("_hide");

        lastScrollTop = scrollTop;
      }
    }
  });
}
