// Desvanecer overlay de invitación al hacer clic en el botón
$(document).on("click", "#envelope-intro-overlay .button-base", function () {
  $("#envelope-intro-overlay").addClass("fade-out");
  setTimeout(function () {
    $("#envelope-intro-overlay").css("display", "none");
  }, 900); // Debe coincidir con la transición CSS
});
