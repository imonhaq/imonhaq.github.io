/* =========================================================
   COMING SOON PAGE
========================================================= */


/* =========================================================
   GET URL PARAMETERS
========================================================= */

const parameters =
    new URLSearchParams(
        window.location.search
    );


const pageName =
    parameters.get("page");


const pageType =
    parameters.get("type");


/* =========================================================
   DOM ELEMENTS
========================================================= */

const comingSoonTitle =
    document.getElementById(
        "coming-soon-title"
    );


const comingSoonName =
    document.getElementById(
        "coming-soon-name"
    );


const comingSoonMessage =
    document.getElementById(
        "coming-soon-message"
    );


/* =========================================================
   DEFAULT PAGE
========================================================= */

comingSoonTitle.textContent =
    "COMING SOON";


/* =========================================================
   CUSTOM PAGE NAME
========================================================= */

if (
    pageName !== null &&
    pageName.trim() !== ""
) {

    comingSoonName.textContent =
        pageName;

}


/* =========================================================
   CUSTOM TYPE
========================================================= */

if (pageType === "tool") {

    comingSoonMessage.textContent =
        "This engineering tool is currently being developed.";

}


else if (pageType === "project") {

    comingSoonMessage.textContent =
        "This project page is currently being prepared.";

}


else if (pageType === "update") {

    comingSoonTitle.textContent =
        "UNDER REVISION";


    comingSoonMessage.textContent =
        "This page is currently undergoing updates.";

}