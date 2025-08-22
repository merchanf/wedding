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

  // Guardar los invitados filtrados por Tier A
  invitados.forEach((record) => {
    $("<option>")
      .val(record.fields.Nombre)
      .attr("data-id", record.id)
      .appendTo($datalist);
  });

  // Actualizar opciones al escribir en el input
  $input.on("input", function () {
    actualizarOpciones(this.value);
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
      Bebida: [bebida || ""],
      "Restriccion dietaria": dieta || "",
    };

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
