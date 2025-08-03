const doo = "patvMe3x3zMRqbA8l.";
const re = "b4e97696fdb417baec7f5170ecae522";
const mi = "b12890050b42794680af62fb5a046c14f";
const cancion = `${doo}${re}${mi}`;

const cargarInvitados = (invitados) => {
  const $datalist = $("#invitados");
  $datalist.empty(); // Limpiar opciones previas
  invitados.forEach((record) => {
    console.log(record);
    const nombre = record.fields.Nombre;
    if (nombre) {
      $("<option>").val(nombre).appendTo($datalist);
    }
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
    cargarInvitados(response.data.records);
  } catch (error) {
    console.error(error);
  }
}

fetchInvitados();
