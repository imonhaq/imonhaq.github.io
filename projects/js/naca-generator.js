/* =========================================================
   NACA 4-DIGIT AIRFOIL GENERATOR
   Works with the existing naca-generator.html structure
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const nacaInput = document.getElementById("naca-number");

const pointInput = document.getElementById("point-count");

const generateButton =
    document.querySelector(".tool-action-button");

const previewArea =
    document.querySelector(".airfoil-placeholder");

const airfoilShape =
    document.querySelector(".airfoil-shape");

const downloadButton =
    document.getElementById("download-airfoil");


let generatedCoordinates = [];

let generatedNACA = "";


/* =========================================================
   VALIDATE NACA NUMBER
========================================================= */

function validateNACA(nacaCode) {

    return /^\d{4}$/.test(nacaCode);

}


/* =========================================================
   GENERATE AIRFOIL
========================================================= */

function generateAirfoil() {


    /* -----------------------------------------------------
       GET INPUT VALUES
    ----------------------------------------------------- */

    const nacaCode =
        nacaInput.value.trim();


    let pointCount =
        parseInt(pointInput.value);


    /* -----------------------------------------------------
       VALIDATE NACA NUMBER
    ----------------------------------------------------- */

    if (!validateNACA(nacaCode)) {

        showError(
            "ENTER A VALID 4-DIGIT NACA DESIGNATION"
        );

        return;

    }


    /* -----------------------------------------------------
       DEFAULT POINT COUNT
    ----------------------------------------------------- */

    if (isNaN(pointCount)) {

        pointCount = 100;

    }


    if (pointCount < 20) {

        pointCount = 20;

    }


    if (pointCount > 500) {

        pointCount = 500;

    }


    /* -----------------------------------------------------
       EXTRACT NACA PARAMETERS

       Example:
       NACA 2412

       m = 0.02
       p = 0.4
       t = 0.12
    ----------------------------------------------------- */

    const m =
        parseInt(nacaCode.charAt(0)) / 100;


    const p =
        parseInt(nacaCode.charAt(1)) / 10;


    const t =
        parseInt(nacaCode.substring(2, 4)) / 100;


    /* -----------------------------------------------------
       GENERATE SURFACE POINTS
    ----------------------------------------------------- */

    const upperSurface = [];

    const lowerSurface = [];


    for (
        let i = 0;
        i <= pointCount;
        i++
    ) {


        /* COSINE SPACING */

        const beta =
            Math.PI * i / pointCount;


        const x =
            0.5 * (
                1 - Math.cos(beta)
            );


        /* -------------------------------------------------
           THICKNESS DISTRIBUTION
        ------------------------------------------------- */

        const yt =
            5 * t * (
                0.2969 * Math.sqrt(x)
                - 0.1260 * x
                - 0.3516 * Math.pow(x, 2)
                + 0.2843 * Math.pow(x, 3)
                - 0.1015 * Math.pow(x, 4)
            );


        /* -------------------------------------------------
           CAMBER LINE
        ------------------------------------------------- */

        let yc = 0;

        let dyc_dx = 0;


        if (
            m !== 0 &&
            p !== 0
        ) {


            if (x < p) {


                yc =
                    (m / Math.pow(p, 2))
                    * (
                        2 * p * x
                        - Math.pow(x, 2)
                    );


                dyc_dx =
                    (2 * m / Math.pow(p, 2))
                    * (
                        p - x
                    );

            }


            else {


                yc =
                    (m / Math.pow(1 - p, 2))
                    * (
                        (1 - 2 * p)
                        + (2 * p * x)
                        - Math.pow(x, 2)
                    );


                dyc_dx =
                    (2 * m / Math.pow(1 - p, 2))
                    * (
                        p - x
                    );

            }

        }


        /* -------------------------------------------------
           CAMBER ANGLE
        ------------------------------------------------- */

        const theta =
            Math.atan(dyc_dx);


        /* -------------------------------------------------
           UPPER SURFACE
        ------------------------------------------------- */

        const xu =
            x
            - yt * Math.sin(theta);


        const yu =
            yc
            + yt * Math.cos(theta);


        /* -------------------------------------------------
           LOWER SURFACE
        ------------------------------------------------- */

        const xl =
            x
            + yt * Math.sin(theta);


        const yl =
            yc
            - yt * Math.cos(theta);


        /* -------------------------------------------------
           STORE POINTS
        ------------------------------------------------- */

        upperSurface.push({
            x: xu,
            y: yu
        });


        lowerSurface.push({
            x: xl,
            y: yl
        });

    }


    /* -----------------------------------------------------
       COMBINE AIRFOIL SURFACE

       Trailing Edge
            ↓
       Upper Surface
            ↓
       Leading Edge
            ↓
       Lower Surface
            ↓
       Trailing Edge
    ----------------------------------------------------- */

    const coordinates = [];


    for (
        let i = upperSurface.length - 1;
        i >= 0;
        i--
    ) {

        coordinates.push(
            upperSurface[i]
        );

    }


    for (
        let i = 1;
        i < lowerSurface.length;
        i++
    ) {

        coordinates.push(
            lowerSurface[i]
        );

    }

    /* STORE GENERATED DATA */

    generatedCoordinates = coordinates;
    generatedNACA = nacaCode;

    /* -----------------------------------------------------
       DRAW AIRFOIL
    ----------------------------------------------------- */

    drawAirfoil(
        coordinates,
        nacaCode
    );

}


/* =========================================================
   DRAW AIRFOIL
========================================================= */

function drawAirfoil(
    coordinates,
    nacaCode
) {


    /* -----------------------------------------------------
       REMOVE PREVIOUS OUTPUT
    ----------------------------------------------------- */

    previewArea.innerHTML = "";


    /* -----------------------------------------------------
       CREATE SVG
    ----------------------------------------------------- */

    const svgNamespace =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            svgNamespace,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        "0 0 1000 400"
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "xMidYMid meet"
    );


    svg.classList.add(
        "generated-airfoil-svg"
    );


    /* -----------------------------------------------------
       AIRFOIL REFERENCE AXIS
    ----------------------------------------------------- */

    const axis =
        document.createElementNS(
            svgNamespace,
            "line"
        );


    axis.setAttribute(
        "x1",
        "50"
    );


    axis.setAttribute(
        "y1",
        "200"
    );


    axis.setAttribute(
        "x2",
        "950"
    );


    axis.setAttribute(
        "y2",
        "200"
    );


    axis.setAttribute(
        "class",
        "generated-airfoil-axis"
    );


    svg.appendChild(axis);


    /* -----------------------------------------------------
       CREATE PATH
    ----------------------------------------------------- */

    const path =
        document.createElementNS(
            svgNamespace,
            "path"
        );


    let pathData = "";


    const marginX = 50;

    const centerY = 200;

    const scaleX = 900;

    const scaleY = 900;


    coordinates.forEach(
        function (
            point,
            index
        ) {


            const screenX =
                marginX
                + point.x * scaleX;


            const screenY =
                centerY
                - point.y * scaleY;


            if (index === 0) {

                pathData +=
                    "M "
                    + screenX.toFixed(2)
                    + " "
                    + screenY.toFixed(2);

            }


            else {

                pathData +=
                    " L "
                    + screenX.toFixed(2)
                    + " "
                    + screenY.toFixed(2);

            }

        }
    );


    pathData += " Z";


    path.setAttribute(
        "d",
        pathData
    );


    path.setAttribute(
        "class",
        "generated-airfoil-path"
    );


    svg.appendChild(path);


    /* -----------------------------------------------------
       ADD NACA LABEL
    ----------------------------------------------------- */

    const label =
        document.createElementNS(
            svgNamespace,
            "text"
        );


    label.setAttribute(
        "x",
        "60"
    );


    label.setAttribute(
        "y",
        "60"
    );


    label.setAttribute(
        "class",
        "generated-airfoil-label"
    );


    label.textContent =
        "NACA " + nacaCode;


    svg.appendChild(label);


    /* -----------------------------------------------------
       ADD SVG TO PAGE
    ----------------------------------------------------- */

    previewArea.appendChild(svg);

}


/* =========================================================
   ERROR DISPLAY
========================================================= */

function showError(message) {


    previewArea.innerHTML = "";


    const errorMessage =
        document.createElement("div");


    errorMessage.classList.add(
        "airfoil-error"
    );


    errorMessage.textContent =
        message;


    previewArea.appendChild(
        errorMessage
    );

}

/* =========================================================
   DOWNLOAD AIRFOIL .DAT FILE
========================================================= */

function downloadAirfoil() {


    /* CHECK IF AIRFOIL EXISTS */

    if (
        generatedCoordinates.length === 0
    ) {

        alert(
            "Generate an airfoil before downloading."
        );

        return;

    }


    /* -----------------------------------------------------
       CREATE FILE CONTENT
    ----------------------------------------------------- */

    let fileContent =
        "NACA "
        + generatedNACA
        + "\n";


    generatedCoordinates.forEach(
        function (point) {


            fileContent +=
                point.x.toFixed(6)
                + " "
                + point.y.toFixed(6)
                + "\n";

        }
    );


    /* -----------------------------------------------------
       CREATE FILE
    ----------------------------------------------------- */

    const blob =
        new Blob(
            [fileContent],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "NACA_"
        + generatedNACA
        + ".dat";


    /* -----------------------------------------------------
       TRIGGER DOWNLOAD
    ----------------------------------------------------- */

    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}

/* =========================================================
   BUTTON EVENT
========================================================= */

generateButton.addEventListener(
    "click",
    generateAirfoil
);

downloadButton.addEventListener(
    "click",
    downloadAirfoil
);


/* =========================================================
   INPUT RESTRICTION

   Only allow numbers in NACA designation
========================================================= */

nacaInput.addEventListener(
    "input",
    function () {


        this.value =
            this.value.replace(
                /\D/g,
                ""
            );


        if (
            this.value.length > 4
        ) {

            this.value =
                this.value.substring(
                    0,
                    4
                );

        }

    }
);