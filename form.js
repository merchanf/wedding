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

const cargarInvitados = (invitados) => {
  const $input = $("#lista-invitados-input");
  const $datalist = $("#lista-invitados");
  let invitadosFiltrados = [];

  // Filtrar y mostrar opciones según el texto ingresado
  function actualizarOpciones(valor) {
    $datalist.empty();
    if (!valor) return;
    invitadosFiltrados
      .filter(
        (record) =>
          record.fields.Nombre &&
          record.fields.Nombre.toLowerCase().startsWith(valor.toLowerCase())
      )
      .forEach((record) => {
        $("<option>")
          .val(record.fields.Nombre)
          .attr("data-id", record.id)
          .appendTo($datalist);
      });
  }

  // Guardar los invitados filtrados por Tier A
  invitadosFiltrados = filtrarInvitados(invitados);

  // Actualizar opciones al escribir en el input
  $input.on("input", function () {
    actualizarOpciones(this.value);
  });
};

$("#lista-invitados-input").on("change", async function () {
  const nombreSeleccionado = $(this).val();
  const invitados = window.invitados || [];
  let invitadoSeleccionado = invitados.find(
    (record) =>
      record.fields.Nombre &&
      record.fields.Nombre.toLowerCase() === nombreSeleccionado.toLowerCase()
  );

  const $lista = $("#lista-acompanantes");
  $lista.empty();

  if (invitadoSeleccionado.fields["Nombre (from Viene con)"].length > 0) {
    invitadoSeleccionado.fields["Nombre (from Viene con)"].forEach((nombre) => {
      const $li = $("<li></li>");
      const $wrapper = $('<div class="checkbox-wrapper-13"></div>');
      const $checkbox = $(
        '<input type="checkbox" name="plus-one" value="yes">'
      );
      const $label = $("<label></label>").text(nombre);
      $wrapper.append($checkbox).append($label);
      $li.append($wrapper);
      $lista.append($li);
    });
  } else {
    $("#lista-acompanantes-wrapper").hide();
  }
});

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
    window.invitados = response.data.records;
    cargarInvitados(response.data.records);
  } catch (error) {
    console.error(error);
  }
}

$(document).ready(function () {
  inicializar();
  fetchInvitados();
  handleRsvpFormSubmission();
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
      Bebida: bebida || "",
      "Restriccion dietaria": dieta || "",
    };

    console.log("Enviando respuesta:", {
      nombre: invitado.fields.Nombre,
      respuesta,
      dieta,
      bebida,
    });

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
      // Show appropriate success message
      $(".js-form").hide();
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
