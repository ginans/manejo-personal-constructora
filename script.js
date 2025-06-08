// Array para almacenar empleados con datos de prueba
let empleados = [
  {
    nombre: "Juan Carlos",
    apellido: "Pérez González",
    fechaNacimiento: "1985-03-15",
    correo: "juan.perez@constructoraabc.cl",
    cargo: "Ingeniero",
    fechaIngreso: "2020-01-15",
  },
  {
    nombre: "María Elena",
    apellido: "Rodríguez Silva",
    fechaNacimiento: "1990-07-22",
    correo: "maria.rodriguez@constructoraabc.cl",
    cargo: "Arquitecto",
    fechaIngreso: "2021-06-10",
  },
  {
    nombre: "Pedro Antonio",
    apellido: "López Martínez",
    fechaNacimiento: "1978-11-08",
    correo: "pedro.lopez@constructoraabc.cl",
    cargo: "Maestro de Obra",
    fechaIngreso: "2019-03-20",
  },
  {
    nombre: "Ana Sofía",
    apellido: "García Fernández",
    fechaNacimiento: "1992-05-12",
    correo: "ana.garcia@constructoraabc.cl",
    cargo: "Electricista",
    fechaIngreso: "2022-09-05",
  },
  {
    nombre: "Carlos Eduardo",
    apellido: "Morales Jiménez",
    fechaNacimiento: "1988-12-03",
    correo: "carlos.morales@constructoraabc.cl",
    cargo: "Albañil",
    fechaIngreso: "2020-11-18",
  },
  {
    nombre: "Lucía Esperanza",
    apellido: "Vargas Castro",
    fechaNacimiento: "1995-09-28",
    correo: "lucia.vargas@constructoraabc.cl",
    cargo: "Plomero",
    fechaIngreso: "2023-02-14",
  },
];
let empleadoTemporal = null;
let empleadoAEliminar = null;

// cargar empleados al iniciar
document.addEventListener("DOMContentLoaded", function () {
  mostrarEmpleados();
  configurarFormulario();
});

// mostrar empleados
function mostrarEmpleados(empleadosFiltrados = null) {
  const listaEmpleados = document.getElementById("lista-empleados");
  const sinEmpleados = document.getElementById("sin-empleados");
  const empleadosAMostrar = empleadosFiltrados || empleados;

  if (empleadosAMostrar.length === 0) {
    listaEmpleados.innerHTML = "";
    sinEmpleados.classList.remove("d-none");
    return;
  }

  sinEmpleados.classList.add("d-none");

  listaEmpleados.innerHTML = empleadosAMostrar
    .map(
      (empleado, index) => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary">${empleado.cargo}</span>
                    <button class="btn btn-outline-danger btn-sm" onclick="eliminarEmpleado(${index})">
                        🗑️
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${empleado.nombre} ${
        empleado.apellido
      }</h5>
                    <p class="card-text">
                        <small class="text-muted">
                            📧 ${empleado.correo}<br>
                            🎂 ${calcularEdad(
                              empleado.fechaNacimiento
                            )} años<br>
                            📅 Ingresó: ${formatearFecha(
                              empleado.fechaIngreso
                            )}<br>
                            ⏰ Antigüedad: ${calcularAntiguedad(
                              empleado.fechaIngreso
                            )}
                        </small>
                    </p>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}


// formulario
function configurarFormulario() {
  const formulario = document.getElementById("formulario-empleado");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormulario()) {
      const datosEmpleado = obtenerDatosFormulario();
      mostrarModalConfirmacion(datosEmpleado);
    }
  });
}

// validar el formulario
function validarFormulario() {
  const formulario = document.getElementById("formulario-empleado");
  let esValido = true;

  // limpiar errores previos
  formulario.querySelectorAll(".is-invalid").forEach((input) => {
    input.classList.remove("is-invalid");
  });

  // validar nombre
  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre || nombre.length < 2) {
    mostrarError("nombre", "El nombre debe tener al menos 2 caracteres");
    esValido = false;
  }

  // validar apellido
  const apellido = document.getElementById("apellido").value.trim();
  if (!apellido || apellido.length < 2) {
    mostrarError("apellido", "El apellido debe tener al menos 2 caracteres");
    esValido = false;
  }

  // validar fecha de nacimiento
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  if (!fechaNacimiento) {
    mostrarError("fechaNacimiento", "La fecha de nacimiento es requerida");
    esValido = false;
  } else {
    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18 || edad > 65) {
      mostrarError("fechaNacimiento", "La edad debe estar entre 18 y 65 años");
      esValido = false;
    }
  }

  // validar correo
  const correo = document.getElementById("correo").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correo || !emailRegex.test(correo)) {
    mostrarError("correo", "Ingresa un correo válido");
    esValido = false;
  } else if (empleados.some((emp) => emp.correo === correo)) {
    mostrarError("correo", "Este correo ya está registrado");
    esValido = false;
  }

  // validar cargo
  const cargo = document.getElementById("cargo").value;
  if (!cargo) {
    mostrarError("cargo", "Selecciona un cargo");
    esValido = false;
  }

  // validar fecha de ingreso
  const fechaIngreso = document.getElementById("fechaIngreso").value;
  if (!fechaIngreso) {
    mostrarError("fechaIngreso", "La fecha de ingreso es requerida");
    esValido = false;
  } else {
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    if (ingreso > hoy) {
      mostrarError("fechaIngreso", "La fecha de ingreso no puede ser futura");
      esValido = false;
    }
  }

  return esValido;
}

// mostrar errores
function mostrarError(campo, mensaje) {
  const input = document.getElementById(campo);
  const errorDiv = document.getElementById(`error-${campo}`);

  input.classList.add("is-invalid");
  errorDiv.textContent = mensaje;
}

// obtener datos del formulario
function obtenerDatosFormulario() {
  return {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    fechaNacimiento: document.getElementById("fechaNacimiento").value,
    correo: document.getElementById("correo").value.trim(),
    cargo: document.getElementById("cargo").value,
    fechaIngreso: document.getElementById("fechaIngreso").value,
  };
}

//modal de confirmacion
function mostrarModalConfirmacion(datosEmpleado) {
  empleadoTemporal = datosEmpleado;

  const datosDiv = document.getElementById("datos-empleado");
  datosDiv.innerHTML = `
        <div class="alert alert-info">
            <strong>Nombre:</strong> ${datosEmpleado.nombre} ${
    datosEmpleado.apellido
  }<br>
            <strong>Correo:</strong> ${datosEmpleado.correo}<br>
            <strong>Cargo:</strong> ${datosEmpleado.cargo}<br>
            <strong>Edad:</strong> ${calcularEdad(
              datosEmpleado.fechaNacimiento
            )} años
        </div>
    `;

  const modal = new bootstrap.Modal(document.getElementById("modalConfirmar"));
  modal.show();
}

// funcion para confirmar agregar empleado
function confirmarAgregar() {
  if (empleadoTemporal) {
    empleados.push(empleadoTemporal);
    mostrarEmpleados();
    limpiarFormulario();

    // cerrar modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalConfirmar")
    );
    modal.hide();

    // mostrar toast de éxito
    mostrarToast("Empleado agregado exitosamente", "success");

    empleadoTemporal = null;
  }
}

// eliminar empleado
function eliminarEmpleado(index) {
  empleadoAEliminar = index;
  const empleado = empleados[index];

  const datosDiv = document.getElementById("datos-eliminar");
  datosDiv.innerHTML = `
        <div class="alert alert-warning">
            <strong>Nombre:</strong> ${empleado.nombre} ${empleado.apellido}<br>
            <strong>Cargo:</strong> ${empleado.cargo}<br>
            <strong>Correo:</strong> ${empleado.correo}
        </div>
    `;

  const modal = new bootstrap.Modal(document.getElementById("modalEliminar"));
  modal.show();
}

// confirmar eliminación
function confirmarEliminar() {
  if (empleadoAEliminar !== null) {
    empleados.splice(empleadoAEliminar, 1);
    mostrarEmpleados();

    // cerrar modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalEliminar")
    );
    modal.hide();

    // mostrar toast de éxito
    mostrarToast("Empleado eliminado exitosamente", "danger");

    empleadoAEliminar = null;
  }
}

//limpiar formulario
function limpiarFormulario() {
  const formulario = document.getElementById("formulario-empleado");
  formulario.reset();

  // clases de validación
  formulario.querySelectorAll(".is-invalid").forEach((input) => {
    input.classList.remove("is-invalid");
  });
}

//mostrar toast
function mostrarToast(mensaje, tipo = "success") {
  const toastContainer = document.querySelector(".toast-container");

  const toastId = "toast-" + Date.now();
  const iconos = {
    success: "✅",
    danger: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-${tipo} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${iconos[tipo]} ${mensaje}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000,
  });

  toast.show();

  // eliminar el toast del DOM después de que se oculte
  toastElement.addEventListener("hidden.bs.toast", function () {
    this.remove();
  });
}

// calcular edad
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();

  if (
    mesNacimiento > mesActual ||
    (mesNacimiento === mesActual && nacimiento.getDate() > hoy.getDate())
  ) {
    edad--;
  }

  return edad;
}

//formatear fecha
function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

//calcular antigüedad laboral
function calcularAntiguedad(fechaIngreso) {
  const hoy = new Date();
  const ingreso = new Date(fechaIngreso);
  const diferencia = hoy - ingreso;
  const años = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
  const meses = Math.floor(
    (diferencia % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );

  if (años > 0) {
    return `${años} año${años > 1 ? "s" : ""}`;
  } else if (meses > 0) {
    return `${meses} mes${meses > 1 ? "es" : ""}`;
  } else {
    return "Menos de un mes";
  }
}
