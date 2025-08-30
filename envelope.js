// Oculta el overlay si no hay id en la URL
$(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get("id");
  if (!id) {
    $("#envelope-intro-overlay").hide();
  }
});

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

function setEnvelopeGuestInfo() {
  // Esperar a que window.invitados esté disponible
  if (!window.invitados) {
    setTimeout(setEnvelopeGuestInfo, 200);
    return;
  }
  const id = getQueryParam("id");
  if (!id) return;
  const invitadoEncontrado = window.invitados.find(
    (record) => record.id === id
  );
  if (invitadoEncontrado) {
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
  }
}

// Ejecutar cuando el DOM esté listo
$(document).ready(function () {
  setEnvelopeGuestInfo();
});
