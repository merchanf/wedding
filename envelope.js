// Desvanecer overlay de invitación al hacer clic en el botón
$(document).on("click", "#envelope-intro-overlay .button-base", function () {
  $("#envelope-intro-overlay").addClass("fade-out");
  setTimeout(function () {
    $("#envelope-intro-overlay").css("display", "none");
  }, 900); // Debe coincidir con la transición CSS
});

// --- Mostrar apodo y compañía según el id del query param ---
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function setEnvelopeGuestInfo() {
  const id = getQueryParam("id");
  if (!id) {
    $("#envelope-intro-overlay").css("display", "none");
    return;
  }

  while (window.invitados == null) {
    console.log("Esperando a que los datos de invitados estén disponibles...");
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  console.log("Datos de invitados disponibles:");

  const invitadoEncontrado = window.invitados.find(
    (record) => record.id === id
  );

  if (invitadoEncontrado) {
    $("#envelope-intro-overlay").css("display", "flex");
    $(".envelope-body").css("display", "flex");
    $(".loader").css("display", "none");
    $(".envelope-recipient").text(invitadoEncontrado.fields.Apodo || "");
    var compania =
      invitadoEncontrado.fields.Compania ||
      invitadoEncontrado.fields.compania ||
      "";
    $(".envelope-companion").text(compania);
    if (compania && compania.trim() !== "") {
      $(".envelope-text").text(
        "Queremos compartir con ustedes un día muy especial"
      );
    } else {
      $(".envelope-text").text(
        "Queremos compartir contigo un día muy especial"
      );
    }
  } else {
    $("#envelope-intro-overlay").css("display", "none");
  }
}

// Ejecutar cuando el DOM esté listo
$(document).ready(function () {
  setEnvelopeGuestInfo();
});
