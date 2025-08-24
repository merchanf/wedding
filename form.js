function moveUnderlined() {
  const $underline = $(".nav-indicator");
  const $activeLink = $(".nav-list a.active");
  if ($activeLink.length) {
    const linkOffset = $activeLink.offset();
    const linkWidth = $activeLink.outerWidth();
    const navOffset = $underline.parent().offset();
    const leftPosition = linkOffset.left - navOffset.left;
    $underline.css({
      transform: `translateX(${leftPosition}px) scaleX(${linkWidth / 15})`,
      opacity: 1,
    });
  } else {
    $underline.css({ opacity: 0, transform: "translateX(0) scaleX(0.01)" });
  }
}

$(document).on("click", ".nav-list a", function (e) {
  e.preventDefault();
  $(".nav-list a").removeClass("active");
  $(this).addClass("active");
  moveUnderlined();
  const targetId = $(this).attr("href");
  const $target = $(targetId);
  if ($target.length) {
    $("html, body").animate(
      {
        scrollTop: $target.offset().top - 60, // Ajusta el valor según la altura de tu navbar
      },
      500
    );
  }
});

$(window).on("scroll", function () {
  const scrollPosition = $(window).scrollTop();
  let currentSectionId = "";
  $(".nav-list a").each(function () {
    const targetId = $(this).attr("href");
    const $target = $(targetId);
    if ($target.length) {
      const sectionTop = $target.offset().top - 70; // Ajusta según la altura de tu navbar
      if (scrollPosition >= sectionTop) {
        currentSectionId = targetId;
      }
    }
  });
  if (currentSectionId) {
    $(".nav-list a").removeClass("active");
    $(`.nav-list a[href='${currentSectionId}']`).addClass("active");
    moveUnderlined();
  }
});

$(window).on("resize", function () {
  moveUnderlined();
});

// Mostrar el formulario vacío al hacer click en 'llenar otra confirmación'
$(document).on("click", ".js-rsvp-reset", function (e) {
  e.preventDefault();
  // Limpiar campos
  $("#lista-invitados-input").val("");
  $("#diet").val("");
  $("#cars").val("");
  // Restaurar opciones RSVP
  const yesOption = $(".index-rsvp__option[data-value='YES']");
  const noOption = $(".index-rsvp__option[data-value='NO']");
  yesOption.html("Claro que voy!");
  noOption.html("No iré");
  $(".js-rsvp-option").removeClass("is-active");
  yesOption.addClass("is-active");
  // Mostrar formulario y ocultar mensajes
  $(".js-form").show();
  $(".js-form-success").hide();
  $(".js-form-success-decline").hide();
});
const doo = "patvMe3x3zMRqbA8l.";
const re = "b4e97696fdb417baec7f5170ecae522";
const mi = "b12890050b42794680af62fb5a046c14f";
const cancion = `${doo}${re}${mi}`;

const inicializar = () => {
  $("#lista-acompanantes-wrapper").hide();
};

const filtrarInvitados = (invitados) => {
  return invitados.filter((record) => {
    const esTierA = record.fields.Tier === "A";
    return esTierA;
  });
};

async function fetchInvitados() {
  try {
    const response = await axios.get(
      "https://api.airtable.com/v0/appLOZBvwYemQ0FFn/invitados",
      {
        headers: {
          authorization: `Bearer ${cancion}`,
          "Content-Type": "application/json",
        },
      }
    );
    window.invitados = filtrarInvitados(response.data.records);
    // console.log({ invitados: window.invitados });
  } catch (error) {
    console.error(error);
  }
}

// Normaliza texto quitando acentos y convirtiendo a minúsculas
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita diacríticos (acentos)
    .replace(/[^\p{L}\p{N} ]/gu, "") // quita caracteres especiales excepto letras/números/espacio
    .toLowerCase();
}

const actualizarInvitados = () => {
  const invitados = window.invitados || [];
  const $input = $("#lista-invitados-input");
  const $datalist = $("#lista-invitados");
  const valorInput = normalizarTexto($input.val() || "");
  if (valorInput.length === 0) {
    $datalist.empty();
    return;
  }
  $datalist.empty();
  if (!Array.isArray(invitados)) return;
  invitados.forEach((record) => {
    const nombre = record.fields.Nombre || "";
    const nombreNormalizado = normalizarTexto(nombre);
    // Solo mostrar si el nombre empieza exactamente igual a lo tipeado
    if (valorInput.length === 0 || nombreNormalizado.startsWith(valorInput)) {
      $("<option>").val(nombre).attr("data-id", record.id).appendTo($datalist);
    }
  });
};

// Actualizar datalist en cada input
$(document).on("input", "#lista-invitados-input", function () {
  if (!window.invitados) return;
  const valorInput = normalizarTexto($(this).val() || "");
  // Verifica si el input coincide exactamente con algún invitado
  const match = window.invitados.some((record) => {
    const nombre = record.fields.Nombre || "";
    return normalizarTexto(nombre) === valorInput && valorInput.length > 0;
  });
  if (match) {
    // Si hay match exacto, no actualices el datalist (no lo borres)
    return;
  }
  actualizarInvitados(window.invitados);
});

$(document).ready(function () {
  inicializar();
  fetchInvitados();
  handleRsvpFormSubmission();
  actualizarInvitados();
});

const handleRsvpFormSubmission = () => {
  // Handle RSVP form submission
  $(document).on("click", ".index-rsvp__button", async function (e) {
    e.preventDefault();
    const nombre = $("#lista-invitados-input").val();
    const invitados = window.invitados || [];
    const invitado = invitados.find(
      (record) =>
        record.fields.Nombre &&
        record.fields.Nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (!invitado) {
      alert("Por favor selecciona tu nombre de la lista.");
      return;
    }

    console.log({ invitado });

    // Get RSVP answer
    const respuesta = $(".js-rsvp-option.is-active").data("value") || "YES";
    // Get dietary restriction
    const dieta = $("#diet").val();
    // Get preferred drink
    const bebida = $("#cars").val();

    // Prepare fields to update
    const fields = {
      Asiste: respuesta === "YES" ? "si" : "no",
    };

    if (respuesta === "YES") {
      if (bebida && bebida.trim() !== "") {
        fields.Bebida = [bebida];
      }
      if (dieta && dieta.trim() !== "") {
        fields["Restriccion dietaria"] = dieta;
      }
    }

    try {
      await axios.patch(
        `https://api.airtable.com/v0/appLOZBvwYemQ0FFn/invitados/${invitado.id}`,
        { fields },
        {
          headers: {
            authorization: `Bearer ${cancion}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Show appropriate success message with apodo
      $(".js-form").hide();
      const apodo = invitado.fields.Apodo || "";
      $(".index-rsvp__success-message-nickname").text(`${apodo}!`);
      if (respuesta === "NO") {
        $(".js-form-success").hide();
        $(".js-form-success-decline").show();
      } else {
        $(".js-form-success-decline").hide();
        $(".js-form-success").show();
      }
    } catch (error) {
      alert("Ocurrió un error al enviar tu respuesta. Intenta de nuevo.");
      console.error(error);
    }
  });
};
