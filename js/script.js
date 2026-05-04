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
