const solveButton = document.getElementById("solve-button");

const inputA = document.getElementById("coefficient-a");
const inputB = document.getElementById("coefficient-b");
const inputC = document.getElementById("coefficient-c");
const inputD = document.getElementById("coefficient-d");

const output = document.getElementById("solution-output");


solveButton.addEventListener("click", solveEquation);


/* =========================================================
   MAIN SOLVER
   ========================================================= */

function solveEquation() {

    const a = parseFloat(inputA.value);
    const b = parseFloat(inputB.value);
    const c = parseFloat(inputC.value);
    const d = parseFloat(inputD.value);


    /* Check for empty or invalid input */

    if (
        isNaN(a) ||
        isNaN(b) ||
        isNaN(c) ||
        isNaN(d)
    ) {

        showError("Please enter valid numerical coefficients.");

        return;
    }


    const epsilon = 1e-10;


    /* Determine equation type */

    if (Math.abs(a) < epsilon) {

        solveQuadratic(b, c, d, epsilon);

    } else {

        solveCubic(a, b, c, d, epsilon);

    }

}


/* =========================================================
   CUBIC EQUATION
   ax³ + bx² + cx + d = 0
   ========================================================= */

function solveCubic(a, b, c, d, epsilon) {

    /*
        Convert cubic equation into depressed cubic:

        y³ + py + q = 0

        where:

        x = y - b/(3a)
    */


    const p =
        (3 * a * c - b * b) /
        (3 * a * a);


    const q =
        (
            2 * b * b * b
            - 9 * a * b * c
            + 27 * a * a * d
        ) /
        (27 * a * a * a);


    const discriminant =
        Math.pow(q / 2, 2)
        +
        Math.pow(p / 3, 3);


    const shift = b / (3 * a);


    let roots = [];


    /* -----------------------------------------------------
       ONE REAL ROOT + TWO COMPLEX ROOTS
       ----------------------------------------------------- */

    if (discriminant > epsilon) {

        const sqrtDiscriminant =
            Math.sqrt(discriminant);


        const u =
            Math.cbrt(
                -q / 2 + sqrtDiscriminant
            );


        const v =
            Math.cbrt(
                -q / 2 - sqrtDiscriminant
            );


        const realRoot =
            u + v - shift;


        const realPart =
            -(u + v) / 2 - shift;


        const imaginaryPart =
            Math.abs(
                Math.sqrt(3) * (u - v) / 2
            );


        roots = [

            {
                real: realRoot,
                imaginary: 0
            },

            {
                real: realPart,
                imaginary: imaginaryPart
            },

            {
                real: realPart,
                imaginary: -imaginaryPart
            }

        ];


        displayResults(
            "CUBIC EQUATION",
            "ONE REAL ROOT · TWO COMPLEX ROOTS",
            roots
        );

    }


    /* -----------------------------------------------------
       REPEATED ROOTS
       ----------------------------------------------------- */

    else if (Math.abs(discriminant) <= epsilon) {

        const u =
            Math.cbrt(-q / 2);


        const root1 =
            2 * u - shift;


        const root2 =
            -u - shift;


        roots = [

            {
                real: root1,
                imaginary: 0
            },

            {
                real: root2,
                imaginary: 0
            },

            {
                real: root2,
                imaginary: 0
            }

        ];


        displayResults(
            "CUBIC EQUATION",
            "REPEATED REAL ROOTS",
            roots
        );

    }


    /* -----------------------------------------------------
       THREE DISTINCT REAL ROOTS
       ----------------------------------------------------- */

    else {

        const radius =
            2 * Math.sqrt(-p / 3);


        const argument =
            (-q / 2) /
            Math.sqrt(
                Math.pow(-p / 3, 3)
            );


        /*
            Numerical safety:
            acos requires a value between -1 and 1.
        */

        const clampedArgument =
            Math.max(
                -1,
                Math.min(1, argument)
            );


        const phi =
            Math.acos(clampedArgument);


        for (let k = 0; k < 3; k++) {

            const root =
                radius *
                Math.cos(
                    (phi + 2 * Math.PI * k) / 3
                )
                -
                shift;


            roots.push({
                real: root,
                imaginary: 0
            });

        }


        roots.sort(
            (root1, root2) =>
                root2.real - root1.real
        );


        displayResults(
            "CUBIC EQUATION",
            "THREE DISTINCT REAL ROOTS",
            roots
        );

    }

}


/* =========================================================
   QUADRATIC EQUATION
   bx² + cx + d = 0
   ========================================================= */

function solveQuadratic(b, c, d, epsilon) {

    /*
        If b is also zero,
        the equation becomes linear.
    */

    if (Math.abs(b) < epsilon) {

        solveLinear(c, d, epsilon);

        return;

    }


    const discriminant =
        c * c - 4 * b * d;


    let roots = [];


    /* Two real roots */

    if (discriminant > epsilon) {

        const sqrtDiscriminant =
            Math.sqrt(discriminant);


        roots = [

            {
                real:
                    (-c + sqrtDiscriminant)
                    / (2 * b),

                imaginary: 0
            },

            {
                real:
                    (-c - sqrtDiscriminant)
                    / (2 * b),

                imaginary: 0
            }

        ];


        displayResults(
            "QUADRATIC EQUATION",
            "TWO REAL ROOTS",
            roots
        );

    }


    /* Repeated root */

    else if (Math.abs(discriminant) <= epsilon) {

        const root =
            -c / (2 * b);


        roots = [

            {
                real: root,
                imaginary: 0
            },

            {
                real: root,
                imaginary: 0
            }

        ];


        displayResults(
            "QUADRATIC EQUATION",
            "REPEATED REAL ROOT",
            roots
        );

    }


    /* Complex roots */

    else {

        const realPart =
            -c / (2 * b);


        const imaginaryPart =
            Math.sqrt(-discriminant)
            /
            (2 * b);


        roots = [

            {
                real: realPart,
                imaginary: Math.abs(imaginaryPart)
            },

            {
                real: realPart,
                imaginary: -Math.abs(imaginaryPart)
            }

        ];


        displayResults(
            "QUADRATIC EQUATION",
            "TWO COMPLEX ROOTS",
            roots
        );

    }

}


/* =========================================================
   LINEAR EQUATION
   cx + d = 0
   ========================================================= */

function solveLinear(c, d, epsilon) {

    if (Math.abs(c) < epsilon) {

        if (Math.abs(d) < epsilon) {

            showError(
                "The equation has infinitely many solutions."
            );

        } else {

            showError(
                "The equation has no solution."
            );

        }

        return;

    }


    const root =
        -d / c;


    displayResults(
        "LINEAR EQUATION",
        "ONE REAL ROOT",
        [
            {
                real: root,
                imaginary: 0
            }
        ]
    );

}


/* =========================================================
   DISPLAY RESULTS
   ========================================================= */

function displayResults(
    equationType,
    solutionType,
    roots
) {

    let rootHTML = "";


    roots.forEach((root, index) => {

        const isReal =
            Math.abs(root.imaginary) < 1e-10;


        const rootClass =
            isReal
                ? "real-root"
                : "complex-root";


        const rootType =
            isReal
                ? "REAL ROOT"
                : "COMPLEX ROOT";


        rootHTML += `

            <div class="result-root-card ${rootClass}">

                <div class="result-root-number">

                    <span>ROOT</span>

                    <strong>
                        ${String(index + 1).padStart(2, "0")}
                    </strong>

                </div>


                <div class="result-root-content">

                    <div class="result-root-value">

                        ${formatRoot(root)}

                    </div>

                    <div class="result-root-type">

                        ${rootType}

                    </div>

                </div>

            </div>

        `;

    });


    output.innerHTML = `

        <div class="solver-result-display">


            <div class="solver-result-header">

                <span class="result-equation-type">

                    ${equationType}

                </span>


                <h3>

                    ${solutionType}

                </h3>

            </div>


            <div class="result-roots">

                ${rootHTML}

            </div>


            <div class="solver-result-footer">

                <div class="result-footer-symbol">

                    Σ

                </div>


                <div class="result-footer-count">

                    <span>
                        ROOTS COMPUTED
                    </span>

                    <strong>
                        ${roots.length}
                    </strong>

                </div>


                <div class="result-footer-status">

                    ANALYTICAL SOLUTION

                </div>

            </div>


        </div>

    `;

}


/* =========================================================
   ROOT FORMATTING
   ========================================================= */

function formatRoot(root) {

    const real =
        cleanNumber(root.real);


    const imaginary =
        cleanNumber(
            Math.abs(root.imaginary)
        );


    /* Real root */

    if (Math.abs(root.imaginary) < 1e-10) {

        return real;

    }


    /* Complex root */

    const sign =
        root.imaginary >= 0
            ? "+"
            : "−";


    return `${real} ${sign} ${imaginary}i`;

}


/* =========================================================
   NUMBER CLEANUP
   ========================================================= */

function cleanNumber(number) {

    if (Math.abs(number) < 1e-10) {

        number = 0;

    }


    return parseFloat(
        number.toFixed(6)
    );

}


/* =========================================================
   ERROR DISPLAY
   ========================================================= */

function showError(message) {

    output.innerHTML = `

        <div class="solution-error">

            <div class="error-symbol">
                !
            </div>

            <p>
                ${message}
            </p>

        </div>

    `;

}