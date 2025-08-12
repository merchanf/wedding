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
  console.log("Nombre seleccionado:", nombreSeleccionado);
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
});
