const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");


/* ========================================
   MOBILE MENU
======================================== */

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

        mainNav.classList.toggle("open");

        const isOpen = mainNav.classList.contains("open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    /* CLOSE MENU AFTER CLICKING LINK */

    const navLinks =
        mainNav.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mainNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}