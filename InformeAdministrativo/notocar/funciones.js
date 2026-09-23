// ==============================
// GUARDAR FORMULARIO
// ==============================

document.getElementById("btnGuardar").addEventListener("click", guardarFormulario);

function guardarFormulario() {

    const datos = {};

    // INPUTS (excepto radios y checkboxes)
    document.querySelectorAll("input").forEach(input => {

        if (input.type === "radio" || input.type === "checkbox")
            return;

        datos[input.name] = input.value;

    });

    // TEXTAREAS
    document.querySelectorAll("textarea").forEach(textarea => {

        datos[textarea.name] = textarea.value;

    });

    // RADIOS
    const radios = [...new Set(
        [...document.querySelectorAll("input[type=radio]")]
        .map(r => r.name)
    )];

    radios.forEach(nombre => {

        const seleccionado = document.querySelector(
            `input[name="${nombre}"]:checked`
        );

        datos[nombre] = seleccionado ? seleccionado.value : "";

    });

    // CHECKBOXES
    const checks = {};

    document.querySelectorAll("input[type=checkbox]").forEach(check => {

        if (!checks[check.name])
            checks[check.name] = [];

        if (check.checked)
            checks[check.name].push(check.value);

    });

    Object.assign(datos, checks);

    // Descargar archivo
    const archivo = new Blob(
        [JSON.stringify(datos, null, 4)],
        { type: "application/json" }
    );

    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);

    const nro = datos.solicitud || "Formulario";

    enlace.download = nro + ".infadm";

    enlace.click();

    URL.revokeObjectURL(enlace.href);

}

// ==============================
// ABRIR FORMULARIO
// ==============================

document.getElementById("btnAbrir").addEventListener("click", () => {

    document.getElementById("archivoFormulario").click();

});

 document.getElementById("archivoFormulario").addEventListener("change", abrirFormulario);

function abrirFormulario(event) {

    const archivo = event.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e){

        const datos = JSON.parse(e.target.result);

        // INPUTS Y FECHAS
        document.querySelectorAll("input").forEach(input=>{

            if(input.type==="radio" || input.type==="checkbox")
                return;

            if(datos[input.name]!==undefined)
                input.value = datos[input.name];

        });

        // TEXTAREAS
        document.querySelectorAll("textarea").forEach(textarea=>{

            if(datos[textarea.name]!==undefined)
                textarea.value = datos[textarea.name];

        });

        // RADIOS
        document.querySelectorAll("input[type=radio]").forEach(radio=>{

            radio.checked = (datos[radio.name] === radio.value);

        });

        // CHECKBOXES
        document.querySelectorAll("input[type=checkbox]").forEach(check=>{

            check.checked = false;

            if(Array.isArray(datos[check.name])){

                check.checked = datos[check.name].includes(check.value);

            }

        });

    };

    lector.readAsText(archivo);

}


document.getElementById("btnPDF").addEventListener("click", () => {

    window.print();

});

function actualizarFormulario() {

    const bloqueRenovacion = document.getElementById("bloqueRenovacion");
    const apertura = document.getElementById("apertura");
    const renovacion = document.getElementById("renovacion");
    const transferencia = document.getElementById("transferencia");
    const bajaRubro = document.getElementById("bajaRubro");
    const anexoRubro = document.getElementById("anexoRubro");
    const cambioActividad = document.getElementById("cambioActividad");
    const traslado = document.getElementById("traslado");
    const cambioSuperficie = document.getElementById("cambioSuperficie");

    const otros = [
        renovacion,
        transferencia,
        bajaRubro,
        anexoRubro,
        cambioActividad,
        traslado,
        cambioSuperficie
    ];

    // ---------------------------
    // CASO 1: Apertura marcada
    // ---------------------------
    if (apertura.checked) {
        bloqueRenovacion.style.display = "none";

        otros.forEach(c => {

            c.checked = false;
            c.disabled = true;

        });

        apertura.disabled = false;
        return;
    }

    // ---------------------------
    // CASO 2: Algún otro marcado
    // ---------------------------
    const hayOtros = otros.some(c => c.checked);

    apertura.disabled = hayOtros;

    // El resto siempre habilitado
    otros.forEach(c => c.disabled = false);
    bloqueRenovacion.style.display = "block";

}

const otroAtendido = document.getElementById("otroAtendido");
const atendidoPor = document.getElementById("atendidoPor");
const datosRepresentante = document.getElementById("datosRepresentante");

atendidoPor.addEventListener("change", () => {

    if (atendidoPor.value === "Titular") {

        datosRepresentante.style.display = "none";
        otroAtendido.style.display = "none";

    } else {

        datosRepresentante.style.display = "flex";

        if (atendidoPor.value === "Otro") {
            otroAtendido.style.display = "flex";
        } else {
            otroAtendido.style.display = "none";
        }

    }

});

